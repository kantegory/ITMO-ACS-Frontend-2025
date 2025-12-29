fetch("data/workouts.json")
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById("workoutList");


        function render(list) {
            container.innerHTML = list
                .map(w => `
<div class="col-md-4">
                <div class="card workout-card h-100" data-level="${w.level}" data-type="${w.type}" data-duration="${w.duration}">
                    <img src="${w.image}" class="card-img-top">
                    <div class="card-body d-flex flex-column">
                        <h5>${w.title}</h5>
                        <p>${w.description}</p>
                        <a href="workout.html?id=${w.id}" class="btn btn-primary btn-sm mt-auto">Открыть</a>
                    </div>
                </div>
            </div>
`)
                .join("");
        }

        render(data);
    });

const workoutList = document.getElementById("workoutList");


function showEmptyMessage(show) {
    let msg = document.getElementById("emptyMessage");
    if (!msg) {
        msg = document.createElement("div");
        msg.id = "emptyMessage";
        msg.className = "text-center mt-4";
        msg.textContent = "По выбранным фильтрам ничего не найдено.";
        workoutList.parentElement.appendChild(msg);
    }
    msg.style.display = show ? "block" : "none";
}

document.getElementById("applyFilters").addEventListener("click", () => {
    const level = document.getElementById("filterLevel").value;
    const type = document.getElementById("filterType").value;
    const duration = document.getElementById("filterDuration").value;

    let anyVisible = false;

    document.querySelectorAll("#workoutList .card").forEach(card => {
        const match =
            (level === "all" || card.dataset.level === level) &&
            (type === "all" || card.dataset.type === type) &&
            (duration === "all" || card.dataset.duration === duration);

        card.parentElement.style.display = match ? "" : "none";

        if (match) anyVisible = true;
    });

    showEmptyMessage(!anyVisible);
});