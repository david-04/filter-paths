import { Ruleset } from "../filter-rules/rule-types.js";
import { CommandLineParameters } from "./command-line-parameters.js";

export type Config = CommandLineParameters & { readonly ruleset: Ruleset };
