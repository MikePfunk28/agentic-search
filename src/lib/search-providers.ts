/**
 * Compatibility wrapper for the registry-backed search provider layer.
 * Existing callers still import from this module while the implementation
 * now lives under src/lib/search/.
 */

export { calculateDomainAuthority } from "./search/domain-authority";
export {
	executeWebSearch,
	getAvailableProviders,
	getFreeProviderRegistry,
	getSearchProviderRegistry,
} from "./search/provider-registry";
export type {
	ExecuteWebSearchOptions,
	FreeSearchProviderDefinition,
	FreeSearchProviderType,
	PaidSearchProviderType,
	SearchApiKeys,
	SearchProviderConfig,
	SearchProviderDefinition,
	SearchProviderType,
	WebSearchResult,
} from "./search/types";
