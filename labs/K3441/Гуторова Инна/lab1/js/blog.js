const MAX_LENGTH = 500;
const blogFeed = document.getElementById("blogFeed");

function createPost({ title, text, image, author, date }) {
    const short = text.length > MAX_LENGTH ? text.slice(0, MAX_LENGTH) + "..." : text;
    const isLong = text.length > MAX_LENGTH;

    const wrapper = document.createElement("div");
    wrapper.className = "blog-post card p-3";

    wrapper.innerHTML = `
    <img src="${image}" alt="${title}" class="mb-3">
    <h5>${title}</h5>

    <div class="post-meta mb-2">
      Автор: <strong>${author}</strong> · ${new Date(date).toLocaleDateString("ru-RU")}
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

fetch("data/blog.json")
    .then(res => res.json())
    .then(data => {
        data.forEach(post => blogFeed.appendChild(createPost(post)));
    });

(function () {
    const form = document.getElementById("addPostForm");

    form.addEventListener("submit", function (event) {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add("was-validated");
            return;
        }

        event.preventDefault();

        const newPost = {
            title: document.getElementById("postTitle").value,
            text: document.getElementById("postText").value,
            image: document.getElementById("postImage").value || "https://picsum.photos/seed/new/600/400",
            author: document.getElementById("postAuthor").value,
            date: new Date().toISOString().split("T")[0]
        };

        blogFeed.prepend(createPost(newPost));

        const modal = bootstrap.Modal.getInstance(document.getElementById("addPostModal"));
        modal.hide();

        form.reset();
        form.classList.remove("was-validated");
    });
})();
