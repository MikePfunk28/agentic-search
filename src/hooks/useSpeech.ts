/**
 * useSpeech Hook
 * Browser-native speech recognition (voice input) and speech synthesis (read aloud).
 * Uses the Web Speech API — free, no API key, runs on any device.
 * Gracefully no-ops if the browser doesn't support it.
 */

import { useCallback, useEffect, useRef, useState } from "react";

function pickPreferredVoice(
	voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
	const englishVoices = voices.filter((voice) => voice.lang.startsWith("en"));
	if (englishVoices.length === 0) {
		return voices[0] ?? null;
	}

	const preferredNames = [
		"microsoft aria",
		"microsoft jenny",
		"microsoft ava",
		"microsoft guy",
		"google us english",
		"google uk english female",
		"samantha",
		"daniel",
		"natural",
		"neural",
	];

	const sorted = [...englishVoices].sort((a, b) => {
		const aName = a.name.toLowerCase();
		const bName = b.name.toLowerCase();
		const aRank = preferredNames.findIndex((name) => aName.includes(name));
		const bRank = preferredNames.findIndex((name) => bName.includes(name));
		const aScore = aRank === -1 ? preferredNames.length : aRank;
		const bScore = bRank === -1 ? preferredNames.length : bRank;

		if (aScore !== bScore) {
			return aScore - bScore;
		}

		if (a.localService !== b.localService) {
			return a.localService ? -1 : 1;
		}

		return a.name.localeCompare(b.name);
	});

	return sorted[0] ?? null;
}

// ── Speech Recognition (voice → text) ──────────────────────────────────

interface SpeechRecognitionHook {
	/** Whether the browser supports speech recognition */
	supported: boolean;
	/** Whether we're currently listening */
	listening: boolean;
	/** Start listening for voice input */
	startListening: () => void;
	/** Stop listening */
	stopListening: () => void;
	/** The transcript captured so far */
	transcript: string;
	/** Clear the transcript */
	clearTranscript: () => void;
}

interface SpeechRecognitionAlternativeLike {
	transcript: string;
}

interface SpeechRecognitionResultLike {
	0: SpeechRecognitionAlternativeLike;
	length: number;
}

interface SpeechRecognitionEventLike {
	results: ArrayLike<SpeechRecognitionResultLike>;
}

interface BrowserSpeechRecognition {
	continuous: boolean;
	interimResults: boolean;
	lang: string;
	onresult: ((event: SpeechRecognitionEventLike) => void) | null;
	onend: (() => void) | null;
	onerror: (() => void) | null;
	start: () => void;
	stop: () => void;
}

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

function getSpeechRecognitionConstructor():
	| BrowserSpeechRecognitionConstructor
	| undefined {
	const speechWindow = window as Window & {
		SpeechRecognition?: BrowserSpeechRecognitionConstructor;
		webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
	};

	return speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
	const [supported, setSupported] = useState(false);
	const [listening, setListening] = useState(false);
	const [transcript, setTranscript] = useState("");
	const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

	useEffect(() => {
		const SpeechRecognition = getSpeechRecognitionConstructor();
		if (SpeechRecognition) {
			setSupported(true);
			const recognition = new SpeechRecognition();
			recognition.continuous = false;
			recognition.interimResults = true;
			recognition.lang = "en-US";

			recognition.onresult = (event: SpeechRecognitionEventLike) => {
				let text = "";
				for (let i = 0; i < event.results.length; i++) {
					text += event.results[i][0].transcript;
				}
				setTranscript(text);
			};

			recognition.onend = () => setListening(false);
			recognition.onerror = () => setListening(false);

			recognitionRef.current = recognition;
		}

		return () => {
			try {
				recognitionRef.current?.stop();
			} catch {
				/* ignore */
			}
		};
	}, []);

	const startListening = useCallback(() => {
		if (!recognitionRef.current) return;
		setTranscript("");
		setListening(true);
		try {
			recognitionRef.current.start();
		} catch {
			setListening(false);
		}
	}, []);

	const stopListening = useCallback(() => {
		if (!recognitionRef.current) return;
		try {
			recognitionRef.current.stop();
		} catch {
			/* ignore */
		}
		setListening(false);
	}, []);

	const clearTranscript = useCallback(() => setTranscript(""), []);

	return {
		supported,
		listening,
		startListening,
		stopListening,
		transcript,
		clearTranscript,
	};
}

// ── Speech Synthesis (text → voice) ────────────────────────────────────

interface SpeechSynthesisHook {
	/** Whether the browser supports speech synthesis */
	supported: boolean;
	/** Whether we're currently speaking */
	speaking: boolean;
	/** Speak the given text. Non-blocking — runs in background. */
	speak: (text: string) => void;
	/** Stop speaking immediately */
	stop: () => void;
}

export function useSpeechSynthesis(): SpeechSynthesisHook {
	const [supported, setSupported] = useState(false);
	const [speaking, setSpeaking] = useState(false);
	const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

	useEffect(() => {
		if (typeof window !== "undefined" && "speechSynthesis" in window) {
			setSupported(true);
			const primeVoices = () => window.speechSynthesis.getVoices();
			primeVoices();
			window.speechSynthesis.addEventListener?.("voiceschanged", primeVoices);

			return () => {
				window.speechSynthesis.removeEventListener?.(
					"voiceschanged",
					primeVoices,
				);
				try {
					window.speechSynthesis?.cancel();
				} catch {
					/* ignore */
				}
			};
		}

		return undefined;
	}, []);

	const speak = useCallback((text: string) => {
		if (!("speechSynthesis" in window)) return;

		// Stop any current speech first
		window.speechSynthesis.cancel();

		const utterance = new SpeechSynthesisUtterance(text);
		utterance.rate = 1.02;
		utterance.pitch = 0.98;
		utterance.volume = 1.0;

		const preferred = pickPreferredVoice(window.speechSynthesis.getVoices());
		if (preferred) utterance.voice = preferred;

		utterance.onstart = () => setSpeaking(true);
		utterance.onend = () => setSpeaking(false);
		utterance.onerror = () => setSpeaking(false);

		utteranceRef.current = utterance;
		window.speechSynthesis.speak(utterance);
	}, []);

	const stop = useCallback(() => {
		try {
			window.speechSynthesis?.cancel();
		} catch {
			/* ignore */
		}
		setSpeaking(false);
	}, []);

	return { supported, speaking, speak, stop };
}
