# Drawing Triangles

When you have copied the `main.js`, you will see lots of code. No worry, we can start with looking at the main() funtion. This is where everything begin. But before we discuss about the code, there are some concepts we need to understand first.

## Graphics and Images
In our first example, we do not have any "images". Yet, we can see two triangles in a navy blue background. Why? It is because we use "graphics" instead.

### Image

Images are pretty straight foward, it is a __combination of different pixels__ and each pixel contains the colour/brightness information. The basic format of an image is Bitmap (BMP). It stores the colour of each pixel in an 2D array. JPG or other format may utilize the image by performing some lossy/lossless compression algorithm, so that the final file size is smaller.

### Graphics

> REF: [Fundamentals of Computer Graphics(Fourth Edition) by Steve Marschner](https://www.amazon.com/Fundamentals-Computer-Graphics-Steve-Marschner/dp/1482229390)

On the otherhand, graphics, in my understanding, I will describe it as __anything we can see from the computer__ which can be vectors, polygon or anything that the __computer can understand and manipulate it__. In simply speaking, computer graphics describes any use of computers to create and manipulate images. 

## Object-order Rendering Pipeline

In our first project, the basic object-order rendering pipeline is used. It means, we need to construct the objects in our "world space" and find out the pixel value that needs to be displayed on our screen (screen space). The rendering pipeline in general:
1. Vertex Processing
2. Geometry manipulation
3. Rasterization
4. Fragment Processing

## General Steps in WebGL Programming
We are not going to further discuss about the rendering pipeline here as this guide focuses mainly on WebGL. To simplify the programming process, we can break it into following steps:

1. Setup the WebGL Context
2. Create shaders
3. Create programs (binding shaders)
4. Setting up obejcts, for each object,
   1. Creat VAO
   2. Create and bind Buffers
   3. Set up the attributes
5. Rendering: set up canvas(screen)
6. Rendering objects, for each objects,
   1. Specify the program
   2. Bind VAO
   3. set uniforms and bind texture
   4. Draw the object