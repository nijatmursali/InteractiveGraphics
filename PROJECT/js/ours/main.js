$(document).ready(function () {
    // Handler for .ready() called.
    //init();
});


function loop() {
    // handle car movement and collisions
    car.update();
    //console.log(car.mesh.position);

    // handle all growth animations
    animationforObjGrowth();
    animationforObjShrink();

    // if(isRaining) {
    //     RainSnowCycle(); //execute the rain 
    // }
    // else {
    //     //rainGeo.visible = false;
    // }
    if (isRaining) {
        rainGeo.visible = true;
        rainGeo.vertices.forEach(r => {
            r.velocity -= 0.1 + Math.random() * 0.1;
            r.y += r.velocity;

            if (r.y < -200) {
                r.y = 200;
                r.velocity = 0;
            }
        });


        rainGeo.verticesNeedUpdate = true;
        rain.rotation.y += 0.002; // ROTATE THE RAIN IN Y DIRECTION
    } else {
        rainGeo.visible = false;
    }


    // render the scene
    renderer.render(scene, camera);
    scene.rotation.y = 0.0025; // change camera rotation if you would like 
    camera.lookAt(car.mesh.position);
    // check global collisions
    objCollided();

    //stats is added here 
    var time = performance.now() / 1000;

    context.clearRect(0, 0, 512, 512);

    stats.begin();

    for (var i = 0; i < 2000; i++) {

        var x = Math.cos(time + i * 0.01) * 196 + 256;
        var y = Math.sin(time + i * 0.01234) * 196 + 256;

        context.beginPath();
        context.arc(x, y, 10, 0, Math.PI * 2, true);
        context.fill();

    }

    stats.end();

    // call the loop function again
    requestAnimationFrame(loop);
}

//ADDING CONTROLS 
/**
 * 
 * CONTROLS FOR CAR
 * 
 */


var isDayorNight = 0;
var isBackwards = 0;
var isnotBackwards = 0;
var isfrontTurned = 0;
function addControltoCar() {
    document.addEventListener(
        'keydown',
        function (ev) {
            key = ev.keyCode;

            if (key == 37 || key == 65) { // checking for both left and A key
                car.TurnCarLeft();
            }
            if (key == 39 || key == 68) { // checking for both right and D key
                car.TurnCarRight();
            }
            if (key == 38 || key == 87) {
                car.moveCarForward();

                //start engine sound 
            }
            if (key == 40 || key == 83) {
                car.moveCarBackward();
                isBackwards = 1;
                //back light on
                //carBackLightsOn(); 

                backLightOn = !backLightOn;
                console.log("backlight is: ", backLightOn);

                if(isBackwards=1) {
                    carBackLightsOn();
                    backLightLeft.intensity=1.0;
                    backLightRight.intensity=1.0;
                    isBackwards=0;

                }
                else if(isBackwards=0){
                    backLightLeft.intensity = 0.;
                    backLightRight.intensity = 0.;
                    isBackwards=1;
                }
            }
            if (key == 27) { // pause menu 
                pauseMenu();
            }
            if (key == 82) {
                //check if raining
                isRaining = !isRaining;
                console.log(isRaining);
            }
            if (key == 73) {
                //instructions shown
                instructionText();
                isInstrShown = !isInstrShown;
            }

            if (key == 72) { // if H is pushed 
                //horn sound start 
                createCarHornSound();
            }
            if (key == 78) {
                //night or day
                if (isDayorNight == 0) {
                    shadowLight.intensity = 0.9;
                    //redlight, bluelight, pointligghtPole, light;
                    redlight.intensity = 0.0;
                    bluelight.intensity = 0.0;
                    pointligghtPole.intensity = 0.0;
                    light.intensity = 0.0;
                    WorldScene.style.setProperty("background", "#B9DBE3");
                    isDayorNight = 1;
                }
                else if (isDayorNight == 1) {
                    shadowLight.intensity = 0.0;
                    redlight.intensity = 1.0;
                    bluelight.intensity = 1.0;
                    pointligghtPole.intensity = 1.0;
                    light.intensity = 1.0;
                    WorldScene.style.setProperty("background", "#000");
                    isDayorNight = 0;
                }
                console.log(isDayorNight);

            }
            if (key == 69) {
                //car engine start 
                createEngineStartSound();
            }
            if (key == 76) {
                if(isfrontTurned == 1) {
                    headLightLeftLight.intensity=1.0;
                    headLightRightLight.intensity = 1.0;
                    console.log("lights on");
                    isfrontTurned = 0;
                } 
                else if(isfrontTurned == 0) {
                    headLightLeftLight.intensity=0.0;
                    headLightRightLight.intensity = 0.0;
                    console.log("lights off");
                    isfrontTurned=1;
                }

            }
            if (key == 80) {
                turnoffPoliceLights();
            }
        }
    );

    document.addEventListener(
        'keyup',
        function (ev) {
            key = ev.keyCode;

            if (key == 37 || key == 65) {
                car.StopCarLeft();
            }
            if (key == 39 || key == 68) {
                car.StopCarRight();
            }
            if (key == 38 || key == 87) {
                car.stopCarForward();
                //car 
                Wpushed = false;
                createCarEngineSound(Wpushed);
            }
            if (key == 40 || key == 83) {
                car.stopCarBackward();
                isnotBackwards=1;
                if(isnotBackwards=1) {
                    backLightLeft.intensity = 0.;
                    backLightRight.intensity = 0.;
                    isBackwards=1;
                }
                else if(isnotBackwards=0){
                    carBackLightsOn();
                    backLightLeft.intensity=1.0;
                    backLightRight.intensity=1.0;
                    isBackwards=0;
                }
            }
            if (key == 72) {
                // horn sound stop 
            }
            if (key == 76) {
                
            }
            if (key == 80) {
                turnonPoliceLights();
            }
        }
    );
}



window.addEventListener('load', init, false);
