var Ship = {
    prop : '',
    ship : '',
    rotZ : 0,
    targetPos:'',
    
    init : function(scene) {
        
        var loader = new THREE.OBJMTLLoader();
        loader.addEventListener( 'load', function ( event ) {
            console.log(event);
            var object = event.content;         
            object.position.set(0, 120, 100);
            
            Ship.targetPos = new THREE.Vector3(0, 120, 100);
            
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
        
        // moveTo
        
        if(isDragging) {
        
            if(Math.abs(Ship.targetPos.x - Ship.ship.position.x) > 2.0 ) {
                if(Ship.targetPos.x < Ship.ship.position.x) {
                    Ship.panLeft();
                } else {
                    Ship.panRight();
                }
            }
        
            if(Math.abs(Ship.targetPos.z - Ship.ship.position.z) > 2.0 ) {
                if(Ship.targetPos.z < Ship.ship.position.z) {
                    Ship.panForward();
                } else {
                    Ship.panBack();
                }
            }
            
            Ship.ship.position.x =  Ship.targetPos.x;
            Ship.ship.position.z =  Ship.targetPos.z;
        
        }
        
        // move
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
        
        var vec3 = new THREE.Vector3( 18.0 * Math.cos(Ship.rotZ), 12.0 * Math.sin(Ship.rotZ), 0 );
        engines[2].positionBase.set( Ship.ship.position.x  - vec3.x, - vec3.y + Ship.ship.position.y, Ship.ship.position.z - 3 );
        engines[3].positionBase.set( Ship.ship.position.x  + vec3.x, + vec3.y + Ship.ship.position.y, Ship.ship.position.z - 3 );
        
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
    },
    moveTo : function(pos) {
        Ship.targetPos.x = pos.x;
        Ship.targetPos.y = pos.y; // flip
        Ship.targetPos.z = pos.z;
    }
}