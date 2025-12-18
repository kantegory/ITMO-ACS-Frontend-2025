export function renderDialogs(dialogs, onClick) {
  const container = document.getElementById("history");
  if (!container) return;

  container.innerHTML = "";

  dialogs.forEach((d) => {
    const div = document.createElement("div");
    div.className = "list-group-item list-group-item-action";
    div.textContent = d.title || "Диалог";
    div.onclick = () => onClick(d.id);
    container.appendChild(div);
  });
}

export function renderMessages(messages) {
  const chat = document.getElementById("chatContent");
  if (!chat) return;

  chat.innerHTML = "";
  messages.forEach((m) => {
    const div = document.createElement("div");
    div.className = "mb-2";
    div.textContent = m.text;
    chat.appendChild(div);
  });

  chat.scrollTop = chat.scrollHeight;
}
