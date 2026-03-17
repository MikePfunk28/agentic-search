/**
 * SearchBar Component
 * Main search interface with real-time feedback
 */

import { Loader2, Mic, MicOff, Search, Sparkles } from "lucide-react";
import {
	type FormEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { useAutocomplete } from "../hooks/useAutocomplete";
import { useSpeechRecognition } from "../hooks/useSpeech";

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
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const { suggestions, recordSearch } = useAutocomplete(query);
	const suggestionsRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const {
		supported: micSupported,
		listening,
		startListening,
		stopListening,
		transcript,
		clearTranscript,
	} = useSpeechRecognition();
	const prevTranscriptRef = useRef("");
	const lastSubmittedVoiceQueryRef = useRef("");

	// Show suggestions when typing, hide when empty
	useEffect(() => {
		setShowSuggestions(suggestions.length > 0 && query.trim().length >= 2);
		setSelectedIndex(-1);
	}, [suggestions, query]);

	// Close suggestions on outside click
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				suggestionsRef.current &&
				!suggestionsRef.current.contains(e.target as Node) &&
				inputRef.current &&
				!inputRef.current.contains(e.target as Node)
			) {
				setShowSuggestions(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const selectSuggestion = useCallback(
		(suggestion: string) => {
			setQuery(suggestion);
			setShowSuggestions(false);
			recordSearch(suggestion);
			onSearch(suggestion);
		},
		[onSearch, recordSearch],
	);

	// When speech recognition produces a final transcript, populate the input
	useEffect(() => {
		if (transcript && transcript !== prevTranscriptRef.current) {
			prevTranscriptRef.current = transcript;
			setQuery(transcript);
		}
	}, [transcript]);

	useEffect(() => {
		const voiceQuery = transcript.trim();
		if (!voiceQuery || listening || isSearching) {
			return;
		}
		if (lastSubmittedVoiceQueryRef.current === voiceQuery) {
			return;
		}

		lastSubmittedVoiceQueryRef.current = voiceQuery;
		onSearch(voiceQuery);
		clearTranscript();
	}, [clearTranscript, isSearching, listening, onSearch, transcript]);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (query.trim() && !isSearching) {
			setShowSuggestions(false);
			recordSearch(query.trim());
			onSearch(query.trim());
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (showSuggestions && suggestions.length > 0) {
			if (e.key === "ArrowDown") {
				e.preventDefault();
				setSelectedIndex((prev) =>
					prev < suggestions.length - 1 ? prev + 1 : 0,
				);
				return;
			}
			if (e.key === "ArrowUp") {
				e.preventDefault();
				setSelectedIndex((prev) =>
					prev > 0 ? prev - 1 : suggestions.length - 1,
				);
				return;
			}
			if (e.key === "Tab" && selectedIndex >= 0) {
				e.preventDefault();
				setQuery(suggestions[selectedIndex]);
				setShowSuggestions(false);
				return;
			}
			if (e.key === "Enter" && selectedIndex >= 0) {
				e.preventDefault();
				selectSuggestion(suggestions[selectedIndex]);
				return;
			}
			if (e.key === "Escape") {
				setShowSuggestions(false);
				return;
			}
		}
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
					ref={inputRef}
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyDown={handleKeyDown}
					onFocus={() => {
						if (suggestions.length > 0 && query.trim().length >= 2) {
							setShowSuggestions(true);
						}
					}}
					disabled={isSearching}
					placeholder={listening ? "Listening..." : placeholder}
					autoComplete="off"
					className="w-full pl-12 pr-44 py-4 text-lg border-2 border-gray-300 rounded-xl
                     focus:border-primary-500 focus:ring-4 focus:ring-primary-100
                     disabled:bg-gray-50 disabled:cursor-not-allowed
                     transition-all duration-200 outline-none"
				/>

				{/* Voice Input Button */}
				{micSupported && (
					<button
						type="button"
						onClick={() => {
							if (listening) {
								stopListening();
							} else {
								lastSubmittedVoiceQueryRef.current = "";
								clearTranscript();
								startListening();
							}
						}}
						disabled={isSearching}
						className={`absolute right-32 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors duration-200
                       ${listening ? "bg-red-100 text-red-600 hover:bg-red-200" : "text-gray-400 hover:text-primary-600 hover:bg-gray-100"}
                       disabled:opacity-50 disabled:cursor-not-allowed`}
						title={listening ? "Stop listening" : "Voice search"}
						aria-label={listening ? "Stop listening" : "Voice search"}
					>
						{listening ? (
							<MicOff className="w-5 h-5" />
						) : (
							<Mic className="w-5 h-5" />
						)}
					</button>
				)}

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

				{/* Autocomplete Suggestions Dropdown */}
				{showSuggestions && suggestions.length > 0 && (
					<div
						ref={suggestionsRef}
						className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200
                         rounded-lg shadow-lg z-50 overflow-hidden"
					>
						{suggestions.map((suggestion, index) => {
							const prefixLen = query.trim().length;
							const matchedPart = suggestion.slice(0, prefixLen);
							const completionPart = suggestion.slice(prefixLen);

							return (
								<button
									key={suggestion}
									type="button"
									onClick={() => selectSuggestion(suggestion)}
									onMouseEnter={() => setSelectedIndex(index)}
									className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2
                             transition-colors duration-100
                             ${index === selectedIndex ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-50"}`}
								>
									<Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
									<span>
										<span className="font-medium">{matchedPart}</span>
										<span className="text-gray-500">{completionPart}</span>
									</span>
								</button>
							);
						})}
					</div>
				)}
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
