var Enemy = {
    enemies : [],
    enemyBudget : 20,
    time : 0,
    wp:0,
    zRange : 300,
    
    getNewPath : function() {
        var arr = [];
        
        arr.push({
            x:-200,
            y:20,
            z:-400
        });
        arr.push({
            x:-150,
            y:80,
            z:150
        });
        arr.push({
            x:0,
            y:190,
            z:50
        });
        arr.push({
            x:150,
            y:80,
            z:150
        });
        
        arr.push({
            x:200,
            y:20,
            z:-200
        });
        
        
        
        arr.push({
            x:00,
            y:150,
            z:0
        });
        
        arr.push({
            x:-200,
            y:210,
            z:150
        });
        
        arr.push({
            x:800,
            y:20,
            z:-150
        });
        
        return arr;
    },
    
    getNewEnemy : function(cobject) {                
        cobject.speed = (Math.random() * 2.0) + 1.8;
       
        cobject.rotZ = 0;
        
        cobject.scale.set(2.0,2.0,2.0);
        
        cobject.animateHit = false;
        cobject.animateHitCounter = 0;
        cobject.HP = 4;
        cobject.animateDeath = false;
        
        cobject.spline = new THREE.SplineCurve3(Enemy.getNewPath());
        cobject.spline.updateArcLengths();
        cobject.spline_pos = 0.0;
        
        cobject.isAlive = true;
        
    },
    
    init : function(scene, readyCallback) {
        
        var loader = new THREE.OBJMTLLoader();
        loader.addEventListener( 'load', function ( event ) {
            console.log(event);
            var object = event.content;                
            
            for(var i=0;i<Enemy.enemyBudget;i++) {
                
                var cobject = object.clone();    
                cobject.children[0].children[0].material = cobject.children[0].children[0].material.clone();
    
                cobject.scale.set(2.0,2.0,2.0);
                cobject.position.set(0.0,160.0,-400.0);
                cobject.isAlive = false;
                
                Enemy.enemies.push(cobject);
                
                scene.add( cobject );                   
            }
            
            if(readyCallback) {
                readyCallback();
            }
        });
        loader.load( 'meshes/a6m/A6M_ZERO.obj', 'meshes/a6m/A6M_ZERO.mtl' );

    },
    
    updateOnHitEffects : function(i) {
        
        // is death
        if(Enemy.enemies[i].animateDeath) {
            Enemy.enemies[i].position.y-=1.2;
            var a = Enemy.time / 40.0;
            if(i%2==0) {
                a=-a;
            }
            Enemy.enemies[i].rotation.set(0,a * 6.8,a * 6.8);
            
            if(Enemy.enemies[i].scale.x > 0) {
                Enemy.enemies[i].scale.x -= 0.01;
            }
            var s = Enemy.enemies[i].scale.x;
            Enemy.enemies[i].scale.set(s,s,s);
            
            if(Enemy.enemies[i].position.y < 0) {
                //Enemy.getNewEnemy(Enemy.enemies[i]);
                Enemy.enemies[i].isAlive = false;
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
    },
    
    wave : 0,
    pause : 0,
    
    updateBeforeRender : function() {
        Enemy.time += 1;
        
        
        if(Enemy.time >= 18) {
            //console.log('New enemy..', Enemy.time);          
            Enemy.time = 0;
            
            // find empty enemy slot
            var i =0;
            while( (i<Enemy.enemies.length) && (Enemy.enemies[i].isAlive)) {
                i++;
            }
            
            if((i<Enemy.enemies.length)) {
                Enemy.wave++
                if(Enemy.wave > 5) {
                    Enemy.pause++;                
                    if(Enemy.pause > 2) {
                        Enemy.pause = 0;
                        Enemy.wave = 0;
                    }
                } else {
                    Enemy.getNewEnemy(Enemy.enemies[i]);
                }
            }
        }
        
        for(var i=0;i<Enemy.enemies.length;i++) {
                
            
            
            if(Enemy.enemies[i].isAlive && (!Enemy.enemies[i].animateDeath)) {
                Enemy.enemies[i].spline_pos += 0.001;
                
                if(Enemy.enemies[i].spline_pos<=1.0) {
                
                    var sp = Enemy.enemies[i].spline.getPointAt(Enemy.enemies[i].spline_pos);
                
                    var axis = new THREE.Vector3();
                    var up = new THREE.Vector3(0, 0, 1);

                    var tangent = Enemy.enemies[i].spline.getTangentAt(Enemy.enemies[i].spline_pos).normalize();
                    axis.crossVectors( up, tangent ).normalize();
                    var radians = Math.acos( up.dot( tangent ) );
                    //Enemy.enemies[i].quaternion.setFromAxisAngle(axis, radians);
                    
                    var quaternion = new THREE.Quaternion().setFromAxisAngle(axis, radians);
                    Enemy.enemies[i].rotation.setEulerFromQuaternion(quaternion);
 
                    Enemy.enemies[i].position.set(
                        sp.x,
                        sp.y,
                        sp.z
                        );
                            
                    
                            
                } else {
                    Enemy.enemies[i].isAlive = false;
                }
            }
                    
            Enemy.enemies[i].collisionRect = {
                left:   Enemy.enemies[i].position.x - 3,
                top:    Enemy.enemies[i].position.z - 3,
                right:  Enemy.enemies[i].position.x + 6,
                bottom: Enemy.enemies[i].position.z + 6
            }
                
                
                
            Enemy.updateOnHitEffects(i);
            
            
            
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
            
            var v = new THREE.Vector3();
            v.x = Enemy.enemies[i].position.x;
            v.y = Enemy.enemies[i].position.y - 6.0;
            v.z = Enemy.enemies[i].position.z;
            
            Explosions.newExplosion(Enemy.enemies[i].position);
            Explosion.prototype.update(0);
            
            //Enemy.enemies[i].isAlive = false;
            //Enemy.enemies[i].position.z = -2000;
        }
    }
}