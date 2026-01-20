export function useApiError() {
    function normalize(e, fallback = "Ошибка запроса") {
        return (
            e?.response?.data?.message ||
            e?.message ||
            fallback
        );
    }

    return { normalize };
}