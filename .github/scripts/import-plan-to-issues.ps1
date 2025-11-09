<#
.SYNOPSIS
  Parse docs/plan.md and create GitHub issues from unchecked tasks
.DESCRIPTION
  Reads markdown files with checkbox lists and creates GitHub issues for unchecked items.
  Skips already-checked items and avoids creating duplicate issues.
.PARAMETER PlanFile
  Path to the plan markdown file (default: docs/plan.md)
.PARAMETER Owner
  Repository owner
.PARAMETER Repo
  Repository name (owner/repo)
.PARAMETER DryRun
  If set, shows what would be created without actually creating issues
#>
param(
  [Parameter(Mandatory=$false)]
  [string]$PlanFile = "docs/plan.md",

  [Parameter(Mandatory=$false)]
  [string]$Owner = $env:OWNER,

  [Parameter(Mandatory=$false)]
  [string]$Repo = $env:REPO,

  [Parameter(Mandatory=$false)]
  [switch]$DryRun = $false
)

$ErrorActionPreference = "Stop"

function Log($msg) { Write-Host "[import-plan] $msg" -ForegroundColor Cyan }
function Warn($msg) { Write-Host "[import-plan][WARN] $msg" -ForegroundColor Yellow }
function Err($msg) { Write-Host "[import-plan][ERROR] $msg" -ForegroundColor Red }

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

$RepoName = ($Repo -split "/")[-1]

# Validate gh CLI
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Err "gh CLI not found in PATH."
  exit 1
}

# Check if plan file exists
if (-not (Test-Path $PlanFile)) {
  Err "Plan file not found: $PlanFile"
  exit 1
}

Log "Owner: $Owner"
Log "Repo: $Repo"
Log "Plan file: $PlanFile"
if ($DryRun) {
  Warn "DRY RUN MODE - No issues will be created"
}
Log ""

# Read plan file
$content = Get-Content $PlanFile -Raw
$lines = Get-Content $PlanFile

# Get existing issues to avoid duplicates
Log "Fetching existing issues to avoid duplicates..."
try {
  $existingIssuesJson = gh issue list --repo $Repo --limit 10000 --state all --json title
  $existingIssues = @()
  if ($existingIssuesJson) {
    $existingIssues = @(
      $existingIssuesJson |
        ConvertFrom-Json |
        ForEach-Object { $_.title }
    )
  }
  Log "Found $($existingIssues.Count) existing issues"
} catch {
  Warn "Could not fetch existing issues: $_"
  $existingIssues = @()
}

# Parse tasks from markdown
$currentSection = "task"
$tasksToCreate = @()

foreach ($line in $lines) {
  # Detect section headers (## Something)
  if ($line -match '^##\s+(.+)$') {
    $sectionTitle = $matches[1].Trim()

    # Determine label based on section title
    # Check enhancement patterns first to avoid broad "bug" matches overriding specific intents
    # (e.g., "Feature Bugs" should be enhancement, not bug)
    if ($sectionTitle -match 'feature|implement|add|enhancement') {
      $currentSection = "enhancement"
    } elseif ($sectionTitle -match 'bug|fix|issue') {
      $currentSection = "bug"
    } else {
      $currentSection = "task"
    }

    Log "Section: $sectionTitle (label: $currentSection)"
    continue
  }

  # Find unchecked checkboxes: - [ ] or * [ ] Task name
  if ($line -match '^\s*[-*]\s+\[\s\]\s+(.+)$') {
    $taskTitle = $matches[1].Trim()

    # Skip if issue already exists
    if ($existingIssues -contains $taskTitle) {
      Log "  ⏭️  Skipping (already exists): $taskTitle"
      continue
    }

    $tasksToCreate += @{
      Title = $taskTitle
      Label = $currentSection
    }

    Log "  ✓ Found task: $taskTitle [$currentSection]"
  }

  # Skip checked checkboxes: - [x] or * [X] Task name
  if ($line -match '^\s*[-*]\s+\[[xX]\]\s+(.+)$') {
    $taskTitle = $matches[1].Trim()
    Log "  ⏭️  Skipping (completed): $taskTitle"
  }
}

Log ""
Log "=========================================="
Log "Found $($tasksToCreate.Count) new tasks to create as issues"
Log "=========================================="
Log ""

if ($tasksToCreate.Count -eq 0) {
  Log "No new tasks to create. All tasks either completed or already exist as issues."
  exit 0
}

# Create issues
$created = 0
$failed = 0

foreach ($task in $tasksToCreate) {
  $title = $task.Title
  $label = $task.Label

  if ($DryRun) {
    Log "[DRY RUN] Would create issue: '$title' with label: $label"
    continue
  }

  Log "Creating issue: $title"
  try {
    $issueUrl = gh issue create --repo $Repo --title $title --label $label --body "Created from $PlanFile" 2>$null
    if ($LASTEXITCODE -eq 0) {
      Log "  ✓ Created: $issueUrl"
      $created++
    } else {
      Warn "  ✗ Failed to create issue: $title"
      $failed++
    }
  } catch {
    Warn "  ✗ Error creating issue '$title': $_"
    $failed++
  }
}

Log ""
Log "=========================================="
Log "Import complete!"
Log "Created: $created issues"
if ($failed -gt 0) {
  Warn "Failed: $failed issues"
}
Log "=========================================="
Log ""
Log "Next steps:"
Log "1. Check your issues: https://github.com/$Repo/issues"
Log "2. The setup-github-projects workflow will add them to your project automatically"
Log "3. Mark tasks as [x] in $PlanFile when completed"