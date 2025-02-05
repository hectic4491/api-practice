console.log("Script Running.")

const reload = document.querySelector("#reload");
const eventLog = document.querySelector("#eventLog");

const getLocation = document.querySelector("#getLocation");
const locationLog = document.querySelector("#locationLog");

const pokeName = document.querySelector("#pokeName");
const showPokemon = document.querySelector("#showPokemon");
const pokemonPicBox = document.querySelector("#pokemonPicBox");

// get the canvas element
const canvas = document.getElementById("glCanvas");
// Initialize the WebGL context
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
// If WebGL is not supported, alert the user
if (!gl) {
  alert('Unable to initialize WebGL. Your browser may not support it.');
}


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


// Show Pokemon button
showPokemon.addEventListener("click", () => {
  let pokemonName = pokeName.value.toLowerCase();
  let URL = "https://pokeapi.co/api/v2/pokemon/" + pokemonName;
  
  fetch(URL)
  .then(response => response.json())
  .then(data => {
    if (document.getElementById("pokemonPicture")) {
      let child = document.getElementById("pokemonPicture");
      pokemonPicBox.removeChild(child);
    };
    let sprite = data.sprites.front_default;
    let img = document.createElement('img');
    img.alt = `A picture of the Pokemon named ${pokemonName}.`;
    img.src = sprite;
    img.id = "pokemonPicture";
    pokemonPicBox.appendChild(img);
  })
  .catch((error) => console.error(error));
});


// WebGl Canvas
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
const vsSource = `
  attribute vec4 aVertexPosition;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  }`;

const fsSource = `
  void main(void) {
    gl_FragColor = vec4(0.3, 0.1, 0.35, 1.0); // Red color
  }
`
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) {
    console.error('Unable to create shader');
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('An error occured compiling the shader: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
// Vertex Shader
const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
// Fragment Shader
const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);


function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
      return null;
  }
  return shaderProgram;
}

const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
const programInfo = {
  program: shaderProgram,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
  },
  uniformLocations: {
    projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
    modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
  }
};

function initBuffers(gl) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,
    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,
    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,];


  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  const indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9, 10,      8, 10, 11,    // top
    12, 13, 14,    12, 14, 15,    // bottom
    16, 17, 18,    16, 18, 19,    // right
    20, 21, 22,    20, 22, 23,    // left
  ];

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return {
      position: positionBuffer,
      indices: indexBuffer,
  };
}

const buffers = initBuffers(gl);

let rotation = 0.0;

function drawScene(gl, programInfo, buffers, deltaTime) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = 34 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -8.0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotation, [1, 0, 1]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotation * 0.2, [0, 1, 2]);

    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);

    rotation += deltaTime;
}

function main() {
  let then = 0;

  function render(now) {
      now *= 0.0025;
      const deltaTime = now - then;
      then = now;

      drawScene(gl, programInfo, buffers, deltaTime);

      requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();

