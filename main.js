const clockEl = document.getElementById("clock");
const dayEl = document.getElementById("day");
const elementIcon = document.getElementById("elementIcon");
const dateEl = document.getElementById("vanaDate");

const VANA_RATE = 25.0;
const VANA_EPOCH_SECONDS = 13500;
const EARTH_EPOCH_UTC = Date.UTC(2026, 0, 23, 14, 12, 45);
const VANA_EPOCH_WEEKDAY_INDEX = 4;
const VANA_EPOCH_YEAR = 1496;
const VANA_EPOCH_MONTH = 5;
const VANA_EPOCH_DAY = 5;


const VANA_WEEK = [
    ["Firesday", "Fire"],
    ["Earthsday", "Earth"],
    ["Watersday", "Water"],
    ["Windsday", "Wind"],
    ["Iceday", "Ice"],
    ["Lightningday", "Thunder"],
    ["Lightsday", "Light"],
    ["Darksday", "Dark"],
];

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
    const nowMs = Date.now();
    const earthSecondsPassed = (nowMs - EARTH_EPOCH_UTC) / 1000;

    const totalVanaSeconds = VANA_EPOCH_SECONDS + earthSecondsPassed * VANA_RATE;

    const secIntoDay = Math.floor(totalVanaSeconds) % 86400;

    const hours = Math.floor(secIntoDay / 3600);
    const minutes = Math.floor((secIntoDay % 3600) / 60);
    const seconds = secIntoDay % 60;

    const daysPassed = Math.floor(totalVanaSeconds / 86400);

    const epochDayNum = toVanaDayNumber(VANA_EPOCH_YEAR, VANA_EPOCH_MONTH, VANA_EPOCH_DAY);
    const currentDayNum = epochDayNum + daysPassed;

    const year = Math.floor(currentDayNum / 360);
    const dayOfYear = currentDayNum % 360;
    const month = Math.floor(dayOfYear / 30) + 1;
    const day = (dayOfYear % 30) + 1;

    dateEl.textContent = `${year}/${month}/${day}`;


    const weekdayIndex = (VANA_EPOCH_WEEKDAY_INDEX + daysPassed) % 8;

    const dayName = VANA_WEEK[weekdayIndex][0];
    const element = VANA_WEEK[weekdayIndex][1];

    clockEl.textContent = `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
    dayEl.textContent = dayName;

    // ✅ set icon based on element
    elementIcon.src = `icons/${iconMap[element]}`;
    elementIcon.alt = element;
}

updateClock();
setInterval(updateClock, 1000);
