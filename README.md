# InteractiveGraphics
This repository is made for Interactive Graphics class that is taught in Sapienza University of Rome in year 2020. 

# HOMEWORK 1 

## DEFINITION 

Interactive Graphics
Homework 1
Online April 10th, 2020
Deadline: Sunday May 3rd, 2020 (23.59, Rome time zone)
Tasks to do
The homework must be completed alone. Each student should do its own homework and NO CODE SHARING IS ALLOWED. Submissions will be checked for plagiarism and suspicious ones will be rejected and reported. You cannot use code taken from the web, the only code you are allowed to use in your submission is the initial code provided with the assignment and the code of the book stored in Classroom.

You can, however, access all the documentation you want (including the WebGL and GLSL official
documents on https://www.khronos.org/).

The assignment material includes this PDF file, the publication mentioned in the next page and two
directories, Homework1 (containing the files homework1.html and homework1.js) and Common
(containing the files MVnew.js and initShaders.js). You need only to modify the two files (homework1.html
and homework1.js), add the texture used for point 6 and add a short documentation in PDF format (more
details at the end of this file). Please do not change the names of the files, you only need to modify their
content.
You need to modify the files so to obtain the following effects.
1. Replace the cube with a more complex and irregular geometry of 20 to 30 (maximum) vertices.
Each vertex should have associated a normal (3 or 4 coordinates) and a texture coordinate (2
coordinates). Explain how you choose the normal and texture coordinates.
2. Add the viewer position (your choice), a perspective projection (your choice of parameters) and
compute the ModelView and Projection matrices in the Javascript application. The viewer position
and viewing volume should be controllable with buttons, sliders or menus. Please choose the
parameters so that the object is clearly visible.
3. Add two light sources, a spotlight in a finite position and one directional. The parameters of the
spotlight should be controllable with buttons, sliders or menus. Assign to each light source all the
necessary parameters (your choice).
4. Assign to the object a material with the relevant properties (your choice).
5. Implement a per-fragment shading model based on the shading model described at the end of this
document.
6. Add a texture loaded from file (your choice), with the pixel color a combination of the color
computed using the lighting model and the texture. Add a button that activates/deactivates the
texture.

Describe your solution in a short PDF document (2-3 pages) describing the techniques used, the advantages
and disadvantages of the proposed solution and the features of your solution.