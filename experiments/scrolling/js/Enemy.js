var Enemy = {
    enemies : [],
    enemyBudget : 20,
    time : 0,
    wp:0,
    zRange : 300,
    
    getNewEnemy : function(cobject) {
        cobject.position.set(
            1000 - (Math.random() * 2000), 
            80 + (Math.random() * 120), 
            -200 +  (Math.random() * (-Enemy.zRange))
            );
                
        cobject.speed = (Math.random() * 2.0) + 1.8;
                
        cobject.direction = new THREE.Vector3(
            -400 + (Math.random() * 800),
            0,
            0
            );
                
        cobject.rotZ = 0;
    },
    
    init : function(scene) {
        
        var loader = new THREE.OBJMTLLoader();
        loader.addEventListener( 'load', function ( event ) {
            console.log(event);
            var object = event.content;                
            
            for(var i=0;i<Enemy.enemyBudget;i++) {
                
                var cobject = object.clone();    
                
                cobject.scale.set(2.0,2.0,2.0);
                
                Enemy.getNewEnemy(cobject);
                
                Enemy.enemies.push(cobject);
                
                scene.add( cobject );                   
            }
        });
        loader.load( 'meshes/A6M_ZERO.obj', 'meshes/A6M_ZERO.mtl' );

    },
    
    updateBeforeRender : function() {
        Enemy.time += 0.02;
        
        
        
        for(var i=0;i<Enemy.enemies.length;i++) {
        
            var direction = Enemy.enemies[i].direction;
            
            if(direction.x < Enemy.enemies[i].position.x) {
                
                if(Math.abs(direction.x - Enemy.enemies[i].position.x) > 10) {
                    Enemy.enemies[i].position.x-=1.5;
                    
                    if(Enemy.enemies[i].rotZ<1.1)
                        Enemy.enemies[i].rotZ+=0.05;
                } else {
                    if(Enemy.enemies[i].rotZ>0)
                        Enemy.enemies[i].rotZ-=0.05;    
                }
                
                Enemy.enemies[i].rotation.set(0.0,0.0, Enemy.enemies[i].rotZ);
            } else {
                
                if(Math.abs(direction.x - Enemy.enemies[i].position.x) > 10) {
                    Enemy.enemies[i].position.x+=1.5;
                                
                    if(Enemy.enemies[i].rotZ>-1.1)
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
                
        }
    }
}