export function setupPhoneMask(inputId = "phone") {
  const phoneInput = document.getElementById(inputId);
  if (!phoneInput) return;
  phoneInput.addEventListener("input", formatPhone);
  phoneInput.addEventListener("keydown", handleBackspace);

  function formatPhone(e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.startsWith("8")) value = "7" + value.slice(1);
    if (!value.startsWith("7")) value = "7" + value;
    value = value.slice(0, 11);
    const c = value[0] || "";
    const p1 = value.slice(1, 4);
    const p2 = value.slice(4, 7);
    const p3 = value.slice(7, 9);
    const p4 = value.slice(9, 11);
    let formatted = `+${c}`;
    if (p1) formatted += ` (${p1}`;
    if (p1.length === 3) formatted += `)`;
    if (p2) formatted += ` ${p2}`;
    if (p3) formatted += `-${p3}`;
    if (p4) formatted += `-${p4}`;
    e.target.value = formatted;
  }

  function handleBackspace(e) {
    if (e.key === "Backspace") {
      const pos = e.target.selectionStart;
      const val = e.target.value;
      const maskChars = [" ", "(", ")", "-"];
      if (maskChars.includes(val[pos - 1])) {
        e.target.value = val.replace(/\D/g, "").slice(0, -1);
        formatPhone(e);
        e.preventDefault();
      }
    }
  }
}
