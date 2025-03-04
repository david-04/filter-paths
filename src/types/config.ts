import { Parameters } from "./parameters.js";
import { Ruleset } from "./rule-types.js";

//----------------------------------------------------------------------------------------------------------------------
// Configuration
//----------------------------------------------------------------------------------------------------------------------

export type Config = Parameters & { readonly ruleset: Ruleset };
