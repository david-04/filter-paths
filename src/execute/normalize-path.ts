//----------------------------------------------------------------------------------------------------------------------
// Normalize a path
//----------------------------------------------------------------------------------------------------------------------

export function normalizePath(path: string) {
    return path.trim().replaceAll("\\", "/").replace(/^\.\//g, "");
}
