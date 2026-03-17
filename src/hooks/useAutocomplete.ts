/**
 * useAutocomplete — Trie-backed search suggestions hook
 *
 * Manages a persistent trie that:
 * 1. Seeds with common search terms on first load
 * 2. Learns from every search the user performs
 * 3. Persists across sessions via localStorage
 * 4. Returns prefix-matched suggestions ranked by frequency
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { SEED_TERMS, SearchTrie } from "../lib/search/trie";

const STORAGE_KEY = "agentic-search-trie";

/** Singleton trie instance shared across hook consumers */
let globalTrie: SearchTrie | null = null;

function createSeededTrie(): SearchTrie {
	const trie = new SearchTrie();
	for (const term of SEED_TERMS) {
		trie.insert(term);
	}
	return trie;
}

function getOrCreateTrie(): SearchTrie {
	if (globalTrie) return globalTrie;

	if (typeof window === "undefined" || typeof localStorage === "undefined") {
		globalTrie = createSeededTrie();
		return globalTrie;
	}

	// Try to restore from localStorage
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			globalTrie = SearchTrie.deserialize(stored);
			// Ensure seed terms are present (in case new ones were added)
			for (const term of SEED_TERMS) {
				if (!globalTrie.has(term)) {
					globalTrie.insert(term);
				}
			}
			return globalTrie;
		}
	} catch {
		// localStorage not available or corrupted
	}

	// Fresh trie with seed terms
	globalTrie = createSeededTrie();
	return globalTrie;
}

function persistTrie(trie: SearchTrie): void {
	if (typeof window === "undefined" || typeof localStorage === "undefined") {
		return;
	}

	try {
		localStorage.setItem(STORAGE_KEY, trie.serialize());
	} catch {
		// localStorage full or unavailable — silently fail
	}
}

export interface UseAutocompleteReturn {
	/** Current suggestions matching the input prefix */
	suggestions: string[];
	/** Record a completed search to increase its frequency */
	recordSearch: (query: string) => void;
	/** Clear all learned search history (keeps seed terms) */
	clearHistory: () => void;
}

export function useAutocomplete(
	input: string,
	maxSuggestions = 6,
): UseAutocompleteReturn {
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const trieRef = useRef<SearchTrie>(getOrCreateTrie());

	// Update suggestions when input changes
	useEffect(() => {
		const trimmed = input.trim();
		if (trimmed.length < 2) {
			setSuggestions([]);
			return;
		}

		const results = trieRef.current.search(trimmed, maxSuggestions);
		// Don't suggest the exact current input
		const filtered = results.filter(
			(r) => r.toLowerCase() !== trimmed.toLowerCase(),
		);
		setSuggestions(filtered);
	}, [input, maxSuggestions]);

	const recordSearch = useCallback((query: string) => {
		const trimmed = query.trim();
		if (!trimmed) return;
		trieRef.current.insert(trimmed);
		persistTrie(trieRef.current);
	}, []);

	const clearHistory = useCallback(() => {
		globalTrie = new SearchTrie();
		for (const term of SEED_TERMS) {
			globalTrie.insert(term);
		}
		trieRef.current = globalTrie;
		persistTrie(globalTrie);
		setSuggestions([]);
	}, []);

	return { suggestions, recordSearch, clearHistory };
}
