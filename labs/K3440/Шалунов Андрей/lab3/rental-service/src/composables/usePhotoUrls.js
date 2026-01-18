export function usePhotoUrls() {
    function parse(text) {
        const raw = String(text || "").trim();
        if (!raw) return [];
        return raw
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
    }

    return { parse };
}