'use strict';

// Vertex shader for both objects
const vsGLSL = `#version 300 es
    precision highp float;
    in vec4 position;
    in vec4 color;

    uniform mat4 transformMatrix;

    out vec4 v_color;

    void main() {
        gl_Position = transformMatrix * position;
        v_color = color;
    }
    `;

// Fragment shader for object 1
const fsGLSL1 = `#version 300 es
    precision highp float;

    in vec4 v_color;

    out vec4 outColor;

    void main() {
        outColor = v_color;
    }
    `;

// Fragment shader for object 2
const fsGLSL2 = `#version 300 es
    precision highp float;

    uniform vec4 color;

    out vec4 outColor;
    void main() {
        outColor = color;
    }
    `;

function createWebGLContextByCanvasID(canvasID) {
    try {
        const canvas = document.getElementById(canvasID);
        const gl = canvas.getContext('webgl2');
        if (!gl) {
            throw new Error('WebGL2 is not supported');
        }
        return gl;
    } catch (e) {
        alert('Failed to create WebGL context: \n' + e.message);
        throw new Error('Failed to create WebGL context: \n' + e.message);
    }
}

function createCompiledShader(gl, type, source) {
    try {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader));
        }
        return shader;
    } catch (e) {
        alert('Failed to compile a shader: \n' + e.message);
        throw new Error('Failed to compile a shader: \n' + e.message);
    }
}

function createProgram(gl, vertexShader, fragmentShader) {
    try {
        const prg = gl.createProgram();
        gl.attachShader(prg, vertexShader);
        gl.attachShader(prg, fragmentShader);
        gl.linkProgram(prg);
        if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(prg));
        }
        return prg;
    } catch (e) {
        alert('Failed to create a program to link shaders: \n' + e.message);
        throw new Error('Failed to link a program: \n' + e.message);
    }
}

function createVAO(gl) {
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    return vao;
}

function createAndBindBuffer(gl, target, data, usage) {
    try{
        const buffer = gl.createBuffer();
        gl.bindBuffer(target, buffer);
        gl.bufferData(target, data, usage);
        return buffer;
    } catch (e) {
        alert('Failed to create a buffer: \n' + e.message);
        throw new Error('Failed to create a buffer: \n' + e.message);
    }
}

function main() {
    // create a WebGL2 context
    const gl = createWebGLContextByCanvasID('glcanvas');

    // create shaders and programs
    const vertexShader = createCompiledShader(gl, gl.VERTEX_SHADER, vsGLSL);
    const fragmentShader1 = createCompiledShader(gl, gl.FRAGMENT_SHADER, fsGLSL1);
    const prog1 = createProgram(gl, vertexShader, fragmentShader1); // for object 1

    const fragmentShader2 = createCompiledShader(gl, gl.FRAGMENT_SHADER, fsGLSL2);
    const prog2 = createProgram(gl, vertexShader, fragmentShader2); // for object 2

    // Init objects
    //  for each object
    //   create a vertex array object VAO and bind it
    //   create all the buffers for this object
    //   setup all the attributes for this object

    // Obejct 1: Left Triangle

    const vertexPositions = new Float32Array([
        -0.5, -0.433,
         0.5, -0.433,
         0.0,  0.433
    ]);
    
    const vertexColors = new Uint8Array([
        255, 0, 0, 255,
        0, 255, 0, 255,
        0, 0, 255, 255
    ]);

    // Object 1: Left Triangle VAO
    const leftTriangleVAO = createVAO(gl);

    // Object 1: Left Triangle Buffers
    const leftTrianglePositionBuffer = createAndBindBuffer(
        gl, gl.ARRAY_BUFFER, vertexPositions, gl.STATIC_DRAW
    );
    const leftTriangleColorBuffer = createAndBindBuffer(
        gl, gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW
    );

    // Object 1: Left Triangle Attributes
    const prog1Index = {
        position: gl.getAttribLocation(prog1, 'position'),
        color: gl.getAttribLocation(prog1, 'color')
    };
    gl.enableVertexAttribArray(prog1Index.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, leftTrianglePositionBuffer);
    gl.vertexAttribPointer(
        prog1Index.position,    // attribute location(index)
        2,                      // number of components per attribute
        gl.FLOAT,               // type of data
        false,                  // normalize flag
        0,                      // stride
        0,                      // offset
    );
    gl.enableVertexAttribArray(prog1Index.color);
    gl.bindBuffer(gl.ARRAY_BUFFER, leftTriangleColorBuffer);
    gl.vertexAttribPointer(
        prog1Index.color,
        4,
        gl.UNSIGNED_BYTE,
        true,                   // true because we use [0, 255] for colors and we want to normalize them to [0, 1]
        0,
        0,
    );

    // Object 2: Right Triangle VAO
    const rightTriangleVAO = createVAO(gl);
    
    // Object 2: Right Triangle Buffers
    const rightTrianglePositionBuffer = createAndBindBuffer(
        gl, gl.ARRAY_BUFFER, vertexPositions, gl.STATIC_DRAW);
    const rightTriangleColorBuffer = createAndBindBuffer(
        gl, gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW);

    // Object 2: Right Triangle Attributes
    const prog2Index = {
        position: gl.getAttribLocation(prog2, 'position'),
        color: gl.getUniformLocation(prog2, 'color')
    };
    gl.enableVertexAttribArray(prog2Index.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, rightTrianglePositionBuffer);
    gl.vertexAttribPointer(
        prog2Index.position,
        2,
        gl.FLOAT,
        false,
        0,
        0,
    );
    // colors will be handled after using the program and set using uniform4f

    // Draw objects
    //  for each model
    //   bindVertexArray(model's VAO)
    //   set uniforms and bind textures 
    //   glDrawElements

    // tell WebGL how to convert from clip space to pixels
    // viewport(startX, startY, width, height) maps clip space to screen space
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); // use the entire canvas

    // clear the canvas
    gl.clearColor(0, 0, 0.2, 1); // navy blue background
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    // Object 1: Left Triangle
    gl.useProgram(prog1);

    // translate the left triangle to the left by 0.5 using a 2D transformation matrix
    // uniformMatrix4fv(location, transpose, value)
    gl.uniformMatrix4fv(gl.getUniformLocation(prog1, 'transformMatrix'), false, new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        -0.5, 0, 0, 1
    ]));

    gl.bindVertexArray(leftTriangleVAO);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // Object 2: Right Triangle

    gl.useProgram(prog2);

    // translate the right triangle to the right by 0.5 and rotate it by 180 degrees
    gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'transformMatrix'), false, new Float32Array([
        -1, 0, 0, 0,
        0, -1, 0, 0,
        0, 0, 1, 0,
        0.5, 0, 0, 1
    ]));
    // set the color of the right triangle to yellow
    // not necessary to use new Float32Array because it's a vec4 (not writing to the buffer)
    gl.uniform4fv(prog2Index.color, [1, 1, 0, 1]);
    
    gl.bindVertexArray(rightTriangleVAO);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

try {
    main();
} catch (e) {
    alert('Failed to run the program: \n' + e.message);
    throw new Error('Failed to run the program: \n' + e.message);
}
