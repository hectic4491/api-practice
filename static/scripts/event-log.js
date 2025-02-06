console.log('event-log.js loaded.');

// Assign elements
const reload = document.querySelector("#reload");
const eventLog = document.querySelector("#eventLog");


// Reload button
reload.addEventListener("click", () => {
  eventLog.textContent = "";
  setTimeout(() => {
    window.location.reload(true);
  }, 200);
});


// Loading Event Listeners
window.addEventListener("load", (event) => {
  eventLog.textContent += "load\n";
});

document.addEventListener("readystatechange", (event) => {
  eventLog.textContent += `readystate: ${document.readyState}\n`;
});

document.addEventListener("DOMContentLoaded", (event) => {
  eventLog.textContent += "DOMContentLoaded\n"
})