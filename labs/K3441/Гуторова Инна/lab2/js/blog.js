const MAX_LENGTH = 500;
const blogFeed = document.getElementById("blogFeed");

const token = localStorage.getItem("token");
const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

function createPost({ title, text, image, authorName, date }) {
    const short = text.length > MAX_LENGTH ? text.slice(0, MAX_LENGTH) + "..." : text;
    const isLong = text.length > MAX_LENGTH;

    const wrapper = document.createElement("div");
    wrapper.className = "blog-post card p-3";

    wrapper.innerHTML = `
        <img src="${image}" alt="${title}" class="mb-3">
        <h5>${title}</h5>

        <div class="post-meta mb-2">
          Автор: <strong>${authorName}</strong> · ${new Date(date).toLocaleDateString("ru-RU")}
        </div>

        <p class="post-text" data-full="${text}" data-short="${short}">
          ${short}
        </p>

        ${isLong ? `<span class="read-more">Читать дальше</span>` : ""}
    `;

    const readMoreBtn = wrapper.querySelector(".read-more");
    if (readMoreBtn) {
        readMoreBtn.addEventListener("click", () => {
            const p = wrapper.querySelector(".post-text");
            if (readMoreBtn.textContent === "Читать дальше") {
                p.textContent = p.dataset.full;
                readMoreBtn.textContent = "Скрыть";
            } else {
                p.textContent = p.dataset.short;
                readMoreBtn.textContent = "Читать дальше";
            }
        });
    }

    return wrapper;
}

async function fetchUsers() {
    const res = await fetch("http://localhost:3000/users");
    if (!res.ok) throw new Error("Не удалось загрузить пользователей");
    return res.json();
}

async function fetchPosts() {
    try {
        const users = await fetchUsers();
        const res = await fetch("http://localhost:3000/posts");
        if (!res.ok) throw new Error("Не удалось загрузить посты");

        const posts = await res.json();
        posts.reverse();
        posts.forEach(post => {
            const author = users.find(u => u.id === post.author);
            blogFeed.appendChild(createPost({ ...post, authorName: author ? author.name : "Неизвестно" }));
        });
    } catch (e) {
        console.error(e);
        blogFeed.innerHTML = `<p class="text-danger">Ошибка загрузки постов: ${e.message}</p>`;
    }
}

fetchPosts();

(async function () {
    const form = document.getElementById("addPostForm");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add("was-validated");
            return;
        }

        if (!token) {
            alert("Вы должны быть авторизованы для добавления поста");
            return;
        }

        const newPost = {
            title: document.getElementById("postTitle").value,
            text: document.getElementById("postText").value,
            image: document.getElementById("postImage").value || "https://picsum.photos/seed/new/600/400",
            author: currentUser.id,
            date: new Date().toISOString().split("T")[0]
        };

        try {
            const res = await fetch("http://localhost:3000/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newPost)
            });

            let result;
            try {
                result = await res.json();
            } catch (e) {
                const text = await res.text();
                console.error("Ответ сервера не JSON:", text);
                alert("Ошибка сервера: " + text);
                return;
            }

            if (!res.ok) {
                alert("Ошибка при добавлении поста: " + JSON.stringify(result));
                return;
            }

            const modal = bootstrap.Modal.getInstance(document.getElementById("addPostModal"));
            modal.hide();

            form.reset();
            form.classList.remove("was-validated");

        } catch (err) {
            console.error(err);
            alert("Произошла ошибка: " + err.message);
        }
    });
})();
