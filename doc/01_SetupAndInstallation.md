# Setup and Installation
> REF: [WebGL2Fundamentals - WebGL2 Setup and Installation](https://webgl2fundamentals.org/webgl/lessons/webgl-setup-and-installation.html)

You can learn WebGL on a [online compiler](#online-compiler) or setup a [local environment](#local-environment) to try and test. If you just want to quickly explore what WebGL can do, or simply test some features, you may consider using an online compiler. If you are planning to learn more on web application, or you are intended to build a website, local environment setup is recommended.
## Online compiler
If you do not wish to setup your local environment for running your program, an alternative is to use a online platform to do the rendering for you.

- [jsfiddle.net](https://jsfiddle.net/greggman/8djzyjL3/)
- [codepen.io](https://codepen.io/greggman/pen/YGQjVV)
- [jsbin.com](https://jsbin.com/?html,output)

## Local Environment
If you plan to set up a local environment, a web server is needed for us to host our webpage. There are many ways to host a webpage locally. 

In out guide, [Node.js](https://nodejs.org/) is used because it is a widely adoped runtime environment for web application and it supports on Windows, macOS and most of the linux system.

A simple solution to set up a webserver with Node.js suggested by WebGL2Fundamentals is to use [Servez](https://greggman.github.io/servez/).  

In our guide, we will build the web server using [Express.js](https://expressjs.com/) instead of using Servez.

### Installation of Node.js
Check Node.js is installed.
```
node -v
```
If an error is shown, mentioning 'node' is not recognized, you need to install Node.js first. Installation guide is not pro
[Node.js - How to install Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)

### Setting up Express.js
1.  Initalise a npm project on your directory
    ```
    npm init
    ```
    _keep presssing `Enter` if default configurisation is used._

2.  Install Express

    ```
    npm install express
    ```

### Creating the files
1.  Create a public folder
    ```
    mkdir public
    ```

2.  Create index HTML file
    > NOTE: you can create the file in other way, like `new file` in VS Code
    ```
    nano public/index.html
    ```
    Put the following:
    ```
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hello World</title>
        <link rel="stylesheet" href="styles.css">
        <script src="https://greggman.github.io/webgl-lint/webgl-lint.js"></script>
    </head>
    <body>
        <h1>Hello World!</h1>
        <canvas id="glcanvas"></canvas>
        <script src="main.js"></script>
    </body>
    </html>
    ```
    Press `ctrl+O` to save
    Press `ctrl+X` to exit  

3.  Create styles CSS file
    > NOTE: you can create the file in other way, like `new file` in VS Code
    ```
    nano public/styles.css
    ```
    Put the following:  
    ```
    canvas {
        border: 1px solid #000;
    }
    ```
    Press `ctrl+O` to save
    Press `ctrl+X` to exit


4.  Create main JS file
    > NOTE: you can create the file in other way, like `new file` in VS Code
    ```
    nano public/main.js
    ```
    Put the following:  
    ```
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
    ```
    Press `ctrl+O` to save
    Press `ctrl+X` to exit  

5.  Create server JS file
    > NOTE: you can create the file in other way, like `new file` in VS Code
    ```
    nano server.js
    ```
    Put the following:
    ```
    const express = require('express');
    const path = require('path');
    const app = express();
    const port = 3000;
    app.use(express.static(path.join(__dirname, 'public')));
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    ```
    Press `ctrl+O` to save
    Press `ctrl+X` to exit  

### Start and End the Server
- Start the Server
    ```
    node server.js
    ```
    View the website on [http://localhost:3000/](http://localhost:3000/)
    A "Hello World!" text and a green triangle inside a rectangle should have appeared.

- Terminate the Server  
    Press `ctrl+c` to exit process.
