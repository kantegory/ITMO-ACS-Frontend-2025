const DEFAULT_SELECT = 'default';

function buildQuery(fl) {
    if (fl.size === 0) return "";

    const params = new URLSearchParams();

    fl.forEach((value, key) => {
        if (value === DEFAULT_SELECT) 
            return;

        if (key === "price") {
            const [min, max] = value.split("-");
            params.append("price_gte", min);
            params.append("price_lte", max);
            return;
        }

        if (key === "rooms" && Array.isArray(value) && value.includes("more")) {
            let index = value.indexOf("more");
            value.splice(index, 1);
            params.append("rooms_gte", 3)
        }

        if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
        } else {
            params.append(key, value);
        }
    });

    return "?" + params.toString();
}

export {
    buildQuery
}