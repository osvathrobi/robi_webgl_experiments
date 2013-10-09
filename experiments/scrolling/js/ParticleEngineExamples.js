
function Effects() {
    this.smoke =
    {
        positionStyle    : Type.CUBE,
        positionBase     : new THREE.Vector3( 0, 0, 0 ),
        positionSpread   : new THREE.Vector3( 4, 10, 4 ),

        velocityStyle    : Type.CUBE,
        // velocityBase     : new THREE.Vector3( 0, 0, -150 ), // defined in game
        velocitySpread   : new THREE.Vector3( 20, 40, 20 ), 
        accelerationBase : new THREE.Vector3( 0,10,80 ),
		
        particleTexture : THREE.ImageUtils.loadTexture( 'textures/smokeparticle.png'),

        angleBase               : 0,
        angleSpread             : 720,
        angleVelocityBase       : 0,
        angleVelocitySpread     : 720,
		
        sizeTween    : new Tween( [0, 0.6], [1, 32] ),
        opacityTween : new Tween( [0.2, 0.5], [0.5, 0] ),
        colorTween   : new Tween( [0.3, 0.5], [ new THREE.Vector3(0,0,0.2), new THREE.Vector3(0, 0, 0.5) ] ),

        particlesPerSecond : 8,
        particleDeathAge   : 0.6,		
        emitterDeathAge    : 1,

        emitterSecondInRealTime : 0.02,

        particleBudget : 240
    };
    
    this.bullets =
    {
        positionStyle    : Type.CUBE,
        positionBase     : new THREE.Vector3( 0, 120, 0 ),
        positionSpread   : new THREE.Vector3( 0, 0, 0 ),

        velocityStyle    : Type.CUBE,
        velocityBase     : new THREE.Vector3( 0, 0, -500 ),
        velocitySpread   : new THREE.Vector3( 0, 0, 0 ), 
        accelerationBase : new THREE.Vector3( 0,0,0 ),
		
        particleTexture : THREE.ImageUtils.loadTexture( 'textures/bullet.png'),

        angleBase               : 0,
        angleSpread             : 0,
        angleVelocityBase       : 0,
        angleVelocitySpread     : 0,
	
        sizeBase : 16,

        //sizeTween    : new Tween( [0, 1], [1, 48] ),
        //opacityTween : new Tween( [0.8, 2], [0.5, 0] ),
        //colorTween   : new Tween( [0.4, 1], [ new THREE.Vector3(0,0,0.2), new THREE.Vector3(0, 0, 0.5) ] ),

        particlesPerSecond : 1,
        particleDeathAge   : 0.8,
        emitterDeathAge    : 1,
        
        emitterSecondInRealTime : 0.05,
        
        particleBudget : 32
    };
	
}