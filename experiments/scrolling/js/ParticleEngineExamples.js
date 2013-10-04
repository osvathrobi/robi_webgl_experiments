
function Effects() {
    this.smoke =
    {
        positionStyle    : Type.CUBE,
        positionBase     : new THREE.Vector3( 0, 0, 0 ),
        positionSpread   : new THREE.Vector3( 4, 10, 4 ),

        velocityStyle    : Type.CUBE,
        velocityBase     : new THREE.Vector3( 0, 0,150 ),
        velocitySpread   : new THREE.Vector3( 20, 20, 20 ), 
        accelerationBase : new THREE.Vector3( 0,10,0 ),
		
        particleTexture : THREE.ImageUtils.loadTexture( 'textures/smokeparticle.png'),

        angleBase               : 0,
        angleSpread             : 720,
        angleVelocityBase       : 0,
        angleVelocitySpread     : 720,
		
        sizeTween    : new Tween( [0, 1], [1, 64] ),
        opacityTween : new Tween( [0.8, 2], [0.5, 0] ),
        colorTween   : new Tween( [0.4, 1], [ new THREE.Vector3(0,0,0.2), new THREE.Vector3(0, 0, 0.5) ] ),

        particlesPerSecond : 150,
        particleDeathAge   : 1.0,		
        emitterDeathAge    : 1
    }
	
}