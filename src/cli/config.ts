import { Ruleset } from "../rules/types/rule-types.js";
import { CommandLineParameters } from "./command-line-parameters.js";

export type Config = CommandLineParameters & { readonly ruleset: Ruleset };
