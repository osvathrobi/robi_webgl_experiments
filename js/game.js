var container, stats;

var camera, scene, renderer;

var cube;

var _rotation = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var clock = new THREE.Clock();


var worldWidth = 384;
var worldDepth = 384;
    
var geometry;
var mesh;
    
init();
animate();


function generateTexture( data, width, height ) {

    var canvas, canvasScaled, context, image, imageData,
    level, diff, vector3, sun, shade;

    vector3 = new THREE.Vector3( 0, 0, 0 );

    sun = new THREE.Vector3( 1, 1, 1 );
    sun.normalize();

    canvas = document.createElement( 'canvas' );
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext( '2d' );
    context.fillStyle = '#000';
    context.fillRect( 0, 0, width, height );

    image = context.getImageData( 0, 0, canvas.width, canvas.height );
    imageData = image.data;

    for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

        vector3.x = data[ j - 2 ] - data[ j + 2 ];
        vector3.y = 2;
        vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
        vector3.normalize();

        shade = vector3.dot( sun );

        imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
        imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
        imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
    }

    context.putImageData( image, 0, 0 );

    // Scaled 4x

    canvasScaled = document.createElement( 'canvas' );
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    context = canvasScaled.getContext( '2d' );
    context.scale( 4, 4 );
    context.drawImage( canvas, 0, 0 );

    image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
    imageData = image.data;

    for ( var i = 0, l = imageData.length; i < l; i += 4 ) {

        var v = ~~ ( Math.random() * 5 );

        imageData[ i ] += v;
        imageData[ i + 1 ] += v;
        imageData[ i + 2 ] += v;

    }

    context.putImageData( image, 0, 0 );

    return canvasScaled;

}
                        
                        
function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 9000 );
    camera.position.z = 0;
    camera.position.y = 0;
    camera.position.z = 100;
    camera.lookAt.x = 0;
    camera.lookAt.y = 0;
    camera.lookAt.z = 0;
    
    scene = new THREE.Scene();

    // Cube
    var geometryc = new THREE.CubeGeometry( 20, 20, 20 );

    for ( var i = 0; i < geometryc.faces.length; i ++ ) {
        geometryc.faces[ i ].color.setHex( Math.random() * 0xffffff );
    }

    var material = new THREE.MeshBasicMaterial( {
        vertexColors: THREE.FaceColors
    } );

    cube = new THREE.Mesh( geometryc, material );
    cube.position.y = 0;
    scene.add( cube );


    data = generateHeight( worldWidth, worldDepth, 0 );

    geometry = new THREE.PlaneGeometry( 5000, 5000, worldWidth - 1, worldDepth - 1 );
    geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
    geometry.dynamic = true;

    for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
        geometry.vertices[ i ].y = 10-(data[ i ] * 2.7);
    }

    texture = new THREE.Texture( generateTexture( data, worldWidth, worldDepth ), new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping );
    texture.needsUpdate = true;

    mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {
        map: texture
    //wireframe : true
    } ) );
    
    scene.add( mesh );
    

                                

    renderer = new THREE.WebGLRenderer({
        'antialias':true
    }); 
    
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    container.appendChild( renderer.domElement );



    controls = new THREE.FirstPersonControls( camera );
    controls.movementSpeed = 1000;
    controls.lookSpeed = 0.125;
    controls.lookVertical = true;
    
    window.addEventListener( 'resize', onWindowResize, false );    
//window.addEventListener( 'keydown', onKey, false );
}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onKey() {
    t+=0.1;
}

function animate() {

    requestAnimationFrame( animate );

    render();

}

var t = 0.0;

function render() {

    

    t+=0.82;
    
    /*
    data = generateHeight( worldWidth, worldDepth, t );
    for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
        geometry.vertices[ i ].y =  data[ i ];
    }
            
    mesh.geometry.verticesNeedUpdate = true;
            
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;
*/


    controls.update( clock.getDelta() );           
    renderer.render( scene, camera );

}

function generateHeight( width, height, offset ) {

    var size = width * height, data = new Float32Array( size ),
    perlin = new ImprovedNoise(), quality = 2, z = 0;// Math.random() * 100;

    for ( var i = 0; i < size; i ++ ) {

        data[ i ] = 0

    }

    for ( var j = 0; j < 4; j ++ ) {

        for ( var i = 0; i < size; i ++ ) {

            var x = i % width, y = (~~ ( i / width ))+offset;
            data[ i ] += perlin.noise(x / quality, y / quality, z) * quality *1.75;


        }

        quality *= 5;

    }

    return data;

}