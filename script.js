let seconds = 0;
let timerInterval = null;

let travelSeconds = 0;
let repairSeconds = 0;
let testSeconds = 0;

let currentMode = "standby";

let totalTopatsu = 0;
let totalDowntimeSeconds = 0;
let totalRepairSeconds = 0;

const timer = document.getElementById("timer");
const statusText = document.getElementById("status");

const travelTime = document.getElementById("travelTime");
const repairTime = document.getElementById("repairTime");
const testTime = document.getElementById("testTime");
const totalTime = document.getElementById("totalTime");

const startBtn = document.getElementById("startBtn");
const locationBtn = document.getElementById("locationBtn");
const repairBtn = document.getElementById("repairBtn");
const finishBtn = document.getElementById("finishBtn");
const resetBtn = document.getElementById("resetBtn");
const line = document.getElementById("line");
const machine = document.getElementById("machine");
const engineer = document.getElementById("engineer");
const problem = document.getElementById("problem");

const historyBody = document.getElementById("historyBody");

const popupSuccess =
    document.getElementById("popupSuccess");

const summaryTopatsu =
    document.getElementById("summaryTopatsu");

const summaryDowntime =
    document.getElementById("summaryDowntime");

const summaryRepair =
    document.getElementById("summaryRepair");

const dateNow = document.getElementById("dateNow");
const clockNow = document.getElementById("clockNow");

function formatTime(totalSeconds){

    let hrs = Math.floor(totalSeconds / 3600);
    let mins = Math.floor((totalSeconds % 3600) / 60);
    let secs = totalSeconds % 60;

    hrs = String(hrs).padStart(2, '0');
    mins = String(mins).padStart(2, '0');
    secs = String(secs).padStart(2, '0');

    return `${hrs}:${mins}:${secs}`;
}

function updateTimer(){

    seconds++;

    timer.innerText = formatTime(seconds);
}

function updateButtons(start, location, repair, finish, reset){

    startBtn.disabled = start;

    locationBtn.disabled = location;

    repairBtn.disabled = repair;

    finishBtn.disabled = finish;

    resetBtn.disabled = reset;

}

function setStatus(text, color){

    statusText.innerText = text;

    statusText.style.backgroundColor = color;

    statusText.style.color = "white";

}

function startTimer(){

    clearInterval(timerInterval);

    timerInterval = setInterval(updateTimer, 1000);
}

startBtn.addEventListener("click", function(){

    seconds = 0;

    currentMode = "travel";

    setStatus("Perjalanan ke Lokasi", "#007bff");

    startTimer();

    updateButtons(true, false, true, true, false);

});

locationBtn.addEventListener("click", function(){

    if(currentMode !== "travel"){
        return;
    }

    travelSeconds = seconds;

    travelTime.innerText = formatTime(travelSeconds);

    seconds = 0;

    currentMode = "repair";

    setStatus("Perbaikan Mesin", "#ff9800");

    updateButtons(true, true, false, true, false);

});

repairBtn.addEventListener("click", function(){

    if(currentMode !== "repair"){
        return;
    }

    repairSeconds = seconds;

    repairTime.innerText = formatTime(repairSeconds);

    seconds = 0;

    currentMode = "test";

    setStatus("Test Run Mesin", "#28a745");

    updateButtons(true, true, true, false, false);

});

finishBtn.addEventListener("click", function(){

    if(currentMode !== "test"){
        return;
    }

    testSeconds = seconds;

    testTime.innerText = formatTime(testSeconds);

    let totalSeconds =
    travelSeconds +
    repairSeconds +
    testSeconds;

    totalTopatsu++;

totalDowntimeSeconds += totalSeconds;

totalRepairSeconds += repairSeconds;

summaryTopatsu.innerText = totalTopatsu;

summaryDowntime.innerText =
    formatTime(totalDowntimeSeconds);

let averageRepair =
    totalRepairSeconds / totalTopatsu;

summaryRepair.innerText =
    formatTime(Math.floor(averageRepair));

totalTime.innerText = formatTime(totalSeconds);

    const newRow = `
<tr
    data-total="${totalSeconds}"
    data-repair="${repairSeconds}"
>
    <td>${line.value}</td>
    <td>${machine.value}</td>
    <td>${engineer.value}</td>
    <td>${problem.value}</td>
    <td>${formatTime(travelSeconds)}</td>
    <td>${formatTime(repairSeconds)}</td>
    <td>${formatTime(testSeconds)}</td>
    <td>
    <button onclick="deleteRow(this)"
        class="delete-btn">

        DELETE

    </button>
</td>
</tr>
`;

historyBody.innerHTML += newRow;

showPopup();

    clearInterval(timerInterval);

    setStatus("Topatsu Selesai", "#dc3545");

    updateButtons(true, true, true, true, false);

    currentMode = "done";

});

resetBtn.addEventListener("click", function(){

    clearInterval(timerInterval);

    seconds = 0;

    travelSeconds = 0;
    repairSeconds = 0;
    testSeconds = 0;

    currentMode = "standby";

    timer.innerText = "00:00:00";

    travelTime.innerText = "00:00:00";
    repairTime.innerText = "00:00:00";
    testTime.innerText = "00:00:00";

    setStatus("Standby", "#6c757d");

    updateButtons(false, true, true, true, false);

    totalTime.innerText = "00:00:00";

});

function updateDateTime(){

    const now = new Date();

    const date = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const time = now.toLocaleTimeString('id-ID');

    dateNow.innerText = date;

    clockNow.innerText = time;
}

setInterval(updateDateTime, 1000);

updateDateTime();

function showPopup(){

    popupSuccess.classList.add("popup-show");

    setTimeout(function(){

        popupSuccess.classList.remove("popup-show");

    }, 2500);

}

function deleteRow(button){

    const row =
        button.parentElement.parentElement;

    const total =
        parseInt(row.dataset.total);

    const repair =
        parseInt(row.dataset.repair);

    totalTopatsu--;

    totalDowntimeSeconds -= total;

    totalRepairSeconds -= repair;

    if(totalTopatsu < 0){

        totalTopatsu = 0;

    }

    if(totalDowntimeSeconds < 0){

        totalDowntimeSeconds = 0;

    }

    if(totalRepairSeconds < 0){

        totalRepairSeconds = 0;

    }

    summaryTopatsu.innerText =
        totalTopatsu;

    summaryDowntime.innerText =
        formatTime(totalDowntimeSeconds);

    if(totalTopatsu > 0){

        let averageRepair =
            totalRepairSeconds / totalTopatsu;

        summaryRepair.innerText =
            formatTime(
                Math.floor(averageRepair)
            );

    }else{

        summaryRepair.innerText =
            "00:00:00";

    }

    row.remove();

}