var Ship = {
    prop : '',
    ship : '',
    rotZ : 0,
    
    init : function(scene) {
        
        var loader = new THREE.OBJMTLLoader();
        loader.addEventListener( 'load', function ( event ) {
            console.log(event);
            var object = event.content;         
            object.position.set(0, 180, 100);
            object.scale.set(5.0,5.0,5.0);
            scene.add( object );
            
            Ship.prop = object.children[10];
            Ship.ship = object;
        });
        loader.load( 'meshes/spitfire.obj', 'meshes/spitfire.mtl' );

    },
    
    time : 0,
    
    updateBeforeRender : function() {
        time += 0.02;
        
        Ship.prop.rotation.set(0.0,0.0, -Ship.rotZ + ( -1 * time * 4));

        Ship.ship.rotation.set(0.0,0.0,Ship.rotZ);
        
        if(Ship.rotZ > 0) {
            Ship.rotZ -= 0.04;
        }
        if(Ship.rotZ < 0) {
            Ship.rotZ += 0.04;
        }
        
        engines[0].positionBase.set( Ship.ship.position.x - 3, Ship.ship.position.y, Ship.ship.position.z - 5 );
        engines[1].positionBase.set( Ship.ship.position.x + 3, Ship.ship.position.y, Ship.ship.position.z - 5 );
    },
    
    moove : function(x,y) {
        
    },
    
    panLeft : function() {
        Ship.ship.position.x -= 2.0;
        if(Ship.rotZ<1.1)
            Ship.rotZ+=0.08;
    },
    
    panRight : function() {
        Ship.ship.position.x += 2.0;
        
        if(Ship.rotZ>-1.1)
            Ship.rotZ-=0.08;
    },
    
    panForward : function() {
        Ship.ship.position.z -= 2.0;        
    },
    
    panBack : function() {
        Ship.ship.position.z += 2.0;
    },
    
    elevUp : function() {
        Ship.ship.position.y += 1.0;        
    },
    
    elevDown : function() {
        Ship.ship.position.y -= 1.0;
    }
}