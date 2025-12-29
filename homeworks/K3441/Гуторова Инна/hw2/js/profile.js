document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
        alert("Пожалуйста, авторизуйтесь для просмотра личного кабинета.");
        return;
    }

    const historyList = document.getElementById("history-list");
    const plannedList = document.getElementById("planned-list");

    const statProgress = document.getElementById("stat-progress");
    const statWorkouts = document.getElementById("stat-workouts");
    const statHours = document.getElementById("stat-hours");

    try {
        const userRes = await fetch(`http://localhost:3000/users/${user.id}`);
        if (!userRes.ok) throw new Error("Не удалось загрузить данные пользователя");

        const fullUser = await userRes.json();

        if (fullUser.stats) {
            statProgress.textContent = fullUser.stats.progress + "%";
            statWorkouts.textContent = fullUser.stats.workouts;
            statHours.textContent = fullUser.stats.hours + " ч";
        } else {
            statProgress.textContent = "0%";
            statWorkouts.textContent = "0";
            statHours.textContent = "0 ч";
        }
    } catch (err) {
        console.error("Ошибка загрузки stats:", err);
        statProgress.textContent = "—";
        statWorkouts.textContent = "—";
        statHours.textContent = "—";
    }

    function renderList(container, items, type) {
        items.forEach(item => {
            const div = document.createElement("div");
            div.className = "workout-list-item d-flex justify-content-between align-items-center mb-2";

            const span = document.createElement("span");
            span.textContent = `${item.date} — ${item.title}`;

            const link = document.createElement("a");
            link.href = `workout.html?id=${item.workoutId}`;
            link.className = "btn btn-sm " + (type === "planned" ? "btn-outline-success" : "btn-outline-primary");
            link.textContent = "Перейти";

            const delBtn = document.createElement("button");
            delBtn.className = "btn btn-sm btn-outline-danger ms-2";
            delBtn.textContent = "Удалить";
            delBtn.addEventListener("click", async () => {
                try {
                    const res = await fetch(`http://localhost:3000/${type}/${item.id}`, {
                        method: "DELETE",
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    if (!res.ok) throw new Error("Не удалось удалить запись");

                    div.remove();
                } catch (err) {
                    console.error(err);
                    alert(`Ошибка: ${err.message}`);
                }
            });

            const rightGroup = document.createElement("div");
            rightGroup.className = "d-flex";
            rightGroup.appendChild(link);
            rightGroup.appendChild(delBtn);

            div.appendChild(span);
            div.appendChild(rightGroup);
            container.appendChild(div);
        });
    }

    try {
        const historyRes = await fetch(`http://localhost:3000/history?userId=${user.id}`);
        if (!historyRes.ok) throw new Error("Не удалось загрузить историю");
        const historyData = await historyRes.json();

        const workoutsRes = await fetch(`http://localhost:3000/workouts`);
        const workouts = await workoutsRes.json();

        const historyItems = historyData.map(h => {
            const workout = workouts.find(w => w.id === h.workoutId);
            return { ...h, title: workout ? workout.title : "Неизвестно" };
        });

        renderList(historyList, historyItems, "history");

        const plannedRes = await fetch(`http://localhost:3000/planned?userId=${user.id}`);
        if (!plannedRes.ok) throw new Error("Не удалось загрузить плановые тренировки");
        const plannedData = await plannedRes.json();

        const plannedItems = plannedData.map(p => {
            const workout = workouts.find(w => w.id === p.workoutId);
            return { ...p, title: workout ? workout.title : "Неизвестно" };
        });

        renderList(plannedList, plannedItems, "planned");

    } catch (err) {
        console.error(err);
        historyList.innerHTML = `<p class="text-danger">Ошибка загрузки: ${err.message}</p>`;
        plannedList.innerHTML = `<p class="text-danger">Ошибка загрузки: ${err.message}</p>`;
    }
});
