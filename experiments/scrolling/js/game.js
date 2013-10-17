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
    
    ParticleEngines.initEngines(function() {        
        // collision of bullet / enemy
        Collision.registerBullets(Ship.particles.leftBulletStream.particleArray);
        Collision.registerBullets(Ship.particles.rightBulletStream.particleArray);

    });

    Explosions.init();

    renderer = new THREE.WebGLRenderer({
        //antialias':true,
        //alpha: false
        //clearAlpha: 1
        premultipliedAlpha : true
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
    
    ParticleEngines.updateBeforeRender();
    Explosions.updateBeforeRender();
    
    Collision.runBulletEnemyCollision();
    
    render();
    stats.update();
}




function render() {

    time += 0.02;

    
    renderer.render( scene, camera );

}
