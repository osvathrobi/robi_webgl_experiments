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
    

    var effect = new Effects();
    effect.smoke.velocityBase = new THREE.Vector3( -20, 0,150 );
    var engine = new ParticleEngine();
    engine.setValues( effect.smoke);
    engine.initialize();
    engines.push(engine);
    
    var effect = new Effects();
    effect.smoke.velocityBase = new THREE.Vector3( 20, 0,150 );
    var engine = new ParticleEngine();
    engine.setValues( effect.smoke );
    engine.initialize();
    engines.push(engine);
    
    /*
    var effect = new Effects();
    var engine = new ParticleEngine();
    engine.setValues( effect.clouds );
    engine.initialize();
    engines.push(engine);
    */
   
    
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
    
    Input.init();
    
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

    var dt = clock.getDelta();
    for(var i=0;i<engines.length;i++) {
        engines[i].update( dt * 0.5 );
    }
    
    render();
    stats.update();
}




function render() {

    time += 0.02;

    
    renderer.render( scene, camera );

}
