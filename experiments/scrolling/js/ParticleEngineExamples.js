
function Effects() {
    this.smoke =
        {
        positionStyle    : Type.CUBE,
        positionBase     : new THREE.Vector3( 0, 0, 0 ),
        positionSpread   : new THREE.Vector3( 4, 10, 4 ),

        velocityStyle    : Type.CUBE,
        velocityBase     : new THREE.Vector3( 0, 0,150 ),
        velocitySpread   : new THREE.Vector3( 20, 40, 20 ), 
        accelerationBase : new THREE.Vector3( 0,10,0 ),
		
        particleTexture : THREE.ImageUtils.loadTexture( 'textures/smokeparticle.png'),

        angleBase               : 0,
        angleSpread             : 720,
        angleVelocityBase       : 0,
        angleVelocitySpread     : 720,
		
        sizeTween    : new Tween( [0, 1], [1, 48] ),
        opacityTween : new Tween( [0.8, 2], [0.5, 0] ),
        colorTween   : new Tween( [0.4, 1], [ new THREE.Vector3(0,0,0.2), new THREE.Vector3(0, 0, 0.5) ] ),

        particlesPerSecond : 80,
        particleDeathAge   : 2.0,		
        emitterDeathAge    : 1,
        
        particleBudget : 120
    };
    
    this.clouds =
	{
        positionStyle  : Type.CUBE,
        positionBase   : new THREE.Vector3( 0, 60,  -200 ),
        positionSpread : new THREE.Vector3( 2000,  0, 0 ),
		
        velocityStyle  : Type.CUBE,
        velocityBase   : new THREE.Vector3( 0, 0, 200 ),
        velocitySpread : new THREE.Vector3( 0, 0, 0 ), 
		
        particleTexture : THREE.ImageUtils.loadTexture( 'textures/smokeparticle.png'),

        sizeBase     : 180.0,
        sizeSpread   : 100.0,
        colorBase    : new THREE.Vector3(0.0, 0.0, 1.0), // H,S,L
        opacityTween : new Tween([0,1,4,5],[0,1,1,0]),

        particlesPerSecond : 20,
        particleDeathAge   : 200.0,		
        emitterDeathAge    : 1,
        
        particleBudget : 500
    };
	
}