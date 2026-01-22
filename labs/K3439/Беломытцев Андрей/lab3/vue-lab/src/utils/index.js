export function formatNumber(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B";
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export const lang = {
  ru: "🇷🇺",
  en: "🇺🇸",
  es: "🇪🇸",
  de: "🇩🇪",
  fr: "🇫🇷",
  pt: "🇧🇷",
};

export const colors = {
  "Google Docs": "#4285F4",
  Skillbox: "#6A4CFF",
  IT: "#3B82F6",
  Skyeng: "#00AEEF",
  Illustrator: "#FF9A00",
  Chemistry: "#1E9E63",
  Electronics: "#007ACC",
  "C++": "#00599C",
  ОГЭ: "#D32F2F",
  ESP8266: "#5C6BC0",
  Adobe: "#FF0000",
  "DaVinci Resolve": "#0DADEA",
  Dart: "#0175C2",
  Photoshop: "#31A8FF",
  Flutter: "#02569B",
  Java: "#ED8B00",
  PHP: "#777BB4",
  SQL: "#00618A",
  C: "#283593",
  Physics: "#5E35B1",
  Сотка: "#FFCC00",
  ЕГЭ: "#1565C0",
  "Popular Science": "#C62828",
  CSS: "#1572B6",
  Умскул: "#FF6F00",
  Economics: "#388E3C",
  FastAPI: "#009688",
  Web: "#2196F3",
  Biology: "#4CAF50",
  Перевод: "#455A64",
  Medicine: "#00ACC1",
  HTML: "#E44D26",
  "Русский язык": "#8D6E63",
  "After Effects": "#9393FF",
  Python: "#306998",
  JavaScript: "#F7DF1E",
  Figma: "#F24E1E",
  Linux: "#FCC624",
  Университет: "#3949AB",
  Geography: "#00897B",
  Blender: "#F5792A",
  Вебиум: "#4A47FF",
  "C#": "#68217A",
  Programming: "#1976D2",
  Education: "#3F51B5",
  "Cinema 4D": "#1A76D1",
  English: "#D32F2F",
  ESP32: "#424242",
  Arduino: "#00979D",
  Premiere: "#9933FF",
  Аудио: "#7E57C2",
  "Data Science": "#673AB7",
  History: "#8D6E63",
  Math: "#1A237E",
  Space: "#0D47A1",
  Social: "#1976D2",
};
