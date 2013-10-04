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
var engine = [];
       
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


    var effect = new Effects();
    effect.smoke.velocityBase = new THREE.Vector3( -20, 0,150 );
    engine[0] = new ParticleEngine();
    engine[0].setValues( effect.smoke);
    engine[0].initialize();
    
    var effect = new Effects();
    effect.smoke.velocityBase = new THREE.Vector3( 20, 0,150 );
    engine[1] = new ParticleEngine();
    engine[1].setValues( effect.smoke );
    engine[1].initialize();
    
    Terrain.init(scene);
    Ship.init(scene);
    
    renderer = new THREE.WebGLRenderer({
        //'antialias':true
        });
    
    renderer.setClearColor( 0x000000, 1 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    
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
    for(var i=0;i<engine.length;i++) {
        engine[i].update( dt * 0.5 );
    }
    
    render();
    stats.update();
}




function render() {

    time += 0.02;

    
    renderer.render( scene, camera );

}
