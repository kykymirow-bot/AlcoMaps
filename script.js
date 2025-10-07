const tg = window.Telegram.WebApp;
tg.expand();

const userInfo = document.getElementById("user-info");
userInfo.innerText = `Привет, ${tg.initDataUnsafe?.user?.first_name || "гость"}!`;

const findBtn = document.getElementById("find-btn");
const result = document.getElementById("result");
let map;

function initMap(lat, lon) {
  map = L.map("map").setView([lat, lon], 14);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(map);

  L.marker([lat, lon]).addTo(map).bindPopup("Это ты 🍻").openPopup();

  const nearPeople = [
    { name: "Сергей", lat: lat + 0.002, lon: lon + 0.001 },
    { name: "Анна", lat: lat - 0.0015, lon: lon - 0.001 },
    { name: "Дима", lat: lat + 0.001, lon: lon - 0.002 }
  ];

  nearPeople.forEach(p => {
    L.marker([p.lat, p.lon]).addTo(map).bindPopup(`${p.name} 🍺 хочет выпить`);
  });
}

function getLocation() {
  if (!navigator.geolocation) {
    result.innerText = "⚠️ Геолокация не поддерживается";
    return;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    result.innerText = `📍 Твоя локация получена!`;
    initMap(latitude, longitude);
  }, err => {
    result.innerText = "❌ Не удалось получить геолокацию. Разреши доступ.";
  });
}

findBtn.addEventListener("click", () => {
  findBtn.disabled = true;
  findBtn.innerText = "Поиск...";
  result.innerText = "⏳ Ищем людей рядом...";

  tg.MainButton.setText("Отменить поиск");
  tg.MainButton.show();

  tg.MainButton.onClick(() => {
    tg.MainButton.hide();
    findBtn.disabled = false;
    findBtn.innerText = "Ищу компанию 🍻";
    result.innerText = "❌ Поиск отменён.";
  });

  setTimeout(() => {
    getLocation();
    findBtn.disabled = false;
    findBtn.innerText = "Ищу компанию 🍻";
    tg.MainButton.hide();
  }, 2000);
});