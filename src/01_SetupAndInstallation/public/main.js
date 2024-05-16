const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');

const vsGLSL = `#version 300 es
in vec4 position;
void main() {
    gl_Position = position;
}
`;

const fsGLSL = `#version 300 es
precision highp float;

out vec4 outColor;

void main() {
    outColor = vec4(0, 1, 0.5, 1);
}
`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vsGLSL);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  throw new Error(gl.getShaderInfoLog(vertexShader))
};

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fsGLSL);
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  throw new Error(gl.getShaderInfoLog(fragmentShader))
};

const prg = gl.createProgram();
gl.attachShader(prg, vertexShader);
gl.attachShader(prg, fragmentShader);
gl.linkProgram(prg);
if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
  throw new Error(gl.getProgramInfoLog(prg))
};

const positionLoc = gl.getAttribLocation(prg, 'position');

const triangleVAO = gl.createVertexArray();
gl.bindVertexArray(triangleVAO);

// in clip space
const vertexPositions = new Float32Array([
    0,   0.7,
  0.5,  -0.7,
 -0.5,  -0.7,
]);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexPositions, gl.STATIC_DRAW);

gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(
    positionLoc,  
    2,            // 2 values per vertex shader iteration
    gl.FLOAT,     // data is 32bit floats
    false,        // don't normalize
    0,            // stride (0 = auto)
    0,            // offset into buffer
);

gl.useProgram(prg);

// compute 3 vertices for 1 triangle
gl.drawArrays(gl.TRIANGLES, 0, 3);