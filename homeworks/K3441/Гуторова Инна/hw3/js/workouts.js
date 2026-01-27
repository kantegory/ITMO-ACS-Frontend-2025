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
function render(list) {
    workoutList.innerHTML = list
        .map(w => `
        <div class="col-md-4">
            <div class="card workout-card h-100"
                 data-level="${w.level}"
                 data-type="${w.type}"
                 data-duration="${w.duration}">
                 
                <img src="${w.image}"
                     class="card-img-top"
                     alt="${w.title}">

                <div class="card-body d-flex flex-column">
                    <h2 class="h5">${w.title}</h2>
                    <p>${w.description}</p>
                    <a href="workout.html?id=${w.id}"
                       class="btn btn-primary btn-sm mt-auto"
                       aria-label="Открыть тренировку ${w.title}">
                        Открыть
                    </a>
                </div>
            </div>
        </div>
    `)
        .join("");
}

async function fetchWorkouts(level = "all", type = "all", duration = "all") {
    try {
        const params = new URLSearchParams();
        if (level !== "all") params.append("level", level);
        if (type !== "all") params.append("type", type);
        if (duration !== "all") params.append("duration", duration);

        const res = await fetch(`http://localhost:3000/workouts?${params.toString()}`);
        if (!res.ok) throw new Error("Не удалось загрузить тренировки");

        const data = await res.json();
        render(data);
        showEmptyMessage(data.length === 0);
    } catch (e) {
        console.error(e);
        workoutList.innerHTML = `<p class="text-danger">Ошибка загрузки: ${e.message}</p>`;
    }
}

fetchWorkouts();

document.getElementById("applyFilters").addEventListener("click", () => {
    const level = document.getElementById("filterLevel").value;
    const type = document.getElementById("filterType").value;
    const duration = document.getElementById("filterDuration").value;

    fetchWorkouts(level, type, duration);
});
