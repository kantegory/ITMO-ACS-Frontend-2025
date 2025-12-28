const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

async function fetchWorkout(workoutId) {
    try {
        const res = await fetch(`http://localhost:3000/workouts/${workoutId}`);
        if (!res.ok) throw new Error("Тренировка не найдена на сервере");

        const workout = await res.json();

        document.getElementById("workoutTitle").textContent = workout.title;
        document.getElementById("workoutLevel").textContent = "Уровень: " + workout.level;
        document.getElementById("workoutDescription").textContent = workout.description;

        const iframe = document.getElementById("workoutVideo");
        iframe.src = workout.video || "";
        iframe.onload = () => {
            document.getElementById("videoPlaceholder").style.display = "none";
        };

        const list = document.getElementById("exerciseList");
        list.innerHTML = workout.instructions.map(instr => `
            <div class="exercise-card">${instr}</div>
        `).join("");

    } catch (e) {
        console.error(e);
        document.getElementById("workoutTitle").textContent = "Ошибка загрузки тренировки";
        document.getElementById("workoutDescription").textContent = e.message;
    }
}

fetchWorkout(id);

const markBtn = document.getElementById("markDoneBtn");

markBtn.addEventListener("click", async (event) => {
    event.preventDefault()
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
        return alert("Действие доступно только авторизованным пользователям");
    }

    markBtn.textContent = "Выполнено";
    markBtn.classList.remove("btn-outline-primary");
    markBtn.classList.add("btn-success");

    const historyEntry = {
        userId: user.id,
        workoutId: id,
        date: new Date().toISOString().split("T")[0] 
    };

    try {
        const res = await fetch("http://localhost:3000/history", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(historyEntry)
        });

        if (!res.ok) throw new Error("Не удалось добавить запись в историю");

        console.log("Запись в историю добавлена");

    } catch (err) {
        console.error(err);
        alert(`Ошибка: ${err.message}`);
    }
});


const scheduleForm = document.querySelector("#scheduleModal form");

scheduleForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const date = document.getElementById("planDate").value;

    if (!date) return alert("Выберите дату!");

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user")); 

    if (!token || !user) {
        return alert("Планирование доступно только авторизованным пользователям");
    }

    const plannedEntry = {
        userId: user.id,
        workoutId: id, 
        date
    };

    try {
        const res = await fetch("http://localhost:3000/planned", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(plannedEntry)
        });

        if (!res.ok) throw new Error("Не удалось добавить запись в план");

        alert(`Тренировка запланирована на ${date}`);
        const modal = bootstrap.Modal.getInstance(document.getElementById("scheduleModal"));
        modal.hide();
        scheduleForm.reset();

    } catch (err) {
        console.error(err);
        alert(`Ошибка: ${err.message}`);
    }
});

