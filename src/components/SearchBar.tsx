/**
 * SearchBar Component
 * Main search interface with real-time feedback
 */

import { useState, FormEvent } from "react";
import { Search, Loader2, Sparkles } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching?: boolean;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  isSearching = false,
  placeholder = "Search across the web with AI agents...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isSearching) {
      onSearch(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="relative group">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors">
          {isSearching ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSearching}
          placeholder={placeholder}
          className="w-full pl-12 pr-32 py-4 text-lg border-2 border-gray-300 rounded-xl
                     focus:border-primary-500 focus:ring-4 focus:ring-primary-100
                     disabled:bg-gray-50 disabled:cursor-not-allowed
                     transition-all duration-200 outline-none"
        />

        {/* Agent Badge */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-sm text-gray-500">
          <Sparkles className="w-4 h-4 text-primary-500" />
          <span className="font-medium">AI Agents</span>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          disabled={!query.trim() || isSearching}
          className="absolute right-2 top-1/2 -translate-y-1/2
                     px-6 py-2 bg-primary-600 text-white rounded-lg
                     hover:bg-primary-700 active:bg-primary-800
                     disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition-colors duration-200 font-medium"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Status Message */}
      {isSearching && (
        <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
          </div>
          <span>AI agents are searching across multiple sources...</span>
        </div>
      )}

      {/* Quick Tips */}
      {!isSearching && !query && (
        <div className="mt-4 text-sm text-gray-500 space-y-1">
          <p className="font-medium">Try searching for:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Latest AI research papers",
              "React best practices 2025",
              "TypeScript performance tips",
              "Web3 security vulnerabilities",
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setQuery(suggestion)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
