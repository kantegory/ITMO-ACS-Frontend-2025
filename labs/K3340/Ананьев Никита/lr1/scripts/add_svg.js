fetch("../pages/icons.html")
.then(res => res.text())
.then(svg => {
    document.body.insertAdjacentHTML("afterbegin", svg);
});
