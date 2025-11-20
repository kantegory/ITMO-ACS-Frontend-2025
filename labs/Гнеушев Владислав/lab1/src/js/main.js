const workouts = [
    {
        id: 1,
        title: "Интенсивное кардио",
        type: "cardio",
        level: "beginner",
        duration: 30,
        description: "Отличная кардио тренировка для начинающих. Помогает улучшить выносливость и сжечь калории.",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        instructions: [
            { step: 1, title: "Разминка", description: "5 минут легкой ходьбы или бега на месте" },
            { step: 2, title: "Основная часть", description: "20 минут чередования бега и ходьбы" },
            { step: 3, title: "Заминка", description: "5 минут медленной ходьбы и растяжки" }
        ],
        equipment: ["Коврик", "Вода"]
    },
    {
        id: 2,
        title: "Силовая тренировка для рук",
        type: "strength",
        level: "intermediate",
        duration: 45,
        description: "Тренировка для укрепления мышц рук и плеч. Подходит для среднего уровня подготовки.",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        instructions: [
            { step: 1, title: "Разминка", description: "10 минут разминки суставов" },
            { step: 2, title: "Упражнения", description: "3 подхода по 12 повторений каждого упражнения" },
            { step: 3, title: "Заминка", description: "5 минут растяжки" }
        ],
        equipment: ["Гантели", "Коврик"]
    },
    {
        id: 3,
        title: "Йога для начинающих",
        type: "yoga",
        level: "beginner",
        duration: 30,
        description: "Спокойная йога-сессия для расслабления и улучшения гибкости.",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        instructions: [
            { step: 1, title: "Настройка", description: "Найдите тихое место и подготовьте коврик" },
            { step: 2, title: "Асаны", description: "Выполните базовые асаны для начинающих" },
            { step: 3, title: "Медитация", description: "5 минут медитации в конце" }
        ],
        equipment: ["Коврик для йоги"]
    },
    {
        id: 4,
        title: "Растяжка всего тела",
        type: "stretch",
        level: "beginner",
        duration: 15,
        description: "Короткая сессия растяжки для улучшения гибкости и восстановления.",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        instructions: [
            { step: 1, title: "Разминка", description: "Легкие движения для разогрева" },
            { step: 2, title: "Растяжка", description: "Растяжка всех основных групп мышц" }
        ],
        equipment: ["Коврик"]
    },
    {
        id: 5,
        title: "Продвинутое кардио",
        type: "cardio",
        level: "advanced",
        duration: 60,
        description: "Интенсивная кардио тренировка для продвинутых спортсменов.",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        instructions: [
            { step: 1, title: "Разминка", description: "10 минут разминки" },
            { step: 2, title: "Интервалы", description: "40 минут интервальных тренировок" },
            { step: 3, title: "Заминка", description: "10 минут заминки" }
        ],
        equipment: ["Беговая дорожка или открытое пространство"]
    },
    {
        id: 6,
        title: "Силовая тренировка ног",
        type: "strength",
        level: "intermediate",
        duration: 45,
        description: "Тренировка для укрепления мышц ног и ягодиц.",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        instructions: [
            { step: 1, title: "Разминка", description: "10 минут разминки" },
            { step: 2, title: "Упражнения", description: "Приседания, выпады, подъемы на носки" },
            { step: 3, title: "Заминка", description: "Растяжка ног" }
        ],
        equipment: ["Гантели", "Коврик"]
    }
];

const blogPosts = [
    {
        id: 1,
        title: "Правильное питание для тренировок",
        category: "nutrition",
        date: "15.11.2025",
        author: "Эксперт по питанию",
        image: "https://via.placeholder.com/800x400",
        content: `
            <p>Правильное питание играет ключевую роль в достижении ваших фитнес-целей. Вот основные принципы:</p>
            <h3>1. Баланс макронутриентов</h3>
            <p>Важно получать достаточное количество белков, углеводов и жиров. Белки необходимы для восстановления мышц, углеводы дают энергию, а жиры поддерживают гормональный баланс.</p>
            <h3>2. Время приема пищи</h3>
            <p>Старайтесь есть за 1-2 часа до тренировки и в течение часа после нее. Это поможет вам получить максимум энергии и правильно восстановиться.</p>
            <h3>3. Гидратация</h3>
            <p>Не забывайте пить достаточно воды в течение дня, особенно во время тренировок.</p>
        `
    },
    {
        id: 2,
        title: "10 советов для начинающих",
        category: "motivation",
        date: "10.11.2025",
        author: "Фитнес-тренер",
        image: "https://via.placeholder.com/800x400",
        content: `
            <p>Начало фитнес-пути может быть пугающим. Вот 10 советов, которые помогут вам начать:</p>
            <ol>
                <li>Начните с малого - не пытайтесь делать все сразу</li>
                <li>Поставьте реалистичные цели</li>
                <li>Создайте расписание тренировок</li>
                <li>Найдите то, что вам нравится</li>
                <li>Не пропускайте разминку</li>
                <li>Слушайте свое тело</li>
                <li>Отслеживайте прогресс</li>
                <li>Правильно питайтесь</li>
                <li>Высыпайтесь</li>
                <li>Будьте терпеливы</li>
            </ol>
        `
    },
    {
        id: 3,
        title: "Восстановление после тренировок",
        category: "health",
        date: "05.11.2025",
        author: "Врач-реабилитолог",
        image: "https://via.placeholder.com/800x400",
        content: `
            <p>Правильное восстановление так же важно, как и сама тренировка. Вот что нужно знать:</p>
            <h3>Сон</h3>
            <p>Старайтесь спать не менее 7-8 часов в сутки. Во время сна происходит восстановление мышц и выработка гормонов роста.</p>
            <h3>Растяжка</h3>
            <p>Регулярная растяжка помогает улучшить гибкость и уменьшить мышечную боль.</p>
            <h3>Питание</h3>
            <p>После тренировки важно получить белок и углеводы для восстановления мышц и пополнения запасов энергии.</p>
        `
    },
    {
        id: 4,
        title: "Как мотивировать себя тренироваться",
        category: "motivation",
        date: "01.11.2025",
        author: "Психолог",
        image: "https://via.placeholder.com/800x400",
        content: `
            <p>Мотивация - это ключ к постоянным тренировкам. Вот несколько способов ее поддерживать:</p>
            <ul>
                <li>Найдите партнера для тренировок</li>
                <li>Слушайте музыку во время тренировок</li>
                <li>Ведите дневник прогресса</li>
                <li>Награждайте себя за достижения</li>
                <li>Визуализируйте свои цели</li>
            </ul>
        `
    },
    {
        id: 5,
        title: "Белки в рационе спортсмена",
        category: "nutrition",
        date: "25.10.2025",
        author: "Диетолог",
        image: "https://via.placeholder.com/800x400",
        content: `
            <p>Белки - это строительный материал для мышц. Вот что нужно знать о белках в рационе:</p>
            <h3>Сколько нужно?</h3>
            <p>Для активных людей рекомендуется 1.2-2 грамма белка на килограмм веса тела.</p>
            <h3>Источники белка</h3>
            <p>Хорошие источники: курица, рыба, яйца, молочные продукты, бобовые, орехи.</p>
        `
    },
    {
        id: 6,
        title: "Важность разминки",
        category: "health",
        date: "20.10.2025",
        author: "Спортивный врач",
        image: "https://via.placeholder.com/800x400",
        content: `
            <p>Разминка перед тренировкой - это не просто формальность, а необходимость для предотвращения травм.</p>
            <h3>Зачем нужна разминка?</h3>
            <p>Разминка подготавливает ваше тело к нагрузке, увеличивает температуру мышц и улучшает кровообращение.</p>
            <h3>Как правильно разминаться?</h3>
            <p>Начните с легких движений, затем переходите к более динамичным упражнениям, которые задействуют мышцы, которые вы будете использовать в основной тренировке.</p>
        `
    }
];

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('workoutsContainer')) {
        initWorkoutsPage();
    }
    
    if (document.getElementById('workoutTitle')) {
        initWorkoutDetailPage();
    }
    
    if (document.getElementById('blogContainer')) {
        initBlogPage();
    }
    
    if (document.getElementById('postTitle')) {
        initBlogPostPage();
    }
    
});

function initWorkoutsPage() {
    renderWorkouts(workouts);
}

function renderWorkouts(workoutsToRender) {
    const container = document.getElementById('workoutsContainer');
    container.innerHTML = '';
    
    workoutsToRender.forEach(workout => {
        const levelNames = {
            beginner: 'Начинающий',
            intermediate: 'Средний',
            advanced: 'Продвинутый'
        };
        
        const typeNames = {
            cardio: 'Кардио',
            strength: 'Силовые',
            yoga: 'Йога',
            stretch: 'Растяжка'
        };
        
        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `
            <div class="card workout-card" onclick="goToWorkout(${workout.id})">
                <div class="card-body">
                    <h5 class="card-title">${workout.title}</h5>
                    <p class="card-text">
                        <strong>Уровень:</strong> ${levelNames[workout.level]}<br>
                        <strong>Тип:</strong> ${typeNames[workout.type]}<br>
                        <strong>Продолжительность:</strong> ${workout.duration} мин
                    </p>
                    <a href="workout-detail.html?id=${workout.id}" class="btn btn-primary">Подробнее</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function goToWorkout(id) {
    window.location.href = `workout-detail.html?id=${id}`;
}

function initWorkoutDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    
    let workout = workouts.find(w => w.id === id);
    if (!workout) {
        workout = workouts[0];
    }
    
    document.getElementById('workoutTitle').textContent = workout.title;
    
    const levelNames = {
        beginner: 'Начинающий',
        intermediate: 'Средний',
        advanced: 'Продвинутый'
    };
    
    const typeNames = {
        cardio: 'Кардио',
        strength: 'Силовые',
        yoga: 'Йога',
        stretch: 'Растяжка'
    };
    
    document.getElementById('workoutLevel').textContent = `Уровень: ${levelNames[workout.level]}`;
    document.getElementById('workoutType').textContent = `Тип: ${typeNames[workout.type]}`;
    document.getElementById('workoutDuration').textContent = `Продолжительность: ${workout.duration} минут`;
    document.getElementById('workoutDescription').textContent = workout.description;
    document.getElementById('workoutVideo').src = workout.video;
    
    // Инструкции
    const accordion = document.getElementById('instructionsAccordion');
    accordion.innerHTML = '';
    workout.instructions.forEach((inst, index) => {
        const item = document.createElement('div');
        item.className = 'accordion-item';
        item.innerHTML = `
            <h2 class="accordion-header">
                <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}">
                    ${inst.step}. ${inst.title}
                </button>
            </h2>
            <div id="collapse${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}">
                <div class="accordion-body">
                    ${inst.description}
                </div>
            </div>
        `;
        accordion.appendChild(item);
    });
    
    // Оборудование
    const equipmentList = document.getElementById('equipmentList');
    equipmentList.innerHTML = '';
    workout.equipment.forEach(eq => {
        const li = document.createElement('li');
        li.textContent = eq;
        equipmentList.appendChild(li);
    });
    
    initAddToPlanModal(workout);
}

function initAddToPlanModal(workout) {
    const addToPlanBtn = document.getElementById('addToPlanBtn');
    const addToPlanModal = new bootstrap.Modal(document.getElementById('addToPlanModal'));
    const confirmBtn = document.getElementById('confirmAddToPlanBtn');
    const workoutTitleDisplay = document.getElementById('workoutTitleDisplay');
    const dayOfWeekSelect = document.getElementById('dayOfWeek');
    
    let currentWorkout = workout;
    
    if (addToPlanBtn) {
        addToPlanBtn.addEventListener('click', function() {
            workoutTitleDisplay.value = currentWorkout.title;
            dayOfWeekSelect.value = '';
            addToPlanModal.show();
        });
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            const selectedDay = dayOfWeekSelect.value;
            
            if (!selectedDay) {
                alert('Пожалуйста, выберите день недели');
                return;
            }
            
            addToPlanModal.hide();
        });
    }
}

function initBlogPage() {
    renderBlogPosts(blogPosts);
}

function renderBlogPosts(postsToRender) {
    const container = document.getElementById('blogContainer');
    container.innerHTML = '';
    
    postsToRender.forEach(post => {
        const categoryNames = {
            nutrition: 'Питание',
            health: 'Здоровье',
            motivation: 'Мотивация'
        };
        
        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `
            <div class="card blog-card" onclick="goToBlogPost(${post.id})">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">
                        <strong>Категория:</strong> ${categoryNames[post.category]}<br>
                        <strong>Дата:</strong> ${post.date}
                    </p>
                    <a href="blog-post.html?id=${post.id}" class="btn btn-primary">Читать</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function goToBlogPost(id) {
    window.location.href = `blog-post.html?id=${id}`;
}

function initBlogPostPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    
    const post = blogPosts.find(p => p.id === id);
    if (!post) {
        post = blogPosts[0];
    }
    
    const categoryNames = {
        nutrition: 'Питание',
        health: 'Здоровье',
        motivation: 'Мотивация'
    };
    
    document.getElementById('postTitle').textContent = post.title;
    document.getElementById('postCategory').textContent = `Категория: ${categoryNames[post.category]}`;
    document.getElementById('postDate').textContent = `Дата: ${post.date}`;
    document.getElementById('postAuthor').textContent = `Автор: ${post.author}`;
    document.getElementById('postImage').src = post.image;
    document.getElementById('postContent').innerHTML = post.content;
}
