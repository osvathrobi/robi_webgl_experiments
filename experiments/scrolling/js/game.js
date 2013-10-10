var container, stats;

var camera, scene, renderer;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var time = 0;
var stats;

var targetList = [];
var projector, mouse = {
    x: 0, 
    y: 0
};

var isDragging = false;

var worldWidth = 16, worldDepth = 16,
worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

var clock = new THREE.Clock();
var engines = [];
       
init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );
    

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1,4000 );
    
    camera.position.x = 0;
    camera.position.y = 300;
    camera.position.z = 200;

    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt(new THREE.Vector3(0,0,0));


    scene = new THREE.Scene();

    projector = new THREE.Projector();

    scene.fog = new THREE.Fog( 0x000000, 100, 4000);

    
    
    mapC = THREE.ImageUtils.loadTexture( "res/sprite2.png" );

    var materialC = new THREE.SpriteMaterial( {
        map: mapC,
        useScreenCoordinates: false, 
        color: 0xffffff, 
        fog: false
    } );



    Terrain.init(scene);
    Ship.init(scene);
    Enemy.init(scene, function() {
        Collision.registerEnemies(Enemy.enemies);
    });
    

    var effect = new Effects();
    effect.smoke.velocityBase = new THREE.Vector3( -20, 0,200 );
    var engine = new ParticleEngine();
    engine.setValues( effect.smoke);
    engine.initialize();
    engines.push(engine);
    
    var effect2 = new Effects();
    effect2.smoke.velocityBase = new THREE.Vector3( 20, 0,200 );
    var engine2 = new ParticleEngine();
    engine2.setValues( effect2.smoke );
    engine2.initialize();
    engines.push(engine2);
    
    
    var effect3 = new Effects();
    var engine3 = new ParticleEngine();
    engine3.setValues( effect3.bullets );
    engine3.initialize();
    engines.push(engine3);
    
    var effect4 = new Effects();
    var engine4 = new ParticleEngine();
    engine4.setValues( effect4.bullets );
    engine4.initialize();
    engines.push(engine4);
    
    // collision of bullet / enemy
    Collision.registerBullets(engine3.particleArray);
    Collision.registerBullets(engine4.particleArray);    
    
    
    
    renderer = new THREE.WebGLRenderer({
        //antialias':true,
        //alpha: false
        //clearAlpha: 1
        });
    
    renderer.setClearColor( 0x000000, 1 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.sortObjects = false;
    
    container.appendChild( renderer.domElement );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );
                                
    window.addEventListener( 'resize', onWindowResize, false );
    
    window.addEventListener( 'mousemove', onWindowMouseMove, false );
    window.addEventListener( 'mousedown', onWindowStartDrag, false );
    window.addEventListener( 'mouseup', onWindowStopDrag, false );
    
    window.addEventListener( 'touchmove', onWindowMouseMove, false );
    window.addEventListener( 'touchstart', onWindowStartDrag, false );
    window.addEventListener( 'touchend', onWindowStopDrag, false );
    
    //window.addEventListener( 'click', onWindowClick, false );
    
    Input.init();
    
}

function onWindowStartDrag() {
    isDragging = true;
}

function onWindowStopDrag() {
    isDragging = false;
}

function onWindowMouseMove(event) {
    if(isDragging) {
        var planeZ = new THREE.Plane(new THREE.Vector3(0, 1, 0), -120);
        var mv = new THREE.Vector3(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
            0.5 );
        var raycaster = projector.pickingRay(mv, camera);
        var pos = raycaster.ray.intersectPlane(planeZ);
        //console.log("x: " + pos.x + ", y: " + pos.y);
    
        Ship.moveTo(pos);
    }
}


function onWindowClick(event) {
    isDragging = true;
    
    var planeZ = new THREE.Plane(new THREE.Vector3(0, 1, 0), -120);
    var mv = new THREE.Vector3(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5 );
    var raycaster = projector.pickingRay(mv, camera);
    var pos = raycaster.ray.intersectPlane(planeZ);
    //console.log("x: " + pos.x + ", y: " + pos.y);
    
    Ship.moveTo(pos);
}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {

    requestAnimationFrame( animate );

    Input.update();

    Terrain.updateBeforeRender();
    Ship.updateBeforeRender();
    Enemy.updateBeforeRender();
    
    var dt = clock.getDelta();
    for(var i=0;i<engines.length;i++) {
        engines[i].update( dt * 0.5);
    }
    
    Collision.runBulletEnemyCollision();
    
    render();
    stats.update();
}




function render() {

    time += 0.02;

    
    renderer.render( scene, camera );

}
