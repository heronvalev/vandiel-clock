let apiConfig = null;
let apiConfigLoadedAtMs = 0;

async function loadConfig() {
  const res = await fetch("/api/vanatime");
  apiConfig = await res.json();
  apiConfigLoadedAtMs = Date.now();
  console.log("Loaded config:", apiConfig);
}

loadConfig();
setInterval(loadConfig, 60000);

const clockEl = document.getElementById("clock");
const dayEl = document.getElementById("day");
const elementIcon = document.getElementById("elementIcon");
const dateEl = document.getElementById("vanaDate");

const iconMap = {
    Fire: "fire.svg",
    Earth: "earth.svg",
    Water: "water.svg",
    Wind: "wind.svg",
    Ice: "ice.svg",
    Thunder: "lightning.svg",
    Light: "light.svg",
    Dark: "dark.svg",
};

function pad2(n) {
    return String(n).padStart(2, "0");
}

function toVanaDayNumber(year, month, day) {
    // 12 months/year, 30 days/month => 360 days/year
    return (year * 360) + ((month - 1) * 30) + (day - 1);
}


function updateClock() {

    if (!apiConfig) return;

    const nowMs = apiConfig.server_now_ms + (Date.now() - apiConfigLoadedAtMs);

    const earthEpochMs = apiConfig.earth_epoch_ms;
    const earthSecondsPassed = (nowMs - earthEpochMs) / 1000;

    const vanaRate = apiConfig.vana_rate;
    const vanaEpochSeconds = apiConfig.vana_epoch_seconds;
    const totalVanaSeconds = vanaEpochSeconds + earthSecondsPassed * vanaRate;

    const secIntoDay = Math.floor(totalVanaSeconds) % 86400;

    const hours = Math.floor(secIntoDay / 3600);
    const minutes = Math.floor((secIntoDay % 3600) / 60);
    const seconds = secIntoDay % 60;

    const daysPassed = Math.floor(totalVanaSeconds / 86400);

    const epochY = apiConfig.vana_epoch_date.y;
    const epochM = apiConfig.vana_epoch_date.m;
    const epochD = apiConfig.vana_epoch_date.d;

    const epochDayNum = toVanaDayNumber(epochY, epochM, epochD);

    const currentDayNum = epochDayNum + daysPassed;

    const year = Math.floor(currentDayNum / 360);
    const dayOfYear = currentDayNum % 360;
    const month = Math.floor(dayOfYear / 30) + 1;
    const day = (dayOfYear % 30) + 1;

    dateEl.textContent = `${year}/${pad2(month)}/${pad2(day)}`;

    const vanaEpochWeekdayIndex = apiConfig.vana_epoch_weekday_index;
    const weekdayIndex = (vanaEpochWeekdayIndex + daysPassed) % 8;

    const dayName = apiConfig.vana_week[weekdayIndex][0];
    const element = apiConfig.vana_week[weekdayIndex][1];

    clockEl.textContent = `${pad2(hours)}:${pad2(minutes)}`;
    dayEl.textContent = dayName;

    // ✅ set icon based on element
    elementIcon.src = `/static/icons/${iconMap[element]}`;
    elementIcon.alt = element;
}

updateClock();
setInterval(updateClock, 1000);
