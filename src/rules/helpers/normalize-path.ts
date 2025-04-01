//----------------------------------------------------------------------------------------------------------------------
// Normalize a path
//----------------------------------------------------------------------------------------------------------------------

export function normalizeAndAnchorPath(path: string) {
    const normalized = normalizePath(path);
    return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

export function normalizePath(path: string) {
    return path.trim().replaceAll("\\", "/").replace(/^\.\//g, "");
}
