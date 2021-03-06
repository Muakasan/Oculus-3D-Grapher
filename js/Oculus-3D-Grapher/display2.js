function findRightSurface() {
    
    var headerDivValue = $($.grep($(".collapsible-body"), function( i ) {      
            return $(i).css("display") !== "none";
        })[0]).prev().html();

    console.log(headerDivValue);
    
    switch(headerDivValue)
    {
        case "Torus":
            run(5);
            break;
        case "Cone":
            run(cone($("#conea").val(), $("#coneb").val(), $("#conec").val()));
            break;
        case "Ellipsoid":
            run(ellipsoid($("#ellipa").val(), $("#ellipb").val(), $("#ellipc").val()));
            break;
        case "Plane":
            run(plane($("#planea").val(), $("#planeb").val(), $("#planec").val(), $("#planed").val()));
            break;
        case "Cylinder":
            run(cylinder($("#cylina").val(), $("#cylinb").val()));
            break;
        case "Gabriel's Horn":
            run(trumpet($("#trumpeta").val()));
            break;
        case "Mobius Band":
            run(mobius($("#mobiusa").val()));
            break;
        case "Hyperboloid of One Sheet":
            run(hyperboloidOne($("#hypera").val(), $("#hyperb").val(), $("#hyperc").val()));
            break;
        case "Hyperboloid of Two Sheets":
            run(hyperboloidTwo($("#hypera2").val(), $("#hyperb2").val()));
            break;
        case "Elliptic Paraboloid":
            run(paraboloid($("#paraba").val(), $("#parabb").val(), $("#parabc").val()));
            break;
        case "Hyperbolic Paraboloid":
            run(hyperbolicParaboloid($("#paraba2").val(), $("#parabb2").val(), $("#parabc2").val()));
            break;
        case "Custom Equation":
            runCustomEquation();
            break;
    }

/*
    else if(document.getElementById("conea").value!='')
        run(cone(document.getElementById("conea").value, document.getElementById("coneb").value,document.getElementById("conec").value));
    else if(document.getElementById("ellipa").value!='')
        run(ellipsoid(document.getElementById("ellipa").value, document.getElementById("ellipb").value,document.getElementById("ellipc").value));
    else if(document.getElementById("trumpeta").value!='')
        run(trumpet(document.getElementById("trumpeta").value));//fix this?
    else if(document.getElementById("mobiusa").value!='')
        run(mobius(document.getElementById("mobiusa").value)); //fix this //done I think
    else if(document.getElementById("hypera").value!='')
        run(hyperboloidOne(document.getElementById("hypera").value, document.getElementById("hyperb").value, document.getElementById("hyperc").value));
    else if(document.getElementById("hypera2").value!='')
        run(hyperboloidTwo(document.getElementById("hypera2").value, document.getElementById("hyperb2").value));
    else if(document.getElementById("paraba").value!='')
        run(paraboloid(document.getElementById("paraba").value, document.getElementById("parabb").value)); //also fix this //done!
    else if(document.getElementById("paraba2").value!='')
        run(hyperbolicParaboloid(document.getElementById("paraba2").value, document.getElementById("parabb2").value)); //and this. definitely fix this.
    else if(document.getElementById("cylina").value!='')
        run(cylinder(document.getElementById("cylina").value, document.getElementById("cylinb").value));
    else if(document.getElementById("planea").value!='')
        run(plane(document.getElementById("planea").value, document.getElementById("planeb").value, document.getElementById("planec").value, document.getElementById("planed").value));
}
        getCustomEquation();*/
}
function run(surfaceData) {
    var camera, scene, renderer;
    var geometry, material, mesh;
    var controls, time = Date.now();

    var effect;

    var objects = [];

    var ray;

    var cube;
    var surface;

    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;

    var moveUp = false;
    var moveDown = false;

    var rotateLeft = false;
    var rotateRight = false;
    var rotateUp = false;
    var rotateDown = false;
    var tiltLeft = false;
    var tiltRight = false;

    vr.load(function(error) {
        if (error) {
            //statusEl.innerText = 'Plugin load failed: ' + error.toString();
            //alert('Plugin load failed: ' + error.toString());
        }

        init();
        animate();
        /*} catch (e) {
            //statusEl.innerText = e.toString();
            console.log(e);
        }*/
    });
    function init() {
        bindKeys();
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        scene = new THREE.Scene();

        controls = new THREE.OculusRiftControls( camera );
        scene.add( controls.getObject() );

        ray = new THREE.Raycaster();
        ray.ray.direction.set( 0, -1, 0 );

        parGeometry = null;
        if(surfaceData==5)
            parGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
        else
            parGeometry = new THREE.ParametricGeometry(surfaceData, 100, 100);
        parMaterial = new THREE.MeshBasicMaterial({color:0x0000ff, wireframe:true});

        surface = new THREE.Mesh(parGeometry, parMaterial);

        scene.add(surface);
        objects.push(surface);

        renderer = new THREE.WebGLRenderer({
            devicePixelRatio: 1,
            alpha: false,
            clearColor: 0xFFFFFF,
            antialias: true
        });
        effect = new THREE.OculusRiftEffect(renderer);
        $("#graph-div").append($(renderer.domElement));
        //document.body.appendChild( renderer.domElement );
        $("#left-half").hide();
        $("#right-half").hide();
        
        $("#graph-div > canvas").css({
            "width": "100%",
            "height": "100%"
        });

        window.addEventListener("keydown", function(e) {
            // space and arrow keys
            if([32, 38, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        }, false);

    }
    var vrstate = new vr.State();
    
    function iter() {
        controls.isOnObject(false);
        ray.ray.origin.copy(controls.getObject().position);
        ray.ray.origin.y -= 10;

        var intersections = ray.intersectObjects(objects);
        if(intersections.length>0) {
            var distance = intersections[0].distance;
            if(distance>0 && distance<10) {
            }
        }

        var polled = vr.pollState(vrstate);

        

        time = Date.now();
        if(moveForward) { 
            var v = new THREE.Vector3(0,0,1);
            camera.translateOnAxis(v,1);
        }
        if(moveBackward) {
            var v = new THREE.Vector3(0,0,-1);
            camera.translateOnAxis(v,1);
        }
        if(moveLeft)
        {
            var v = new THREE.Vector3(-1,0,0);
            camera.translateOnAxis(v,1);
        }
        if(moveRight) {
            var v = new THREE.Vector3(1,0,0);
            camera.translateOnAxis(v,1);
        }
        if(moveUp) {
            var v = new THREE.Vector3(0,1,0);
            camera.translateOnAxis(v,1);
        }
        if(moveDown) {
            var v = new THREE.Vector3(0,-1,0);
            camera.translateOnAxis(v,1);
        }
        if(rotateLeft)
            camera.rotateY(0.1);
        if(rotateRight)
            camera.rotateY(-0.1);
        if(rotateUp) {
            camera.rotateX(0.1);
        }
        if(rotateDown) {
            camera.rotateX(-0.1);
        }
        effect.render(scene, camera, polled ? vrstate : null);
    }

    function animateWithLeap() {
        var firstFrame;

        var controller = Leap.loop({enableGestures:true}, function(frame){
            if(!firstFrame){
                firstFrame = frame;
            }
            var linearMovement = frame.translation(firstFrame); 
            /*surface.position.x += parseInt(linearMovement[0])/100;
            surface.position.y += parseInt(linearMovement[1])/100;
            surface.position.z += parseInt(linearMovement[2])/100;*/
            camera.translateX(parseInt(linearMovement[0])/500);
            camera.translateY(parseInt(linearMovement[1])/500);
            camera.translateZ(parseInt(linearMovement[2])/500);
            
            //var rotationMovement = frame.rotationAngle(firstFrame);
            
            camera.rotateX(parseInt(frame.rotationAngle(firstFrame, [1, 0, 0])/500));
            camera.rotateY(parseInt(frame.rotationAngle(firstFrame, [0, 1, 0])/500));
            //camera.rotateY(parseInt(rotationMovement[1])/500);
            
            iter();
        });
        controller.connect();
        console.log(controller.connected());
    }

    function animateNoLeap() {
        vr.requestAnimationFrame(animateNoLeap);
        iter();
    }
    function animate() {
        animateWithLeap();
    }

    function bindKeys() {
        var onKeyDown = function ( event ) {

            switch ( event.keyCode ) {

                //case 38: // up
                case 87: // w
                    moveForward = true;
                    break;

                //case 37: // left
                case 65: // a
                    moveLeft = true; 
                    break;

                //case 40: // down
                case 83: // s
                    moveBackward = true;
                    break;

                //case 39: // right
                case 68: // d
                    moveRight = true;
                    break;

                /*case 32: // space
                    if ( canJump === true ) velocity.y += this.jumpSpeed;
                    canJump = false;
                    break;*/

                case 81: //q
                    moveUp = true;
                    break;

                case 69: //e
                    moveDown = true;
                    break;

                case 73: //I
                    rotateUp = true;
                    break;

                case 75: //K
                    rotateDown = true;
                    break;

                case 74: //J
                    rotateLeft = true;
                    break;

                case 76://L
                    rotateRight = true;
                    break;

                case 85://U
                    tiltRight = true;
                    break;

                case 79://O
                    tiltLeft = true;
                    break;

            }

        }

        var onKeyUp = function ( event ) {

            switch ( event.keyCode ) {

                //case 38: // up
                case 87: // w
                    moveUp = true;
                     break;

                //case 37: // left
                case 65: // a
                    moveLeft = true; 
                    break;

                //case 40: // down
                case 83: // s
                    moveDown = true;
                    break;

                //case 39: // right
                case 68: // d
                    moveRight = true;
                    break;

                case 81: //q
                    moveForward = true;
                    break;

                case 69: //e
                    moveBackward = true;
                    break;

                case 73: //I
                    rotateUp = true;
                    break;

                case 75: //K
                    rotateDown = true;
                    break;

                case 74: //J
                    rotateLeft = true;
                    break;

                case 76://L
                    rotateRight = true;
                    break;
            }

        }
        document.addEventListener("keydown", onKeyDown, false);
        document.addEventListener("keyup", onKeyUp, false);
    }
}