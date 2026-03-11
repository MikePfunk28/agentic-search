/**
 * Trie (prefix tree) for fast autocomplete suggestions.
 *
 * Supports:
 * - O(k) insert/lookup where k = word length
 * - Prefix search returning top-N completions ranked by frequency
 * - Serialization to/from JSON for localStorage persistence
 */

interface TrieNode {
	children: Map<string, TrieNode>;
	/** How many times a complete word ending here has been inserted */
	frequency: number;
	/** Whether this node marks the end of a stored word */
	isEnd: boolean;
}

function createNode(): TrieNode {
	return { children: new Map(), frequency: 0, isEnd: false };
}

export class SearchTrie {
	private root: TrieNode = createNode();
	private _size = 0;

	get size(): number {
		return this._size;
	}

	/** Insert a word/phrase into the trie. Repeated inserts increase frequency. */
	insert(word: string): void {
		const key = word.toLowerCase().trim();
		if (!key) return;

		let node = this.root;
		for (const char of key) {
			let child = node.children.get(char);
			if (!child) {
				child = createNode();
				node.children.set(char, child);
			}
			node = child;
		}

		if (!node.isEnd) this._size++;
		node.isEnd = true;
		node.frequency++;
	}

	/** Return all completions for a prefix, sorted by frequency (descending). */
	search(prefix: string, maxResults = 8): string[] {
		const key = prefix.toLowerCase().trim();
		if (!key) return [];

		// Navigate to the prefix node
		let node = this.root;
		for (const char of key) {
			const child = node.children.get(char);
			if (!child) return []; // No completions exist
			node = child;
		}

		// DFS to collect all words under this prefix
		const results: Array<{ word: string; frequency: number }> = [];
		this.collectWords(node, key, results, maxResults * 3);

		// Sort by frequency descending, then alphabetically
		results.sort(
			(a, b) => b.frequency - a.frequency || a.word.localeCompare(b.word),
		);

		return results.slice(0, maxResults).map((r) => r.word);
	}

	/** Check if the trie contains an exact match */
	has(word: string): boolean {
		const key = word.toLowerCase().trim();
		let node = this.root;
		for (const char of key) {
			const child = node.children.get(char);
			if (!child) return false;
			node = child;
		}
		return node.isEnd;
	}

	/** Serialize to a JSON-safe format for localStorage persistence */
	serialize(): string {
		const entries: Array<[string, number]> = [];
		this.collectAll(this.root, "", entries);
		return JSON.stringify(entries);
	}

	/** Restore from serialized JSON */
	static deserialize(json: string): SearchTrie {
		const trie = new SearchTrie();
		try {
			const entries: Array<[string, number]> = JSON.parse(json);
			for (const [word, freq] of entries) {
				for (let i = 0; i < freq; i++) {
					trie.insert(word);
				}
			}
		} catch {
			// Corrupted data — return empty trie
		}
		return trie;
	}

	// ── Internal helpers ────────────────────────────────────────────

	private collectWords(
		node: TrieNode,
		prefix: string,
		results: Array<{ word: string; frequency: number }>,
		limit: number,
	): void {
		if (results.length >= limit) return;

		if (node.isEnd) {
			results.push({ word: prefix, frequency: node.frequency });
		}

		for (const [char, child] of node.children) {
			this.collectWords(child, prefix + char, results, limit);
		}
	}

	private collectAll(
		node: TrieNode,
		prefix: string,
		entries: Array<[string, number]>,
	): void {
		if (node.isEnd) {
			entries.push([prefix, node.frequency]);
		}
		for (const [char, child] of node.children) {
			this.collectAll(child, prefix + char, entries);
		}
	}
}

/** Common search terms to seed the trie — gives new users instant suggestions */
export const SEED_TERMS: string[] = [
	"latest AI research papers",
	"latest machine learning papers",
	"best restaurants near me",
	"best restaurants in new york",
	"how to fix memory leak in node.js",
	"how to learn programming",
	"how to build a website",
	"react best practices",
	"react server components",
	"react performance optimization",
	"typescript tutorial",
	"typescript generics explained",
	"typescript performance tips",
	"python data science",
	"python machine learning",
	"javascript async await",
	"javascript promises explained",
	"css grid layout tutorial",
	"css flexbox guide",
	"next.js vs remix",
	"next.js app router",
	"docker tutorial for beginners",
	"kubernetes basics",
	"web3 security vulnerabilities",
	"blockchain explained",
	"rust vs go comparison",
	"rust programming tutorial",
	"cloud computing fundamentals",
	"aws vs azure vs gcp",
	"database optimization techniques",
	"postgresql vs mysql",
	"redis caching strategies",
	"api design best practices",
	"rest api vs graphql",
	"microservices architecture",
	"system design interview",
	"data structures and algorithms",
	"neural network fundamentals",
	"large language models explained",
	"transformer architecture deep dive",
	"rag retrieval augmented generation",
	"vector database comparison",
	"open source alternatives",
	"cybersecurity best practices",
	"oauth2 authentication flow",
	"jwt token explained",
	"git branching strategies",
	"ci cd pipeline setup",
	"agile vs waterfall",
	"product management frameworks",
];
