"use client";

import { useState } from "react";

type SpeechResultEvent = {
  results: ArrayLike<{ 0: { transcript: string } }>;
};

type Recognition = {
  lang: string;
  interimResults: boolean;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type RecognitionConstructor = new () => Recognition;

export function VoiceInputButton({
  onTranscript,
}: {
  onTranscript: (text: string) => void;
}) {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState<Recognition | null>(null);

  function toggle() {
    if (recognition && listening) {
      recognition.stop();
      return;
    }

    const speechWindow = window as typeof window & {
      SpeechRecognition?: RecognitionConstructor;
      webkitSpeechRecognition?: RecognitionConstructor;
    };
    const SpeechRecognition =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const next = new SpeechRecognition();
    next.lang = document.documentElement.lang || "en-IN";
    next.interimResults = false;
    next.onresult = (event) => onTranscript(event.results[0][0].transcript);
    next.onend = () => setListening(false);
    next.onerror = () => setListening(false);
    setRecognition(next);
    setListening(true);
    next.start();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition ${
        listening
          ? "border-govred-600/30 bg-govred-50 text-govred-700"
          : "border-line bg-white text-navy-700 hover:border-navy-600/40"
      }`}
    >
      <span aria-hidden>{listening ? "■" : "●"}</span>
      {listening ? "Stop listening" : "Speak instead"}
    </button>
  );
}
