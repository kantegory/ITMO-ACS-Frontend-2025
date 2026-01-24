window.addEventListener('DOMContentLoaded', () => {
    const detailButtons = document.querySelectorAll('.btn-details');
    detailButtons.forEach(button => {
        button.addEventListener('click', () => {
            const title = button.dataset.title;
            const info = button.dataset.info;

            const modalTitle = document.getElementById('detailsModalLabel');
            const modalBody = document.getElementById('detailsModalBody');

            modalTitle.textContent = title;
            modalBody.textContent = info;

            const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
            modal.show();
        });
    });
});
