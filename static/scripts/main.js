// Load JavaScript files:
loadScript('static/scripts/event-log.js');
loadScript('static/scripts/location-log.js');
loadScript('static/scripts/pokemon-fetch.js');
loadScript('static/scripts/webgl-draw.js');
//...


// Load function:
function loadScript(src) {
  let script = document.createElement('script');
  script.src = src;
  document.head.appendChild(script);
}