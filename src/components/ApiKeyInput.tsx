/**
 * ApiKeyInput Component
 * Secure input field with visibility toggle for API keys
 */

import { AlertCircle, Check, Eye, EyeOff, Key } from "lucide-react";
import { useState } from "react";

interface ApiKeyInputProps {
	value: string;
	onChange: (value: string) => void;
	provider: string;
	placeholder?: string;
	disabled?: boolean;
	isValid?: boolean;
	error?: string;
}

export function ApiKeyInput({
	value,
	onChange,
	provider,
	placeholder = "Enter API key...",
	disabled = false,
	isValid,
	error,
}: ApiKeyInputProps) {
	const [showKey, setShowKey] = useState(false);

	const handleToggleVisibility = () => {
		setShowKey(!showKey);
	};

	return (
		<div className="w-full">
			<label className="block text-sm font-medium text-gray-700 mb-2">
				{provider} API Key
			</label>

			<div className="relative">
				{/* Key icon */}
				<div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
					<Key className="w-5 h-5" />
				</div>

				{/* Input field */}
				<input
					type={showKey ? "text" : "password"}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					disabled={disabled}
					placeholder={placeholder}
					className={`w-full pl-12 pr-24 py-3 border-2 rounded-lg
                     focus:ring-4 focus:outline-none
                     disabled:bg-gray-50 disabled:cursor-not-allowed
                     transition-all duration-200 font-mono text-sm
                     ${
												error
													? "border-red-300 focus:border-red-500 focus:ring-red-100"
													: isValid
														? "border-green-300 focus:border-green-500 focus:ring-green-100"
														: "border-gray-300 focus:border-primary-500 focus:ring-primary-100"
											}`}
					autoComplete="off"
					spellCheck={false}
				/>

				{/* Status and visibility toggle */}
				<div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
					{/* Validation status */}
					{isValid !== undefined && (
						<div className={`${isValid ? "text-green-500" : "text-red-500"}`}>
							{isValid ? (
								<Check className="w-5 h-5" />
							) : (
								<AlertCircle className="w-5 h-5" />
							)}
						</div>
					)}

					{/* Visibility toggle */}
					<button
						type="button"
						onClick={handleToggleVisibility}
						disabled={disabled || !value}
						className="p-1 hover:bg-gray-100 rounded transition-colors
                       disabled:cursor-not-allowed disabled:opacity-50"
						aria-label={showKey ? "Hide API key" : "Show API key"}
					>
						{showKey ? (
							<EyeOff className="w-5 h-5 text-gray-500" />
						) : (
							<Eye className="w-5 h-5 text-gray-500" />
						)}
					</button>
				</div>
			</div>

			{/* Error message */}
			{error && (
				<div className="mt-2 flex items-center gap-2 text-sm text-red-600">
					<AlertCircle className="w-4 h-4" />
					<span>{error}</span>
				</div>
			)}

			{/* Helper text */}
			{!error && (
				<div className="mt-2 text-sm text-gray-500">
					Your API key is stored locally and never sent to our servers
				</div>
			)}
		</div>
	);
}
