"use strict";

var canvas;
var gl;
var program;


/******** VIEWS ********/
//use them to be able to change the view of the camera 
var projectionMatrix;
var modelViewMatrix;
var instanceMatrix;
var modelViewMatrixLoc;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);
var alpha = -7.09;
var beta = 0.2;
var radius = 1.0
/******** END OF VIEWS ********/

/******** BOOLEANS ********/
var useAnimation = true;
var IsWalking = false;
/******** END OF BOOLEANS ********/

var vertices = [

    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)
];

/***** TORSO *****/
var torsoId = 0;
var torsoRotation = 90.0;
/***** HEAD *****/
var headId = 1;
var head1Id = 1;
var head2Id = 10;
var headUpperId = 12;
var ear1Id = 15;
var ear2Id = 18;


/***** LEGS *****/
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;

/***** TAIL *****/
var tailId = 11;

/***** GROUND *****/
var baseId = 13;

/***** TREE *****/
var TreeObjectId = 14;
var UpperTreeObjectId = 17;


/***** SIZE OF BEAR ELEMENTS *****/
//add sizing element?
/***** SIZE OF TAIL *****/
var tailWidth = 0.25;
var tailHeight = .4;

/***** SIZE OF TORSO *****/
var torsoHeight = 3.5;
var torsoWidth = 1;

/***** SIZE OF ARM/LEG *****/
var upperArmHeight = 1.0;
var lowerArmHeight = 1.0;
var upperArmWidth = 0.25;
var lowerArmWidth = 0.25;
var upperLegWidth = 0.25;
var lowerLegWidth = 0.25;
var lowerLegHeight = 1.0;
var upperLegHeight = 1.0;

/***** SIZE OF HEAD *****/
var headHeight = 0.7;
var headWidth = 0.5;
var upperHeadHeight = 1.1;
var upperHeadWidth = 0.7;
var ear1Height = 1.1;
var ear1Width = 0.7;
var ear2Height = 1.1;
var ear2Width = 0.7;


/***** SIZE OF TREE *****/
var TreeObjectHeight = 0.3;
var TreeObjectWidth = 2;

/***** SIZE OF GROUND *****/
var groundWidth = 10;

var numNodes = 20;
var c;

//legs
var leftLowerLegFlag = false;
var leftUpperLegFlag = false;

var rightLowerLegFlag = false;
var rightUpperLegFlag = false;

//arms
var leftLowerArmFlag = false;
var leftUpperArmFlag = false;

var rightLowerArmFlag = false;
var rightUpperArmFlag = false;
var cameraSize = 20;
var moveinXaxis = -cameraSize;
var moveinYaxis = 0.0;
var theta = [90, 90, 90, 0, 90, 0, 110, 0, 90, 0, 0, 160, 105, 0, 0, 15, 345, 90, 90, 90];

var numVertices = 24;

var stack = [];

var figure = [];

for (var i = 0; i < numNodes; i++) figure[i] = createNode(null, null, null, null);

var textureBody;
var textureHead;

var texCoordsArray = [];
var pointsArray = [];


function configureTexture(image) {
    textureBody = gl.createTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textureBody);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
        gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "uTextureMapTorso"), 0);


    textureHead = gl.createTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, textureBody);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
        gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "uTextureMapHead"), 0);
}
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];


function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}


function createNode(transform, render, sibling, child) {
    var node = {
        transform: transform,
        render: render,
        sibling: sibling,
        child: child,
    }
    return node;
}

function initNodes(Id) {

    var m = mat4();

    switch (Id) {
        case torsoId:
            m = translate(moveinXaxis, 5 + moveinYaxis, 0);
            m = mult(m, rotate(theta[torsoId], 0, 1, 0));
            m = mult(m, rotate(torsoRotation, 1, 0, 0))
            figure[torsoId] = createNode(m, torso, baseId, headId);
            break;

        case headId:
        case head1Id:
        case head2Id:
            m = translate(0.0, torsoHeight * 0.8 + headHeight * 0.82, -headWidth * 0.55);
            m = mult(m, rotate(theta[head1Id], 1, 0, 0))
            m = mult(m, rotate(theta[head2Id], 0, 1, 0));
            m = mult(m, translate(0.0, -0.5 * headHeight, 0.0));
            figure[headId] = createNode(m, head, tailId, headUpperId);
            break;
        case headUpperId:
            m = translate(0.0, -torsoHeight + upperHeadHeight * 2.6, upperHeadWidth * 0.5);
            m = mult(m, rotate(theta[headUpperId], 1, 0, 0))
            m = mult(m, rotate(theta[head2Id], 0, 1, 0));
            m = mult(m, translate(0.0, -0.5 * upperHeadHeight, 0.0));
            figure[headUpperId] = createNode(m, headUpper, null, ear1Id);
            break;

        case ear1Id:
            m = translate(0.0, -torsoHeight + upperHeadHeight * 2, upperHeadWidth * 0.5);
            m = mult(m, rotate(theta[ear1Id], 1, 0, 0))
            m = mult(m, rotate(theta[ear1Id], 0, 1, 0));
            m = mult(m, translate(0.0, -0.5 * upperHeadHeight, 0.0));
            figure[ear1Id] = createNode(m, ears1, null, ear2Id);
            break;
        
        case ear2Id:
            m = translate(0.0, -torsoHeight + upperHeadHeight * 2, upperHeadWidth * 0.5);
            m = mult(m, rotate(theta[ear2Id], 1, 0, 0))
            m = mult(m, rotate(theta[ear2Id], 3, 1, 0));
            m = mult(m, translate(0.0, -0.7 * upperHeadHeight, 1.0));
            figure[ear2Id] = createNode(m, ears2, null, null);
            break;

        case tailId:
            m = translate(-(torsoWidth * 0.5 - tailWidth * 2), 2.6 * tailHeight - torsoWidth, -torsoHeight * 0.1);
            m = mult(m, rotate(theta[tailId], 1, 0, 0));
            figure[tailId] = createNode(m, tail, leftUpperArmId, null);
            break;

        case leftUpperArmId:

            m = translate((torsoWidth + upperArmWidth) * 0.5, 0.8 * torsoHeight, 0.0);
            m = mult(m, rotate(theta[leftUpperArmId], 1, 0, 0));
            figure[leftUpperArmId] = createNode(m, leftUpperArm, rightUpperArmId, leftLowerArmId);
            break;

        case rightUpperArmId:

            m = translate(-(torsoWidth + upperArmWidth) * 0.5, 0.8 * torsoHeight, 0.0);
            m = mult(m, rotate(theta[rightUpperArmId], 1, 0, 0));
            figure[rightUpperArmId] = createNode(m, rightUpperArm, leftUpperLegId, rightLowerArmId);
            break;

        case leftUpperLegId:

            m = translate((torsoWidth + upperLegWidth) * 0.5, 0.1 * torsoHeight, 0.0);
            m = mult(m, rotate(theta[leftUpperLegId], 1, 0, 0));
            figure[leftUpperLegId] = createNode(m, leftUpperLeg, rightUpperLegId, leftLowerLegId);
            break;

        case rightUpperLegId:

            m = translate(-(torsoWidth + upperLegWidth) * 0.5, 0.1 * torsoHeight, 0.0);
            m = mult(m, rotate(theta[rightUpperLegId], 1, 0, 0));
            figure[rightUpperLegId] = createNode(m, rightUpperLeg, null, rightLowerLegId);
            break;

        case leftLowerArmId:

            m = translate(0.0, upperArmHeight, 0.0);
            m = mult(m, rotate(theta[leftLowerArmId], 1, 0, 0));
            figure[leftLowerArmId] = createNode(m, leftLowerArm, null, null);
            break;

        case rightLowerArmId:

            m = translate(0.0, upperArmHeight, 0.0);
            m = mult(m, rotate(theta[rightLowerArmId], 1, 0, 0));
            figure[rightLowerArmId] = createNode(m, rightLowerArm, null, null);
            break;

        case leftLowerLegId:

            m = translate(0.0, upperLegHeight, 0.0);
            m = mult(m, rotate(theta[leftLowerLegId], 1, 0, 0));
            figure[leftLowerLegId] = createNode(m, leftLowerLeg, null, null);
            break;

        case rightLowerLegId:

            m = translate(0.0, upperLegHeight, 0.0);
            m = mult(m, rotate(theta[rightLowerLegId], 1, 0, 0));
            figure[rightLowerLegId] = createNode(m, rightLowerLeg, null, null);
            break;
        case baseId:
            m = translate(1, -2.15, 2);
            m = mult(m, rotate(theta[baseId], 1, 0, 0));
            figure[baseId] = createNode(m, baseGround, TreeObjectId, null);
            break;
        case TreeObjectId:
            m = translate(10.0, TreeObjectHeight + 7, 0.0);
            m = mult(m, rotate(theta[TreeObjectId], 1, 0, 0));
            figure[TreeObjectId] = createNode(m, TreeBody, null, UpperTreeObjectId);
            break;
        case UpperTreeObjectId:
            m = translate(0.0, TreeObjectHeight * 15, TreeObjectWidth * 0.45);
            m = mult(m, rotate(theta[UpperTreeObjectId], 1, 0, 0));
            figure[UpperTreeObjectId] = createNode(m, TreeHead, null, null);
            break;

    }

}

function traverse(Id) {
    if (Id == null) return;
    stack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
    figure[Id].render();
    if (figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
    if (figure[Id].sibling != null) traverse(figure[Id].sibling);
}



function tail() {
    var image = document.getElementById("textures");
    configureTexture(image);
    gl.uniform1i(gl.getUniformLocation(program, "TorsoFlag"), true);
    gl.uniform1i(gl.getUniformLocation(program, "HeadFlag"), false);
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.2 * tailHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(tailWidth * 0.3, tailHeight * 0.9, tailWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function torso() {
    var image = document.getElementById("textures");
    configureTexture(image);
    gl.uniform1i(gl.getUniformLocation(program, "TorsoFlag"), true);
    gl.uniform1i(gl.getUniformLocation(program, "HeadFlag"), false);
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * torsoHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(torsoWidth * 1.4, torsoHeight, torsoWidth * 1.6));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) {
        gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);

    }
}

function headUpper() {

    gl.uniform1i(gl.getUniformLocation(program, "TorsoFlag"), false);
    gl.uniform1i(gl.getUniformLocation(program, "HeadFlag"), true);
    instanceMatrix = mult(modelViewMatrix, translate(0, 0.5 * (upperHeadHeight - torsoWidth), 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(upperHeadWidth * 1, upperHeadHeight * 1.2, upperHeadWidth * 2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);

    var imageHead = document.getElementById("headTexture");
    configureTexture(imageHead);
}

function ears1() {

    gl.uniform1i(gl.getUniformLocation(program, "TorsoFlag"), false);
    gl.uniform1i(gl.getUniformLocation(program, "HeadFlag"), true);
    instanceMatrix = mult(modelViewMatrix, translate(0, 2.2, -0.8));
    instanceMatrix = mult(instanceMatrix, scale4(ear1Width * 0.3, ear1Height * 0.1, ear1Height * 0.4));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);

    var imageHead = document.getElementById("headTexture");
    configureTexture(imageHead);
}

function ears2() {

    gl.uniform1i(gl.getUniformLocation(program, "TorsoFlag"), false);
    gl.uniform1i(gl.getUniformLocation(program, "HeadFlag"), true);
    instanceMatrix = mult(modelViewMatrix, translate(1.3, -2.9, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(ear2Width * 0.3, ear2Height * 0.1, ear2Height * 0.4));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);

    var imageHead = document.getElementById("headTexture");
    configureTexture(imageHead);
}


function head() {

    gl.uniform1i(gl.getUniformLocation(program, "TorsoFlag"), false);
    gl.uniform1i(gl.getUniformLocation(program, "HeadFlag"), true);
    instanceMatrix = mult(modelViewMatrix, translate(0, 0.5 * (headHeight - torsoWidth), 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);

    var imageHead = document.getElementById("headTexture");
    configureTexture(imageHead);
}

function leftUpperArm() {
    gl.uniform1i(gl.getUniformLocation(program, "TorsoFlag"), true);
    instanceMatrix = mult(modelViewMatrix, translate(0, 0.5 * upperArmHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);

}

function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);

}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);

}

function rightLowerArm() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);

}

function leftUpperLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);

}

function leftLowerLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);

}

function rightUpperLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);

}

function rightLowerLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth))
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);

}

function baseGround() {
    gl.uniform1i(gl.getUniformLocation(program, "FloorFlag"), true);
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * groundWidth, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(groundWidth + 25, 0.5, groundWidth))
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(gl.getUniformLocation(program, "FloorFlag"), false);

}

function TreeBody() {
    gl.uniform1i(gl.getUniformLocation(program, "TreeFlag"), true);
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.4 * TreeObjectHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(TreeObjectWidth * 0.2, TreeObjectHeight * 35, TreeObjectWidth * 0.4))
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(gl.getUniformLocation(program, "TreeFlag"), false);

}

function TreeHead() {

    gl.uniform1i(gl.getUniformLocation(program, "TreeHeadFlag"), true);
    instanceMatrix = mult(modelViewMatrix, translate(-0.5, 0.9 * TreeObjectHeight, 0.9));
    instanceMatrix = mult(instanceMatrix, scale4(TreeObjectWidth * 3, TreeObjectHeight * 10, TreeObjectWidth * 2))
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
    gl.uniform1i(gl.getUniformLocation(program, "TreeHeadFlag"), false);
}

function quad(a, b, c, d) {
    pointsArray.push(vertices[a]);
    texCoordsArray.push(texCoord[0])
    pointsArray.push(vertices[b]);
    texCoordsArray.push(texCoord[1])
    pointsArray.push(vertices[c]);
    texCoordsArray.push(texCoord[2])
    pointsArray.push(vertices[d]);
    texCoordsArray.push(texCoord[3])
}


function cube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}


window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) {
        alert("WebGL 2.0 isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-cameraSize, cameraSize, -cameraSize, cameraSize, -cameraSize, cameraSize);
    modelViewMatrix = mat4();


    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    cube();
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

    document.getElementById("increaseAlpha").onclick = function (event) {
        alpha += 0.1;
    };
    document.getElementById("decreaseAlpha").onclick = function (event) {
        alpha -= 0.1;
    };

    document.getElementById("animate").onclick = function () {
        useAnimation = !useAnimation;
        var elem = document.getElementById("animate");
        if (useAnimation) {
            elem.innerHTML = "Disable animation";
        } else {
            elem.innerHTML = "Enable animation";
        }
    }
    for (i = 0; i < numNodes; i++) initNodes(i);
    render();
}
var flagRotation = 0;

function animate() {
    if (flagRotation == 0) {
        if (theta[leftLowerLegId] < 0) {
            leftLowerLegFlag = false;
        } else if (theta[leftLowerLegId] >= 60) {
            leftLowerLegFlag = true;
        }

        //moving left lower leg 
        if ((IsWalking && moveinXaxis > -6.3) && theta[leftLowerLegId] <= 80) {
            theta[leftLowerLegId] += 2.8;
        } else if (moveinXaxis > 2 && theta[leftLowerLegId] > 80) {
            theta[leftLowerLegId] -= 0.7;
        }

        if (leftLowerLegFlag && !((IsWalking && moveinXaxis > -6.3))) {
            theta[leftLowerLegId] -= 0.6;
        }

        if (theta[leftUpperLegId] < 65) {
            leftUpperLegFlag = false;
        } else if (theta[leftUpperLegId] >= 95) {
            leftUpperLegFlag = true;
        }

        if (leftUpperLegFlag) {
            theta[leftUpperLegId] -= 0.4;
        } else {
            theta[leftUpperLegId] += 0.4;
        }

        //moving right leg
        if (theta[rightLowerLegId] < -10) {
            rightLowerLegFlag = false;
        } else if (theta[rightLowerLegId] >= 70) {
            rightLowerLegFlag = true;
        }
        if ((IsWalking && moveinXaxis > -6.3) && theta[rightLowerLegId] <= 90) {
            theta[rightLowerLegId] += 2.8;
        } else if (moveinXaxis > 2 && theta[rightLowerLegId] > 70) {
            theta[rightLowerLegId] -= 0.7;
        }

        if (!(IsWalking) && rightLowerLegFlag) {
            theta[rightLowerLegId] -= 0.6;
        } else if (!(IsWalking)) {
            theta[rightLowerLegId] += 0.6;
        }

        if (theta[rightUpperLegId] < 70) {
            rightUpperLegFlag = false;
        } else if (theta[rightUpperLegId] >= 110) {
            rightUpperLegFlag = true;
        }

        if (rightUpperLegFlag) {
            theta[rightUpperLegId] -= 0.5;
        } else {
            theta[rightUpperLegId] += 0.5;
        }

        //left front leg
        if (theta[leftLowerArmId] < -30) {
            leftLowerArmFlag = true;
        } else if (theta[leftLowerArmId] >= 40) {
            leftLowerArmFlag = false;
        }

        if ((IsWalking) && theta[leftLowerArmId] <= 90) {
            theta[leftLowerArmId] += 1.1;
        } else if (theta[leftLowerArmId] > 70) {
            theta[leftLowerArmId] -= 0.7;
        }

        if (leftLowerArmFlag) {
            theta[leftLowerArmId] += 0.6;
        } else if (!(IsWalking)) {
            theta[leftLowerArmId] -= 0.6;
        }
        if (theta[leftUpperArmId] < 60) {
            leftUpperArmFlag = false;
        } else if (theta[leftUpperArmId] >= 110) {
            leftUpperArmFlag = true;
        }

        if (leftUpperArmFlag) {
            theta[leftUpperArmId] -= 0.5;
        } else {
            theta[leftUpperArmId] += 0.5;
        }


        //right front leg
        if (theta[rightLowerArmId] < -40) {
            rightLowerArmFlag = true;
        } else if (theta[rightLowerArmId] >= 35) {
            rightLowerArmFlag = false;
        }

        if ((IsWalking) && theta[rightLowerArmId] <= 90) {
            theta[rightLowerArmId] += 1.3;
        } else if (theta[rightLowerArmId] > 70) {
            theta[rightLowerArmId] -= 0.7;
        }

        if (rightLowerArmFlag) {
            theta[rightLowerArmId] += 0.8;
        } else if (!(IsWalking)) {
            theta[rightLowerArmId] -= 0.8;
        }
        if (theta[rightUpperArmId] < 65) {
            rightUpperArmFlag = false;
        } else if (theta[rightUpperArmId] >= 95) {
            rightUpperArmFlag = true;
        }

        if (rightUpperArmFlag) {
            theta[rightUpperArmId] -= 0.2;
        } else {
            theta[rightUpperArmId] += 0.2;
        }
    } else {
        flagRotation = 1;
    }

}

var flagRot = 0;
var flagAngle = 0

function rotateBear() {
    if (flagRot == 0) {
        if (theta[rightLowerLegId] > 0 && flagAngle == 0) {
            theta[rightLowerLegId] -= 1;

        } else {
            theta[rightLowerLegId] = 0;
            flagAngle = 1;
            flagRot = 0;
        }

        if (theta[rightUpperLegId] > 90 && flagAngle == 1) {
            theta[rightUpperLegId] -= 1;
        } else {
            theta[rightUpperLegId] = 90;
            flagAngle = 2;
            flagRot = 0;

        }

        if (theta[leftLowerLegId] > 0 && flagAngle == 2) {
            theta[leftLowerLegId] -= 1;
        } else {

            theta[leftLowerLegId] = 0;
            flagAngle = 3;
            flagRot = 0;

        }

        if (theta[leftUpperLegId] > 90 && flagAngle == 3) {
            theta[leftUpperLegId] -= 1;
        } else {
            theta[leftUpperLegId] = 90;
            flagAngle = 4;
            flagRot = 0;

        }



        if (theta[rightLowerArmId] > 0 && flagAngle == 4) {
            theta[rightLowerArmId] -= 1;
        } else {
            theta[rightLowerArmId] = 0;
            flagAngle = 5;
            flagRot = 0;

        }

        if (theta[rightUpperArmId] > 90 && flagAngle == 5) {
            theta[rightUpperArmId] -= 1;

        } else {
            theta[rightUpperArmId] = 90;
            flagAngle = 6;
            flagRot = 0;

        }

        if (theta[leftLowerArmId] < 0 && flagAngle == 6) {
            theta[leftLowerArmId] += 1;

        } else {

            theta[leftLowerArmId] = 0;
            flagAngle = 7;
            flagRot = 0;

        }

        if (theta[leftUpperArmId] > 90 && flagAngle == 7) {
            theta[leftUpperArmId] -= 1;

        } else {
            theta[leftUpperArmId] = 90;
            flagRot = 1;
        }
    } else {

        if (torsoRotation != 0) {
            torsoRotation -= 1;
            theta[leftUpperLegId] += 1;
            theta[rightUpperLegId] += 1;
            theta[rightLowerLegId] = 0;
            moveinXaxis = moveinXaxis + 0.05 * Math.sin(torsoRotation * Math.PI / 180);

        }


    }
}

function rotateinOnePosition() {
    theta[torsoId] -= 0.6;
    console.log("theta id is: ",theta[torsoId]);

    if(theta[torsoId] < -89) {
        theta[torsoId] = -89;
    }
}
var standPosition;
var flagUp = false;
var flagDown = false;

var render = function () {
    if (useAnimation) {
        if (moveinXaxis <= 4.5 && flagRotation == 0) {
            animate();
            moveinXaxis += 0.15;
            standPosition = moveinXaxis;
        } else if (moveinXaxis > 4.5) {
            rotateBear();
            setTimeout(function() {
                flagRotation = 1;
            }, 2000);


        }

        if(flagRotation) {
            rotateinOnePosition();
            setTimeout(function() {
                flagUp = 1;
            }, 2000);

        }

        if(flagUp) {
            //torsoRotation -= 0.4;
            moveinYaxis -= 0.004;
            theta[leftUpperLegId] -= 0.2;
            theta[leftLowerLegId] += 0.2;

            theta[rightUpperLegId] -= 0.2;
            theta[rightLowerLegId] += 0.2;

            //also move hands
            theta[rightLowerArmId] -=0.3;
            theta[leftLowerArmId] -= 0.3;
            setTimeout(function() {
                flagDown = 1;
                flagUp = 0;
            }, 2000);
        }

        if(flagDown) {
            moveinYaxis += 0.004;
            theta[leftUpperLegId] += 0.2;
            theta[leftLowerLegId] -= 0.2;

            theta[rightUpperLegId] += 0.2;
            theta[rightLowerLegId] -= 0.2;

            theta[rightLowerArmId] +=0.3;
            theta[leftLowerArmId] += 0.3;
            flagDown = 0;
            flagUp = 1;

        }
    }

    for (i = 0; i < numNodes; i++) initNodes(i);
    eye = vec3(radius * Math.sin(alpha), radius * Math.sin(beta), radius * Math.cos(alpha));
    modelViewMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix));
    gl.clear(gl.COLOR_BUFFER_BIT);
    traverse(torsoId);
    requestAnimationFrame(render);
}
