"use strict";

var canvas;
var gl;

var numVertices = 132;

var c;
var program;

var cartoonflag = false;
var rotateflag = false;
var textureflag = false;
var flag = true;
var textcord = true;

var objtheta = [0, 0, 0];
var lighttheta = [0, 0, 0];
var spotlighttheta = [0, 0, 0];

var lightanglex = 0.0;
var lightangley = 0.0;
var lightanglez = 0.0;
var spotlightanglex = 0.0;
var spotlightangley = 0.0;

var near = 5.800000000000001;
//var near = 1.9;
var far = 3.6;

var radius = 4.0;
var theta = 0.0;
var phi = 0.0;
var dr = 5.0 * Math.PI / 180.0;

var pointsArray = [];
var colorsArray = [];
var normalsArray = [];
var texCoordsArray = [];

var fovy = 45.0; 
var aspect = 1.0; 
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;

var modelViewMatrix, projectionMatrix, rotationMatrix, spotrotationMatrix;
var modelViewMatrixLoc, projectionMatrixLoc, rotationMatrixLoc, spotrotationMatrixLoc;
var eyeloc;

var globalLightAmbient = vec4(0.0, 1.0, 0.5, 1.0);

var oneDirLightPosition = vec4(1.0, 1.0, 1.0, 1.0);
var oneDirlightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var oneDirlightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var oneDirlightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var spotLightPosition = vec4(0.0, 0.0, 1.0, 0.0);
var spotLightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var spotLightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var spotLightSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var lCutOff = 20.2;

var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
var materialDiffuse = vec4(0.6, 1.0, 0.6, 1.0);
var materialSpecular = vec4(0.6, 1.0, 0.6, 1.0);
var materialShininess = 100.0;

var texture;

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

// var vertices = [
//     vec4(-0.96936, 0.238651, 0.058198, 1.0),
//     vec4(-0.683128, -0.715413, 0.146701, 1.0),
//     vec4(-0.623092, -0.255511, -0.739236, 1.0),
//     vec4(-0.478567, -0.06233, 0.875836, 1.0),
//     vec4(-0.286232, 0.954064, -0.088503, 1.0),
//     vec4(0.060036, 0.459902, -0.885938, 1.0),
//     vec4(0.204561, 0.653083, 0.729135, 1.0),
//     vec4(0.286232, -0.954064, 0.088503, 1.0),
//     vec4(0.346268, -0.494162, -0.797435, 1.0),
//     vec4(0.490793, -0.300981, 0.817638, 1.0),
//     vec4(0.683128, 0.715413, -0.146701, 1.0),
//     vec4(0.96936, -0.238651, -0.058198, 1.0)
// ]

//new object 
/*
"vertices":[
    [0,0,1.077364],[0.7442063,0,0.7790187],[0.3123013,0.6755079,0.7790187],[-0.482096,0.5669449,0.7790187],
    [-0.7169181,-0.1996786,0.7790187],[-0.1196038,-0.7345325,0.7790187],[0.6246025,-0.7345325,0.4806734],
    [1.056508,-0.1996786,0.06806912],[0.8867128,0.5669449,0.2302762],[0.2621103,1.042774,0.06806912],
    [-0.532287,0.9342111,0.06806912],[-1.006317,0.3082417,0.2302762],[-0.7020817,-0.784071,0.2302762],
    [0.02728827,-1.074865,0.06806912],[0.6667271,-0.784071,-0.3184664],[0.8216855,-0.09111555,-0.6908285],
    [0.6518908,0.6755079,-0.5286215],[-0.1196038,0.8751866,-0.6168117],[-0.8092336,0.4758293,-0.5286215],
    [-0.9914803,-0.2761507,-0.3184664],[-0.4467414,-0.825648,-0.5286215],[0.1926974,-0.5348539,-0.915157],
    [0.1846311,0.2587032,-1.029416],[-0.5049987,-0.1406541,-0.9412258]]
*/

var vertices = [
    vec4(0,0,1.077364, 1.0),
    vec4(0.7442063,0,0.7790187, 1.0),
    vec4(0.3123013,0.6755079,0.7790187, 1.0),
    vec4(-0.482096,0.5669449,0.7790187, 1.0),
    vec4(-0.7169181,-0.1996786,0.7790187, 1.0),
    vec4(-0.1196038,-0.7345325,0.7790187, 1.0),
    vec4(0.6246025,-0.7345325,0.4806734, 1.0),
    vec4(1.056508,-0.1996786,0.06806912, 1.0),
    vec4(0.8867128,0.5669449,0.2302762, 1.0),
    vec4(0.2621103,1.042774,0.06806912, 1.0),
    vec4(-0.532287,0.9342111,0.06806912, 1.0),
    vec4(-1.006317,0.3082417,0.2302762, 1.0),
    vec4(-0.7020817,-0.784071,0.2302762, 1.0),
    vec4(0.02728827,-1.074865,0.06806912, 1.0),
    vec4(0.6667271,-0.784071,-0.3184664, 1.0), 
    vec4(0.8216855,-0.09111555,-0.6908285, 1.0),
    vec4(0.6518908,0.6755079,-0.5286215, 1.0),
    vec4(-0.1196038,0.8751866,-0.6168117, 1.0),
    vec4(-0.8092336,0.4758293,-0.5286215, 1.0),
    vec4(-0.9914803,-0.2761507,-0.3184664, 1.0),
    vec4(-0.4467414,-0.825648,-0.5286215, 1.0),
    vec4(0.1926974,-0.5348539,-0.915157, 1.0),
    vec4(0.1846311,0.2587032,-1.029416, 1.0),
    vec4(-0.5049987,-0.1406541,-0.9412258, 1.0)
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
    vec4( 0.8, 0.2, 0.7, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 1.0, 0.5, 0.0, 1.0 )   // orange
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
    if(textcord) texCoordsArray.push(texCoord[0]);
    else texCoordsArray.push(texCoord[0]);
    //else colorsArray.push(vertexColors[i]);

    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[i]);
    normalsArray.push(normal);
    if(textcord) texCoordsArray.push(texCoord[1]);
    else texCoordsArray.push(texCoord[2]);
    //else colorsArray.push(vertexColors[i]);
    
    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[i]);
    normalsArray.push(normal);
    if(textcord) texCoordsArray.push(texCoord[2]);
    else texCoordsArray.push(texCoord[1]);
    //else colorsArray.push(vertexColors[i]);
    textcord = !textcord;
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
    if(textcord) texCoordsArray.push(texCoord[0]);
    else texCoordsArray.push(texCoord[0]);
    //else colorsArray.push(vertexColors[i]);

    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[i]);
    normalsArray.push(normal);
    if(textcord) texCoordsArray.push(texCoord[1]);
    else texCoordsArray.push(texCoord[2]);
    //else colorsArray.push(vertexColors[i]);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[i]);
    normalsArray.push(normal);
    if(textcord) texCoordsArray.push(texCoord[2]);
    else texCoordsArray.push(texCoord[3]);
    //else colorsArray.push(vertexColors[i]);

    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[i]);
    normalsArray.push(normal);
    if(textcord) texCoordsArray.push(texCoord[0]);
    else texCoordsArray.push(texCoord[2]);
    //else colorsArray.push(vertexColors[i]);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[i]);
    normalsArray.push(normal);
    if(textcord) texCoordsArray.push(texCoord[2]);
    else texCoordsArray.push(texCoord[1]);
    //else colorsArray.push(vertexColors[i]);
    
    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[i]);
    normalsArray.push(normal);
    if(textcord) texCoordsArray.push(texCoord[3]);
    else texCoordsArray.push(texCoord[0]);
    //else colorsArray.push(vertexColors[i]);

}

// function makeitShine() {
//     forTriangle(2, 5, 8);
//     forTriangle(5, 4, 10);
//     forTriangle(8, 11, 7);
//     forTriangle(2, 1, 0);
//     forTriangle(6, 3, 9);
//     forTriangle(3, 0, 1);
//     forTriangle(9, 7, 11);
//     forTriangle(6, 10, 4);

//     forQuads(5, 2, 0, 4);
//     forQuads(8, 5, 10, 11);
//     forQuads(2, 8, 7, 1);
//     forQuads(3, 6, 4, 0);
//     forQuads(9, 3, 1, 7);
//     forQuads(6, 9, 11, 10);
// }

//new colors
/* 
{"faces":[
    [0,1,2],[0,2,3],[0,3,4],[0,4,5],[1,6,7],[1,7,8],[1,8,2],[2,8,9],[3,10,11],[3,11,4],[4,12,5],
    [5,12,13],[5,13,6],[6,13,14],[6,14,7],[7,14,15],[8,16,9],[9,16,17],[9,17,10],[10,17,18],
    [10,18,11],[11,18,19],[12,19,20],[12,20,13],[14,21,15],[15,21,22],[15,22,16],[16,22,17],
    [18,23,19],[19,23,20],[20,23,21],[21,23,22],[0,5,6,1],[2,9,10,3],[4,11,19,12],[7,15,16,8],
    [13,20,21,14],[17,22,23,18]],

*/
function makeitShine() {
    forTriangle(0,1,2);
    forTriangle(0,2,3);
    forTriangle(0,3,4);
    forTriangle(0,4,5);
    forTriangle(1,6,7);
    forTriangle(1,7,8);
    forTriangle(1,8,2);
    forTriangle(2,8,9);
    forTriangle(3,10,11);
    forTriangle(3,11,4);
    forTriangle(4,12,5);
    forTriangle(5,12,13);
    forTriangle(5,13,6);
    forTriangle(6,13,14);
    forTriangle(6,14,7);
    forTriangle(7,14,15);
    forTriangle(8,16,9);
    forTriangle(9,16,17);
    forTriangle(9,17,10);
    forTriangle(10,17,18);
    forTriangle(10,18,11);
    forTriangle(11,18,19);
    forTriangle(12,19,20);
    forTriangle(12,20,13);
    forTriangle(14,21,15);
    forTriangle(15,21,22);
    forTriangle(15,22,16);
    forTriangle(16,22,17);
    forTriangle(18,23,19);
    forTriangle(19,23,20);
    forTriangle(20,23,21);
    forTriangle(21,23,22);

    forQuads(0,5,6,1);
    forQuads(2,9,10,3);
    forQuads(4,11,19,12);
    forQuads(7,15,16,8);
    forQuads(13,20,21,14);
    forQuads(17,22,23,18);

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
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(rotationMatrix));
    gl.uniformMatrix4fv(spotrotationMatrixLoc, false, flatten(spotrotationMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
    requestAnimationFrame(render);
}

var getfromBuffers = function () {

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    
    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var normalLoc = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);

    var image = document.getElementById("texImage");
    configureTexture(image);
}

var getfromGraphics = function () {
    var OneDirAmbientProduct = mult(oneDirlightAmbient, materialAmbient);
    var OneDirDiffuseProduct = mult(oneDirlightDiffuse, materialDiffuse);
    var OneDirSpecularProduct = mult(oneDirlightSpecular, materialSpecular);

    var spotAmbientProduct = mult(spotLightAmbient, materialAmbient);
    var spotDiffuseProduct = mult(spotLightDiffuse, materialDiffuse);
    var spotSpecularProduct = mult(spotLightSpecular, materialSpecular);

    var globalAmbientProduct = mult(globalLightAmbient, materialAmbient);

    var OneDirCi = add(globalAmbientProduct, OneDirAmbientProduct);
    var OneDirCs = OneDirCi;
    OneDirCi = add(OneDirCi, OneDirDiffuseProduct);

    var SpotCi = add(globalAmbientProduct, spotAmbientProduct);
    var SpotCs = SpotCi;
    SpotCi = add(SpotCi, spotDiffuseProduct);
    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");
    rotationMatrixLoc = gl.getUniformLocation(program, "uRotationMatrix");
    spotrotationMatrixLoc = gl.getUniformLocation(program, "uSpotRotationMatrix");

    gl.uniform4fv(gl.getUniformLocation(program, "uglobalAmbientProduct"), globalAmbientProduct);

    gl.uniform4fv(gl.getUniformLocation(program, "uOneDirAmbientProduct"), OneDirAmbientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uOneDirDiffuseProduct"), OneDirDiffuseProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uOneDirSpecularProduct"), OneDirSpecularProduct);

    gl.uniform4fv(gl.getUniformLocation(program, "uSpotAmbientProduct"), spotAmbientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uSpotDiffuseProduct"), spotDiffuseProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uSpotSpecularProduct"), spotSpecularProduct);

    gl.uniform1f(gl.getUniformLocation(program, "lCutOff"), lCutOff);

    gl.uniform4fv(gl.getUniformLocation(program, "uspotLightPosition"), spotLightPosition);
    gl.uniform4fv(gl.getUniformLocation(program, "uoneDirLightPosition"), oneDirLightPosition);

    gl.uniform4fv(gl.getUniformLocation(program, "uOneDirCi"), OneDirCi);
    gl.uniform4fv(gl.getUniformLocation(program, "uOneDirCs"), OneDirCs);
    gl.uniform4fv(gl.getUniformLocation(program, "uSpotCi"), SpotCi);
    gl.uniform4fv(gl.getUniformLocation(program, "uSpotCs"), SpotCs);

    gl.uniform1f(gl.getUniformLocation(program, "uShininess"), materialShininess);

}
var getFromHTML = function () {
    //One direction Light rotation
    document.getElementById("lightx").oninput = function (event) {
        lightanglex = event.target.value;
    };
    document.getElementById("lighty").oninput = function (event) {
        lightangley = event.target.value;
    };
    document.getElementById("lightz").oninput = function (event) {
        lightanglez = event.target.value;
    };

    //Spotlight rotation
    document.getElementById("spotlightx").oninput = function (event) {
        spotlightanglex = event.target.value;
    };
    document.getElementById("spotlighty").oninput = function (event) {
        spotlightangley = event.target.value;
    };
    document.getElementById("limit").oninput = function (event) {
        gl.uniform1f(gl.getUniformLocation(program, "lCutOff"),
            Math.cos((event.target.value * .3) * Math.PI / 180.0));
    };

    //Object Rotation
    document.getElementById("xObjButton").onclick = function () {
        axis = xAxis;
    };
    document.getElementById("yObjButton").onclick = function () {
        axis = yAxis;
    };
    document.getElementById("zObjButton").onclick = function () {
        axis = zAxis;
    };
    document.getElementById("rotateobj").onchange = function () {
        rotateflag = !rotateflag;
        gl.uniform1f(gl.getUniformLocation(program, "uRflag"), rotateflag);
    };

    // Flags for enabling and disabling cartoon shading and Texture 
    document.getElementById("cartoontoggle").onchange = function () {
        cartoonflag = !cartoonflag;
        gl.uniform1f(gl.getUniformLocation(program, "ucartoonflag"), cartoonflag);
    };
    document.getElementById("texturetoggle").onchange = function () {
        textureflag = !textureflag;
        gl.uniform1f(gl.getUniformLocation(program, "utextureflag"), textureflag);
    };

    // sliders for viewing parameters
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
        radius  = event.target.value;
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

}

var handlingRotations = function () {
    // One Direction Light Rotation 
    lighttheta[xAxis] = lightanglex;
    lighttheta[yAxis] = lightangley;
    lighttheta[zAxis] = lightanglez;
    rotationMatrix = mat4();
    rotationMatrix = mult(rotationMatrix, rotate(lighttheta[xAxis], vec3(1, 0, 0)));
    rotationMatrix = mult(rotationMatrix, rotate(lighttheta[yAxis], vec3(0, 1, 0)));
    rotationMatrix = mult(rotationMatrix, rotate(lighttheta[zAxis], vec3(0, 0, 1)));

    // Spotilight Rotation 
    spotlighttheta[xAxis] = spotlightanglex;
    spotlighttheta[yAxis] = spotlightangley;
    spotrotationMatrix = mat4();
    spotrotationMatrix = mult(spotrotationMatrix, rotate(spotlighttheta[xAxis], vec3(1, 0, 0)));
    spotrotationMatrix = mult(spotrotationMatrix, rotate(spotlighttheta[yAxis], vec3(0, 1, 0)));

    if (rotateflag) {
        objtheta[axis] += 1.0;
        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, rotate(objtheta[xAxis], vec3(1, 0, 0)));
        modelViewMatrix = mult(modelViewMatrix, rotate(objtheta[yAxis], vec3(0, 1, 0)));
        modelViewMatrix = mult(modelViewMatrix, rotate(objtheta[zAxis], vec3(0, 0, 1)));
    }

    if (!rotateflag) {
        eye = vec3(radius * Math.sin(theta) * Math.cos(phi),
            radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(theta));
        modelViewMatrix = lookAt(eye, at, up);
    }

}