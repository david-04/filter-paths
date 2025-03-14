//----------------------------------------------------------------------------------------------------------------------
// Normalize a path
//----------------------------------------------------------------------------------------------------------------------

export function normalizePath(path: string) {
    const normalized = path.trim().replaceAll("\\", "/").replace(/^\.\//g, "");
    return normalized.startsWith("/") ? normalized : `/${normalized}`;
}
