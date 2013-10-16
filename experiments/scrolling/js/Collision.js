var Collision = {
    
    bullets : [],
    enemies : [],
    
    intersectRect : function(r1, r2) {
        //console.log(r1,r2);
        return !(r2.left > r1.right || 
            r2.right < r1.left || 
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
    },
    
    runBulletEnemyCollision : function() {
        for(var i=0;i<Collision.bullets.length; i++){
            for(var j=0;j<Collision.enemies.length; j++){
                if( (Collision.bullets[i].age>0) && 
                    (Collision.bullets[i].alive>0) &&
                    (Collision.enemies[j].HP>0) &&
                    (Collision.enemies[j].position.y>140)
                    ) {
                    
                    if(Collision.intersectRect(
                        Collision.enemies[j].collisionRect, 
                        Collision.bullets[i].collisionRect
                        )) {
                        
                        Enemy.bulletHit(j);
                        Collision.bullets[i].age = 999;
                    }
                }
            }
        }
    },
    
    registerBullets : function(collisionRectCollection) {
        //console.log('Registering bullets', collisionRectCollection);
        Collision.bullets = Collision.bullets.concat(collisionRectCollection);        
    },
    
    registerEnemies : function(collisionRectCollection) {
        //console.log('Registering enemies', collisionRectCollection);
        Collision.enemies = Collision.enemies.concat(collisionRectCollection);
    }
}