export function formatMinutesToText(minutes) {
    if (!Number.isFinite(minutes)) return '-';
    return `${minutes} мин`;
}

export function escapeHtml(input) {
    if (typeof input !== 'string') return input ?? '';
    return input.replace(/[&<>"']/g, (character) =>
        ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;',
        }[character]),
    );
}