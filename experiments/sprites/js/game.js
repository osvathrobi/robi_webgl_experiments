var container, stats;

var camera, scene, renderer;

var cube;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var mapC;
var group;

var time = 0;


var targetList = [];
var projector, mouse = {
    x: 0, 
    y: 0
};

var colors = [
{
    'r':255,
    'g':0,
    'b':0
},
{
    'r':255,
    'g':255,
    'b':0
},
{
    'r':0,
    'g':255,
    'b':255
},
{
    'r':255,
    'g':0,
    'b':255
},
 {
    'r':0,
    'g':255,
    'b':0
},   
];

var materials = [];
var plops = [];

var selFirst = -1;
var selSecond = -1;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );
    

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 3100 );
    
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 1500;


    scene = new THREE.Scene();

    projector = new THREE.Projector();

    //scene.fog = new THREE.Fog( 0x000000, 1500, 2100 );

    
    
    mapC = THREE.ImageUtils.loadTexture( "res/sprite2.png" );

    var materialC = new THREE.SpriteMaterial( {
        map: mapC,
        useScreenCoordinates: false, 
        color: 0xffffff, 
        fog: false
    } );

    group = new THREE.Object3D();

    var nr_tiles = 16;
    var nr_rows = 16;
    
    var amount = nr_rows * nr_tiles;
    
    var offx = - ( nr_tiles * 90)/2;
    var offy = - ( (amount / nr_tiles) * 90)/2;

    var i=0,j=0;
    for ( var a = 0; a < amount; a ++ ) {

        i++;
        if(a % nr_tiles==0) {
            i = 0;
            j++;
        }
        
        var x = offx + (i * 90.0);
        var y = offy + j * 90.0;
        var z = 0.0; //Math.random() - 0.5;

        var m = Math.floor(Math.random() * colors.length);
        //var c = colors[m];
        plops.push(m);
        
        material = materialC.clone();
        //material.color.setHSL( 0.5 * Math.random(), 0.95, 0.5 );
        //        material.color.setRGB( c.r, c.g, c.b );
        material.uvScale.set( 2, 2 );
        material.uvOffset.set( -0.5, -0.5 );


        var sprite = new THREE.Sprite( material );

        sprite.position.set( x, y, z );
        sprite.scale.set(128,128,1.0);
        //sprite.position.normalize();
        //sprite.position.multiplyScalar( radius );

        group.add( sprite );

    }

    scene.add( group );
    

                                
                                
                                
    renderer = new THREE.WebGLRenderer({
        //'antialias':true
        });
    
    renderer.setClearColor( 0x000000, 1 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    container.appendChild( renderer.domElement );


    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
//document.addEventListener( 'mousemove', onDocumentMouseMove, false );

}

function flipPlops(source, target) {
    var c = plops[source];
    plops[source] = plops[target];
    plops[target] = c;
    
    group.children[source].animY = false;
    group.children[target].animY = false;
}

function onDocumentMouseDown( event ) 
{
    // the following line would stop any other event handler from firing
    // (such as the mouse's TrackballControls)
    // event.preventDefault();
	
    console.log("Click.");
	
    // update the mouse variable
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	
    // find intersections

    // create a Ray with origin at the mouse position
    //   and direction into the scene (camera direction)
    var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
    projector.unprojectVector( vector, camera );
    var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

    //console.log(ray);

    rray = new THREE.Ray( ray.ray.origin, ray.ray.direction );

    
    
    var intersects = [];
    
    var matrixPosition = new THREE.Vector3();
    
    for(var i=0;i<group.children.length;i++) {
        var sp = group.children[i];
        
        matrixPosition.getPositionFromMatrix( sp.matrixWorld );
        var distance = rray.distanceToPoint( matrixPosition );

        var material = sp.material;
        
        //console.log(distance, sp.scale.x);
        if ( distance < (sp.scale.x / 4) ) {            
            intersects.push( {
                distance: distance,
                point: sp.position,
                face: null,
                object: sp

            } );
            
            
            sp.animY = true;
            
            console.log(plops[i]);
            if(selFirst == -1) {
                selFirst = i;
            } else {
                if(selSecond == -1) {
                    selSecond = i;
                    
                    flipPlops(selFirst, selSecond);
                    selFirst = -1;
                    selSecond = -1;
                }
            }
            
            
            return;
        }
        
    }
    
    
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

    render();

}


function render() {

    for(var i=0;i<group.children.length;i++) {
        var sp = group.children[i];
        
        var c = colors[plops[i]];
        var material = sp.material;
        material.color.setRGB( c.r, c.g, c.b );
        sp.scale.set(128,128,1);
        
        if(sp.animY) {
            //sp.rotation  = time * 6.575;
            //material.color.setHSL( 1.0,1.0,1.0 );
            sp.scale.set(200,200,1);
        
        }
        
    }
 
    //group.rotation.x = time * 0.15;
    //group.rotation.y = time * 0.175;
    //group.rotation.z = time * 0.18;

    
    time += 0.02;
                                
    
    renderer.render( scene, camera );

}