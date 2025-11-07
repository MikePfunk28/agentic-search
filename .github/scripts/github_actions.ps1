<#
.SYNOPSIS
  Create/find a GitHub Projects (v2) project, ensure views, and backfill open issues & PRs.
.DESCRIPTION
  Uses gh CLI for Projects v2 API. Does NOT commit or push to repo.
.PARAMETER ProjectName
  Name of the project to create or update
.PARAMETER ProjectDesc
  Description for the project (on creation)
.PARAMETER Owner
  Repository owner (user or org)
.PARAMETER Repo
  Full repository name (owner/repo)
#>
param(
  [Parameter(Mandatory=$false)]
  [string]$ProjectName = "Auto Project",

  [Parameter(Mandatory=$false)]
  [string]$ProjectDesc = "Automated project created by Actions.",

  [Parameter(Mandatory=$false)]
  [string]$Owner = $env:OWNER,

  [Parameter(Mandatory=$false)]
  [string]$Repo = $env:REPO
)

$ErrorActionPreference = "Stop"

function Log($msg) { Write-Host "[setup-project] $msg" -ForegroundColor Cyan }
function Warn($msg) { Write-Host "[setup-project][WARN] $msg" -ForegroundColor Yellow }
function Err($msg) { Write-Host "[setup-project][ERROR] $msg" -ForegroundColor Red }

# Resolve owner/repo
if ([string]::IsNullOrEmpty($Owner)) {
  if ($env:GITHUB_REPOSITORY) {
    $Owner = ($env:GITHUB_REPOSITORY -split "/")[0]
    Log "Owner resolved: $Owner"
  } else {
    Err "Owner not set. Provide -Owner or set GITHUB_REPOSITORY."
    exit 1
  }
}

if ([string]::IsNullOrEmpty($Repo)) {
  if ($env:GITHUB_REPOSITORY) {
    $Repo = $env:GITHUB_REPOSITORY
    Log "Repo resolved: $Repo"
  } else {
    Err "Repo not set. Provide -Repo or set GITHUB_REPOSITORY."
    exit 1
  }
}

# Extract just repo name (not owner/repo)
$RepoName = ($Repo -split "/")[-1]

# Validate gh CLI
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Err "gh CLI not found in PATH."
  exit 1
}

Log "Owner: $Owner"
Log "Repo: $Repo"
Log "Project Name: $ProjectName"

# Helper: Get project ID by name
function Get-ProjectIdByName {
  param([string]$owner, [string]$name)

  try {
    $json = gh projects list --owner $owner --limit 200 --format json 2>$null
    if ([string]::IsNullOrEmpty($json)) { return $null }

    $projects = $json | ConvertFrom-Json
    foreach ($p in $projects) {
      if ($p.title -eq $name) {
        return $p.id
      }
    }
  } catch {
    Warn "Failed to list projects: $_"
  }
  return $null
}

# 1) Find or create project
Log "Looking for project '$ProjectName'..."
$projectId = Get-ProjectIdByName -owner $Owner -name $ProjectName

if (-not $projectId) {
  Log "Project not found. Creating new project..."
  try {
    gh projects create $ProjectName --owner $Owner 2>$null | Out-Null
    Start-Sleep -Seconds 3
    $projectId = Get-ProjectIdByName -owner $Owner -name $ProjectName

    if (-not $projectId) {
      Err "Project creation failed or project not found after creation."
      exit 1
    }
    Log "Created project (ID: $projectId)"
  } catch {
    Err "Failed to create project. Ensure token has project permissions. Error: $_"
    exit 1
  }
} else {
  Log "Found existing project (ID: $projectId)"
}

# 2) Ensure views exist
function Ensure-View {
  param([string]$projectId, [string]$type, [string]$name)

  Log "Checking for $type view '$name'..."
  try {
    $viewJson = gh projects view $projectId --format json 2>$null
    if ($viewJson) {
      $project = $viewJson | ConvertFrom-Json
      $exists = $false

      if ($project.views) {
        foreach ($v in $project.views) {
          if ($v.name -eq $name) {
            $exists = $true
            break
          }
        }
      }

      if ($exists) {
        Log "  ✓ View '$name' already exists"
        return
      }
    }

    Log "  Adding $type view '$name'..."
    # Note: gh projects view --add-view may not be supported in all gh versions
    # This is a best-effort attempt
    $result = gh api graphql -f query='
      mutation($projectId: ID!, $name: String!) {
        addProjectV2View(input: {projectId: $projectId, name: $name}) {
          view {
            id
            name
          }
        }
      }
    ' -f projectId=$projectId -f name=$name 2>$null

    if ($LASTEXITCODE -eq 0) {
      Log "  ✓ Added view '$name'"
    } else {
      Warn "  Could not add view via API (may require manual setup)"
    }
  } catch {
    Warn "  Error ensuring view '$name': $_"
  }
}

Ensure-View -projectId $projectId -type "TABLE" -name "Tasks Table"
Ensure-View -projectId $projectId -type "BOARD" -name "Kanban Board"
Ensure-View -projectId $projectId -type "ROADMAP" -name "Timeline"

# 3) Backfill open issues (excluding PRs)
Log "Backfilling open issues..."
$failed = @()

try {
  $issuesJson = gh api --paginate "repos/$Owner/$RepoName/issues?state=open&per_page=100" 2>$null

  if ($issuesJson) {
    $issues = $issuesJson | ConvertFrom-Json
    $issueCount = 0

    foreach ($issue in $issues) {
      # Skip PRs (they have pull_request property)
      if ($issue.pull_request) { continue }

      $issueCount++
      $num = $issue.number
      $title = $issue.title

      Log "  Adding issue #$num : $title"
      try {
        gh project item-add $projectId --owner $Owner --url "https://github.com/$Repo/issues/$num" 2>$null | Out-Null
      } catch {
        Warn "  Failed to add issue #$num (may already exist)"
        $failed += "issue #$num"
      }
    }

    Log "Processed $issueCount issues"
  } else {
    Log "No open issues found"
  }
} catch {
  Warn "Failed to fetch issues: $_"
}

# 4) Backfill open PRs
Log "Backfilling open pull requests..."

try {
  $prsJson = gh api --paginate "repos/$Owner/$RepoName/pulls?state=open&per_page=100" 2>$null

  if ($prsJson) {
    $prs = $prsJson | ConvertFrom-Json
    $prCount = 0

    foreach ($pr in $prs) {
      $prCount++
      $num = $pr.number
      $title = $pr.title

      Log "  Adding PR #$num : $title"
      try {
        gh project item-add $projectId --owner $Owner --url "https://github.com/$Repo/pull/$num" 2>$null | Out-Null
      } catch {
        Warn "  Failed to add PR #$num (may already exist)"
        $failed += "PR #$num"
      }
    }

    Log "Processed $prCount pull requests"
  } else {
    Log "No open PRs found"
  }
} catch {
  Warn "Failed to fetch PRs: $_"
}

# 5) Final report
Log ""
Log "=========================================="
Log "Setup complete!"
Log "Project ID: $projectId"
Log "Project Name: $ProjectName"
Log "=========================================="

if ($failed.Count -gt 0) {
  Warn "Failed to add $($failed.Count) items:"
  foreach ($f in $failed) {
    Write-Host "  - $f"
  }
} else {
  Log "All items added successfully!"
}

Log ""
Log "Notes:"
Log "- This script does NOT modify your repository code"
Log "- No commits or pushes were made"
Log "- For org-level projects, use a PAT with project permissions in secrets.GH_TOKEN"