var Enemy = {
    enemies : [],
    enemyBudget : 10,
    time : 0,
    wp:0,
    zRange : 300,
    
    getNewEnemy : function(cobject) {
        cobject.position.set(
            1000 - (Math.random() * 2000), 
            160, // + (Math.random() * 120), 
            -200 +  (Math.random() * (-Enemy.zRange))
            );
                
        cobject.speed = (Math.random() * 2.0) + 1.8;
                
        cobject.direction = new THREE.Vector3(
            -400 + (Math.random() * 800),
            0,
            0
            );
               
        cobject.rotZ = 0;
        
        cobject.animateHit = false;
        cobject.animateHitCounter = 0;
        cobject.HP = 10;
        cobject.animateDeath = false;
    },
    
    init : function(scene, readyCallback) {
        
        var loader = new THREE.OBJMTLLoader();
        loader.addEventListener( 'load', function ( event ) {
            console.log(event);
            var object = event.content;                
            
            for(var i=0;i<Enemy.enemyBudget;i++) {
                
                var cobject = object.clone();    
                cobject.children[0].children[0].material = cobject.children[0].children[0].material.clone();
                //cobject.children[0].material = cobject.children[0].material.clone();
                
                //var newmat = new THREE.MeshBasicMaterial();
                //newmat.map = cobject.children[0].material.map;
                
                //cobject.children[0].material = newmat;
                
                //cobject.children[0].material.transparent = true;
                //cobject.children[0].material.blending = 1; 
                //cobject.children[0].material.alphaTest = 0.5; 
                //cobject.children[0].material.depthTest = true;
                //cobject.children[0].material.depthWrite = true;
        
                //cobject.children[0].material.opacity  = 1.0;
        
                //cobject.children[0].material.blending = THREE.CustomBlending;
                //cobject.children[0].material.blendSrc = THREE.SrcColorFactor;
                //cobject.children[0].material.blendDst = THREE.OneMinusSrcColorFactor;
                //cobject.children[0].material.blendSrc = THREE.SrcAlphaFactor;
                //cobject.children[0].material.blendDst = THREE.OneMinusSrcAlphaFactor;
                //cobject.children[0].material.blendEquation = THREE.AddEquation;
    
                cobject.scale.set(2.0,2.0,2.0);
                
                Enemy.getNewEnemy(cobject);
                
                Enemy.enemies.push(cobject);
                
                //console.log(cobject);
                scene.add( cobject );                   
            }
            
            if(readyCallback) {
                readyCallback();
            }
        });
        loader.load( 'meshes/A6M_ZERO.obj', 'meshes/A6M_ZERO.mtl' );

    },
    
    updateBeforeRender : function() {
        Enemy.time += 0.02;
        
        
        
        for(var i=0;i<Enemy.enemies.length;i++) {
        
        
            
            
            // move planes
            var direction = Enemy.enemies[i].direction;
            
            if(direction.x < Enemy.enemies[i].position.x) {
                
                if(Math.abs(direction.x - Enemy.enemies[i].position.x) > 10) {
                    Enemy.enemies[i].position.x-=1.5;
                    
                    if(Enemy.enemies[i].rotZ<0.6)
                        Enemy.enemies[i].rotZ+=0.05;
                } else {
                    if(Enemy.enemies[i].rotZ>0)
                        Enemy.enemies[i].rotZ-=0.05;    
                }
                
                Enemy.enemies[i].rotation.set(0.0,0.0, Enemy.enemies[i].rotZ);
            }
            else {
                
                if(Math.abs(direction.x - Enemy.enemies[i].position.x) > 10) {
                    Enemy.enemies[i].position.x+=1.5;
                                
                    if(Enemy.enemies[i].rotZ>-0.6)
                        Enemy.enemies[i].rotZ-=0.05;
                } else {
                    if(Enemy.enemies[i].rotZ<0)
                        Enemy.enemies[i].rotZ+=0.05;   
                }
                
                Enemy.enemies[i].rotation.set(0.0,0.0, Enemy.enemies[i].rotZ);
            }
            
            var speed=Enemy.enemies[i].speed;
        
            if(Enemy.enemies[i].position.z>200) {                                
                Enemy.getNewEnemy(Enemy.enemies[i]);
                Enemy.enemies[i].position.z = -Enemy.zRange + (speed);
            }
        
            Enemy.enemies[i].position.set(
                Enemy.enemies[i].position.x, 
                Enemy.enemies[i].position.y, 
                Enemy.enemies[i].position.z + speed
                );
                    
                     
            Enemy.enemies[i].collisionRect = {
                left:   Enemy.enemies[i].position.x - 3,
                top:    Enemy.enemies[i].position.z - 3,
                right:  Enemy.enemies[i].position.x + 6,
                bottom: Enemy.enemies[i].position.z + 6
            }
                
                
                
                
            // is death
            if(Enemy.enemies[i].animateDeath) {
                Enemy.enemies[i].position.y-=1.8;
                var a = Enemy.time;
                if(i%2==0) {
                    a=-a;
                }
                Enemy.enemies[i].rotation.set(0.0,a * 6.8,0.0);
                
                if(Enemy.enemies[i].position.y < 0) {
                    Enemy.getNewEnemy(Enemy.enemies[i]);
                }
                
                Enemy.enemies[i].children[0].children[0].material.color.setRGB(0.14,0.14,0.14);
            } else {
                
                // on hit
                if(Enemy.enemies[i].animateHitCounter>0) {                
                    Enemy.enemies[i].animateHitCounter--;
                
                    if(Enemy.enemies[i].animateHit) {
                        Enemy.enemies[i].children[0].children[0].material.color.setRGB(2.0,2.0,2.0);
                    } else {
                        Enemy.enemies[i].children[0].children[0].material.color.setRGB(1.0,1.0,1.0);    
                    }
                
                    Enemy.enemies[i].animateHit = !Enemy.enemies[i].animateHit
                } else {
                    Enemy.enemies[i].children[0].children[0].material.color.setRGB(0.64,0.64,0.64);
                }
        
        
            }
            
            
            
        }
    },
    
    bulletHit : function(i) {
        //console.log("Hit: ", i);
        //Enemy.getNewEnemy(Enemy.enemies[i]);
        
        if(Enemy.enemies[i].animateHitCounter==0) {            
            Enemy.enemies[i].animateHitCounter = 1;
        }
        
        Enemy.enemies[i].HP--;
        
        if(Enemy.enemies[i].HP==0) {            
            Enemy.enemies[i].animateDeath = true;
        }
    }
}