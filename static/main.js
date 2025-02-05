// Load JavaScript files:
loadScript('static/script.js');
loadScript('static/file2.js');
//...


// Load function:
function loadScript(src) {
  let script = document.createElement('script');
  script.src = src;
  document.head.appendChild(script);
}