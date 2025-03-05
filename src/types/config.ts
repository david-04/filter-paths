import { Parameters } from "./parameters.js";
import { Ruleset } from "./rules.js";

//----------------------------------------------------------------------------------------------------------------------
// Configuration
//----------------------------------------------------------------------------------------------------------------------

export type Config = Parameters & { readonly ruleset: Ruleset };
