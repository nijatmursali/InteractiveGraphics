"use strict";

var canvas;
var gl;

var numVertices = 132;

var c;
var program;

/****** PROJECTIONS AND ROTATIONS ******/
var thetaforObject = [0, 0, 0];
var thetaforDirLight = [0, 0, 0];
var thetaforSpotlight = [0, 0, 0];

var near = 6.0;
var far = 3.6;
var radius = 4.0;
var theta = 0.0;
var phi = 0.0;
var dr = 5.0 * Math.PI / 180.0;


var fovy = 45.0;
var aspect = 1.0;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;

var modelViewMatrix, projectionMatrix, RotMatrixforDirectionalLight, RotMatrixforSpotlight;
var modelViewMatrixLoc, projectionMatrixLoc, RotMatrixforDirectionalLightLoc, RotMatrixforSpotlightLoc;
var eyeloc;
/****** END OF PROJECTIONS AND ROTATIONS ******/

/****** FLAGS ******/
var CartoonShaderFlag = false;
var RotationFlag = false;
var TextureFlag = false;
var flag = true;
var TexCordFlag = true;
/****** END OF FLAGS ******/


/****** LIGHTS AND THEIR POSITIONS ******/
var XrotforDirLight = 0.0;
var YrotforDirLight = 0.0;
var ZrotforDirLight = 0.0;
var XrotforSpotlight = 0.0;
var YrotforSpotlight = 0.0;

var globalLightAmbient = vec4(0.0, 1.0, 0.5, 1.0);

var PositionforDirectionalLight = vec4(1.0, 1.0, 1.0, 1.0);
var AmbientforDirectionalLight = vec4(0.2, 0.2, 0.2, 1.0);
var DiffuseforDirectionalLight = vec4(1.0, 1.0, 1.0, 1.0);
var SpecularforDirectionalLight = vec4(1.0, 1.0, 1.0, 1.0);

var PositionforSpotlight = vec4(0.0, 0.0, 1.0, 0.0);
var AmbientforSpotlight = vec4(0.2, 0.2, 0.2, 1.0);
var DiffuseforSpotlight = vec4(1.0, 1.0, 1.0, 1.0);
var SpecularforSpotlight = vec4(1.0, 1.0, 1.0, 1.0);
var LightCutOff = 20.2;

//declared that from the slides
var AmbientforMaterial = vec4(1.0, 0.0, 1.0, 1.0);
var DiffuseforMaterial = vec4(0.6, 1.0, 0.6, 1.0);
var SpecularforMaterial = vec4(0.6, 1.0, 0.6, 1.0);
var materialShininess = 100.0;

/****** END OF LIGHTS AND THEIR POSITIONS ******/

var pointsArray = [];
var colorsArray = [];
var normalsArray = [];
var texCoordsArray = [];

var texture;

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var vertices = [
    vec4(0, 0, 1.077364, 1.0),
    vec4(0.7442063, 0, 0.7790187, 1.0),
    vec4(0.3123013, 0.6755079, 0.7790187, 1.0),
    vec4(-0.482096, 0.5669449, 0.7790187, 1.0),
    vec4(-0.7169181, -0.1996786, 0.7790187, 1.0),
    vec4(-0.1196038, -0.7345325, 0.7790187, 1.0),
    vec4(0.6246025, -0.7345325, 0.4806734, 1.0),
    vec4(1.056508, -0.1996786, 0.06806912, 1.0),
    vec4(0.8867128, 0.5669449, 0.2302762, 1.0),
    vec4(0.2621103, 1.042774, 0.06806912, 1.0),
    vec4(-0.532287, 0.9342111, 0.06806912, 1.0),
    vec4(-1.006317, 0.3082417, 0.2302762, 1.0),
    vec4(-0.7020817, -0.784071, 0.2302762, 1.0),
    vec4(0.02728827, -1.074865, 0.06806912, 1.0),
    vec4(0.6667271, -0.784071, -0.3184664, 1.0),
    vec4(0.8216855, -0.09111555, -0.6908285, 1.0),
    vec4(0.6518908, 0.6755079, -0.5286215, 1.0),
    vec4(-0.1196038, 0.8751866, -0.6168117, 1.0),
    vec4(-0.8092336, 0.4758293, -0.5286215, 1.0),
    vec4(-0.9914803, -0.2761507, -0.3184664, 1.0),
    vec4(-0.4467414, -0.825648, -0.5286215, 1.0),
    vec4(0.1926974, -0.5348539, -0.915157, 1.0),
    vec4(0.1846311, 0.2587032, -1.029416, 1.0),
    vec4(-0.5049987, -0.1406541, -0.9412258, 1.0)
];


function configureTexture(image) {
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
        gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "uTexMap"), 0);
}

var vertexColors = [
    vec4(0.8, 0.2, 0.7, 1.0), // black
    vec4(1.0, 0.0, 0.0, 1.0), // red
    vec4(1.0, 1.0, 0.0, 1.0), // yellow
    vec4(0.0, 1.0, 0.0, 1.0), // green
    vec4(0.0, 0.0, 1.0, 1.0), // blue
    vec4(1.0, 0.0, 1.0, 1.0), // magenta
    vec4(0.0, 1.0, 1.0, 1.0), // cyan
    vec4(1.0, 0.5, 0.0, 1.0) // orange
];

function forTriangle(a, b, c) {

    var i = a % 8;
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    normal = vec3(normal);

    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[i]);
    normalsArray.push(normal);
    if (TexCordFlag) texCoordsArray.push(texCoord[0]);
    else texCoordsArray.push(texCoord[0]);

    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[i]);
    normalsArray.push(normal);
    if (TexCordFlag) texCoordsArray.push(texCoord[1]);
    else texCoordsArray.push(texCoord[2]);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[i]);
    normalsArray.push(normal);
    if (TexCordFlag) texCoordsArray.push(texCoord[2]);
    else texCoordsArray.push(texCoord[1]);

    TexCordFlag = !TexCordFlag;
}

function forQuads(a, b, c, d) {
    var i = a % 8;
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[a]);
    var normal = cross(t1, t2);
    normal = normalize(normal);

    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[i]);
    normalsArray.push(normal);
    if (TexCordFlag) texCoordsArray.push(texCoord[0]);
    else texCoordsArray.push(texCoord[0]);

    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[i]);
    normalsArray.push(normal);
    if (TexCordFlag) texCoordsArray.push(texCoord[1]);
    else texCoordsArray.push(texCoord[2]);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[i]);
    normalsArray.push(normal);
    if (TexCordFlag) texCoordsArray.push(texCoord[2]);
    else texCoordsArray.push(texCoord[3]);

    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[i]);
    normalsArray.push(normal);
    if (TexCordFlag) texCoordsArray.push(texCoord[0]);
    else texCoordsArray.push(texCoord[2]);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[i]);
    normalsArray.push(normal);
    if (TexCordFlag) texCoordsArray.push(texCoord[2]);
    else texCoordsArray.push(texCoord[1]);

    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[i]);
    normalsArray.push(normal);
    if (TexCordFlag) texCoordsArray.push(texCoord[3]);
    else texCoordsArray.push(texCoord[0]);

    TexCordFlag = !TexCordFlag;
}

function makeitShine() {
    //connecting triangles 
    forTriangle(0, 1, 2);
    forTriangle(0, 2, 3);
    forTriangle(0, 3, 4);
    forTriangle(0, 4, 5);
    forTriangle(1, 6, 7);
    forTriangle(1, 7, 8);
    forTriangle(1, 8, 2);
    forTriangle(2, 8, 9);
    forTriangle(3, 10, 11);
    forTriangle(3, 11, 4);
    forTriangle(4, 12, 5);
    forTriangle(5, 12, 13);
    forTriangle(5, 13, 6);
    forTriangle(6, 13, 14);
    forTriangle(6, 14, 7);
    forTriangle(7, 14, 15);
    forTriangle(8, 16, 9);
    forTriangle(9, 16, 17);
    forTriangle(9, 17, 10);
    forTriangle(10, 17, 18);
    forTriangle(10, 18, 11);
    forTriangle(11, 18, 19);
    forTriangle(12, 19, 20);
    forTriangle(12, 20, 13);
    forTriangle(14, 21, 15);
    forTriangle(15, 21, 22);
    forTriangle(15, 22, 16);
    forTriangle(16, 22, 17);
    forTriangle(18, 23, 19);
    forTriangle(19, 23, 20);
    forTriangle(20, 23, 21);
    forTriangle(21, 23, 22);

    //connecting quads 
    forQuads(0, 5, 6, 1);
    forQuads(2, 9, 10, 3);
    forQuads(4, 11, 19, 12);
    forQuads(7, 15, 16, 8);
    forQuads(13, 20, 21, 14);
    forQuads(17, 22, 23, 18);

}


function resizeCanvasToDisplaySize(canvas) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
}


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    resizeCanvasToDisplaySize(canvas);
    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    this.makeitShine();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    this.getfromBuffers();
    this.getfromGraphics();
    this.getFromHTML();
    render();
}

var render = function () {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    handlingRotations();
    projectionMatrix = perspective(fovy, aspect, near, far);

    gl.uniform3fv(eyeloc, eye);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(RotMatrixforDirectionalLightLoc, false, flatten(RotMatrixforDirectionalLight));
    gl.uniformMatrix4fv(RotMatrixforSpotlightLoc, false, flatten(RotMatrixforSpotlight));

    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
    requestAnimationFrame(render);
}

var getfromBuffers = function () {

    /* BUFFER FOR COLORS */
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    /* BUFFER FOR NORMALS */
    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var normalLoc = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);

    /* BUFFER FOR POINTS */
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

    /* BUFFER FOR TEXTURES */
    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);

    var image = document.getElementById("texImage");
    configureTexture(image);
}

var getfromGraphics = function () {
    var AmbientProductforDirectionalLight = mult(AmbientforDirectionalLight, AmbientforMaterial);
    var DiffuseProductforDirectionalLight = mult(DiffuseforDirectionalLight, DiffuseforMaterial);
    var SpecularProductforDirectionalLight = mult(SpecularforDirectionalLight, SpecularforMaterial);

    var AmbientProductforSpotlight = mult(AmbientforSpotlight, AmbientforMaterial);
    var DiffuseProductforSpotlight = mult(DiffuseforSpotlight, DiffuseforMaterial);
    var SpecularProductforSpotlight = mult(SpecularforSpotlight, SpecularforMaterial);

    var AmbientProductforGlobal = mult(globalLightAmbient, AmbientforMaterial);

    var DirectionalLightCi = add(AmbientProductforGlobal, AmbientProductforDirectionalLight);
    var DirectionalLightCs = DirectionalLightCi;
    DirectionalLightCi = add(DirectionalLightCi, DiffuseProductforDirectionalLight);

    var SpotLightCi = add(AmbientProductforGlobal, AmbientProductforSpotlight);
    var SpotLightCs = SpotLightCi;
    SpotLightCi = add(SpotLightCi, DiffuseProductforSpotlight);

    /* GETTING VALUES FROM HTML FILE  */
    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");
    RotMatrixforDirectionalLightLoc = gl.getUniformLocation(program, "uRotationMatrix");
    RotMatrixforSpotlightLoc = gl.getUniformLocation(program, "uRotMatrixforSpotlight");

    gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProductforGlobal"), AmbientProductforGlobal);

    gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProductforDirectionalLight"), AmbientProductforDirectionalLight);
    gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProductforDirectionalLight"), DiffuseProductforDirectionalLight);
    gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProductforDirectionalLight"), SpecularProductforDirectionalLight);

    gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProductforSpotlight"), AmbientProductforSpotlight);
    gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProductforSpotlight"), DiffuseProductforSpotlight);
    gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProductforSpotlight"), SpecularProductforSpotlight);

    gl.uniform1f(gl.getUniformLocation(program, "LightCutOff"), LightCutOff);

    gl.uniform4fv(gl.getUniformLocation(program, "uPositionforSpotlight"), PositionforSpotlight);
    gl.uniform4fv(gl.getUniformLocation(program, "uPositionforDirectionalLight"), PositionforDirectionalLight);
    gl.uniform1f(gl.getUniformLocation(program, "uShininess"), materialShininess);

}
var getFromHTML = function () {

    // Buttons and Sliders for viewing object
    document.getElementById("incNear").onclick = function (event) {
        near += 0.4;
        console.log(near);
    };

    document.getElementById("decNear").onclick = function (event) {
        near -= 0.4;
        console.log(near);
    };

    document.getElementById("incFar").onclick = function (event) {
        far += 0.4;
        console.log(far);
    };

    document.getElementById("decFar").onclick = function (event) {
        far -= .4;
        console.log(far);
    };

    document.getElementById("incRad").oninput = function (event) {
        radius = event.target.value;
    };

    document.getElementById("incTheta").oninput = function (event) {
        theta = event.target.value * Math.PI / 180.0;
    };

    document.getElementById("incPhi").oninput = function (event) {
        phi = event.target.value * Math.PI / 180.0;
    };

    document.getElementById("incFOV").oninput = function (event) {
        fovy = event.target.value;
    };

    // Directional Light Rotation in X, Y, Z axis
    document.getElementById("DirLightX").oninput = function (event) {
        XrotforDirLight = event.target.value;
    };
    document.getElementById("DirLightY").oninput = function (event) {
        YrotforDirLight = event.target.value;
    };
    document.getElementById("DirLightZ").oninput = function (event) {
        ZrotforDirLight = event.target.value;
    };

    //Spotlight Rotation in X, Y axis and setting the size of it 
    document.getElementById("SpotlightX").oninput = function (event) {
        XrotforSpotlight = event.target.value;
    };
    document.getElementById("SpotlightY").oninput = function (event) {
        YrotforSpotlight = event.target.value;
    };
    document.getElementById("limit").oninput = function (event) {
        gl.uniform1f(gl.getUniformLocation(program, "LightCutOff"),
            Math.cos((event.target.value * .3) * Math.PI / 180.0));
    };

    // Our object's Rotation in X, Y, Z axis
    document.getElementById("rotateObjectinXrot").onclick = function () {
        axis = xAxis;
    };
    document.getElementById("rotateObjectinYrot").onclick = function () {
        axis = yAxis;
    };
    document.getElementById("rotateObjectinZrot").onclick = function () {
        axis = zAxis;
    };
    document.getElementById("RotateFlag").onchange = function () {
        RotationFlag = !RotationFlag;
        gl.uniform1f(gl.getUniformLocation(program, "uRotationFlag"), RotationFlag);
    };

    // Flags for enabling and disabling cartoon shading and Texture 
    document.getElementById("CartoonToggleFlag").onchange = function () {
        CartoonShaderFlag = !CartoonShaderFlag;
        gl.uniform1f(gl.getUniformLocation(program, "uCartoonToogleFlag"), CartoonShaderFlag);
    };
    document.getElementById("TextureToogleFlag").onchange = function () {
        TextureFlag = !TextureFlag;
        gl.uniform1f(gl.getUniformLocation(program, "uTextureFlag"), TextureFlag);
    };

}

var handlingRotations = function () {
    // Directional Light Rotations using matrices
    thetaforDirLight[xAxis] = XrotforDirLight;
    thetaforDirLight[yAxis] = YrotforDirLight;
    thetaforDirLight[zAxis] = ZrotforDirLight;
    RotMatrixforDirectionalLight = mat4();
    RotMatrixforDirectionalLight = mult(RotMatrixforDirectionalLight, rotate(thetaforDirLight[xAxis], vec3(1, 0, 0)));
    RotMatrixforDirectionalLight = mult(RotMatrixforDirectionalLight, rotate(thetaforDirLight[yAxis], vec3(0, 1, 0)));
    RotMatrixforDirectionalLight = mult(RotMatrixforDirectionalLight, rotate(thetaforDirLight[zAxis], vec3(0, 0, 1)));

    // Spotlight Rotations using matrices  
    thetaforSpotlight[xAxis] = XrotforSpotlight;
    thetaforSpotlight[yAxis] = YrotforSpotlight;
    RotMatrixforSpotlight = mat4();
    RotMatrixforSpotlight = mult(RotMatrixforSpotlight, rotate(thetaforSpotlight[xAxis], vec3(1, 0, 0)));
    RotMatrixforSpotlight = mult(RotMatrixforSpotlight, rotate(thetaforSpotlight[yAxis], vec3(0, 1, 0)));

    if (RotationFlag) { // if rotate flag is set, rotate the object in different axes 
        thetaforObject[axis] += 1.0;
        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, rotate(thetaforObject[xAxis], vec3(1, 0, 0)));
        modelViewMatrix = mult(modelViewMatrix, rotate(thetaforObject[yAxis], vec3(0, 1, 0)));
        modelViewMatrix = mult(modelViewMatrix, rotate(thetaforObject[zAxis], vec3(0, 0, 1)));
    }

    if (!RotationFlag) { // if not use projections 
        eye = vec3(radius * Math.sin(theta) * Math.cos(phi),
            radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(theta));
        modelViewMatrix = lookAt(eye, at, up);
    }

}