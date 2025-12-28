        const params = new URLSearchParams(window.location.search);
        const id = Number(params.get("id"));

        fetch("data/workouts.json")
            .then(res => res.json())
            .then(data => {
                const workout = data.find(w => w.id === id);
                if (!workout) {
                    document.getElementById("workoutTitle").textContent = "Тренировка не найдена";
                    return;
                }

                document.getElementById("workoutTitle").textContent = workout.title;
                document.getElementById("workoutLevel").textContent = "Уровень: " + workout.level;
                document.getElementById("workoutDescription").textContent = workout.description;

                const iframe = document.getElementById("workoutVideo");
                iframe.src = workout.video;

                iframe.onload = () => {
                    document.getElementById("videoPlaceholder").style.display = "none";
                };

                const list = document.getElementById("exerciseList");
                list.innerHTML = workout.instructions.map(instr => `
        <div class="exercise-card">${instr}</div>
      `).join("");
            });

        const markBtn = document.getElementById("markDoneBtn");
        markBtn.addEventListener("click", () => {
            markBtn.textContent = "Выполнено";
            markBtn.classList.remove("btn-outline-primary");
            markBtn.classList.add("btn-success");
        });

        const scheduleForm = document.querySelector("#scheduleModal form");
        scheduleForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const date = document.getElementById("planDate").value;
            if (!date) return alert("Выберите дату!");
            alert(`Тренировка запланирована на ${date}`);
            const modal = bootstrap.Modal.getInstance(document.getElementById("scheduleModal"));
            modal.hide();
        });