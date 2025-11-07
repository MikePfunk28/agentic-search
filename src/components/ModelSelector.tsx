/**
 * ModelSelector Component
 * Dropdown selector for choosing AI model provider
 */

import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { ModelProvider } from "../lib/model-config";

interface ModelSelectorProps {
  value: ModelProvider;
  onChange: (provider: ModelProvider) => void;
  disabled?: boolean;
}

export function ModelSelector({
  value,
  onChange,
  disabled = false,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const providers = [
    { value: ModelProvider.OPENAI, label: "OpenAI", description: "GPT-4 and GPT-3.5" },
    { value: ModelProvider.ANTHROPIC, label: "Anthropic", description: "Claude 3.5" },
    { value: ModelProvider.GOOGLE, label: "Google", description: "Gemini Pro" },
    { value: ModelProvider.OLLAMA, label: "Ollama", description: "Local models" },
    { value: ModelProvider.LM_STUDIO, label: "LM Studio", description: "Local inference" },
    { value: ModelProvider.AZURE_OPENAI, label: "Azure OpenAI", description: "Azure hosted" },
  ];

  const selectedProvider = providers.find((p) => p.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-300 rounded-lg
                   hover:border-primary-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100
                   disabled:bg-gray-100 disabled:cursor-not-allowed
                   transition-all duration-200 outline-none"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-primary-500" />
          <div className="text-left">
            <div className="font-medium text-gray-900">
              {selectedProvider?.label || "Select Provider"}
            </div>
            <div className="text-sm text-gray-500">
              {selectedProvider?.description || "Choose an AI provider"}
            </div>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Menu */}
          <div
            className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl
                       max-h-80 overflow-y-auto"
            role="listbox"
          >
            {providers.map((provider) => (
              <button
                key={provider.value}
                type="button"
                onClick={() => {
                  onChange(provider.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left
                           hover:bg-primary-50 transition-colors
                           ${
                             value === provider.value
                               ? "bg-primary-100 border-l-4 border-primary-500"
                               : ""
                           }`}
                role="option"
                aria-selected={value === provider.value}
              >
                <Sparkles
                  className={`w-5 h-5 mt-0.5 ${
                    value === provider.value ? "text-primary-600" : "text-gray-400"
                  }`}
                />
                <div className="flex-1">
                  <div
                    className={`font-medium ${
                      value === provider.value ? "text-primary-900" : "text-gray-900"
                    }`}
                  >
                    {provider.label}
                  </div>
                  <div className="text-sm text-gray-500">{provider.description}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
