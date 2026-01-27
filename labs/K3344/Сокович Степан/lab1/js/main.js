document.addEventListener('DOMContentLoaded', () => {
    const applyBtn = document.getElementById('applyFilters');
    const clearBtn = document.getElementById('clearFilters');
    const listings = Array.from(document.querySelectorAll('#listings > [data-type]'));
    const resultsCount = document.getElementById('resultsCount');

    function applyFilters() {
        const type = document.getElementById('typeFilter').value;
        const maxPrice = Number(document.getElementById('priceFilter').value) || Infinity;
        const loc = document.getElementById('locationFilter').value.trim().toLowerCase();

        let visible = 0;
        listings.forEach(card => {
            const cardType = card.getAttribute('data-type');
            const cardPrice = Number(card.getAttribute('data-price'));
            const cardLoc = (card.getAttribute('data-location') || '').toLowerCase();

            const okType = (type === 'any') || (type === cardType);
            const okPrice = cardPrice <= maxPrice;
            const okLoc = loc === '' || cardLoc.includes(loc);

            if (okType && okPrice && okLoc) {
                card.style.display = '';
                visible++;
            } else {
                card.style.display = 'none';
            }
        });
        resultsCount.textContent = `${visible} найдено`;
    }

    applyBtn.addEventListener('click', applyFilters);
    clearBtn.addEventListener('click', () => {
        document.getElementById('filterForm').reset();
        listings.forEach(c => c.style.display = '');
        resultsCount.textContent = `${listings.length} найдено`;
    });
});


