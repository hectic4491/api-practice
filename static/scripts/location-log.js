console.log('location-log.js loaded');

// Assign elements
const getLocation = document.querySelector("#getLocation");
const locationLog = document.querySelector("#locationLog");


// Get location button
getLocation.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    // position => locationLog.textContent
    position => {
      let latitude = position.coords["latitude"];
      let longitude = position.coords["longitude"];
      locationLog.textContent += `latitude: ${latitude}\n longitude: ${longitude}\n`;
    },
    error => console.error(error)
  )
});