function buildQuery(fl) {
    if (fl.size === 0) return "";

    const params = new URLSearchParams();

    fl.forEach((value, key) => {
        if (key === DEFAULT_SELECT) 
            return;

        if (key === "price") {
            const [min, max] = value.split("-");
            params.append("price_gte", min);
            params.append("price_lte", max);
        }
        else if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
        } else {
            params.append(key, value);
        }
    });

    return "?" + params.toString();
}
