var Explosions = {
    budget : 10,
    explosions : [],
    time : 0,
    
    init : function() {
        for(var i=0;i<Explosions.budget;i++) {
            var ex = new Explosion(
                new THREE.Vector3(i * 32, -180, -2000),
                32.0
                );
            Explosions.explosions.push( ex );
        }
    },
    
    newExplosion : function(position) {
        var i = 0;
        while( (i<Explosions.explosions.length) && (Explosions.explosions[i].isAlive)) {
            i++;
        }
        if((i<Explosions.explosions.length)) {
            Explosions.explosions[i].isAlive = true;
            Explosions.explosions[i].mesh.position = position;
        }
    },
    
    updateBeforeRender : function() {
        Explosions.time++;
        if(Explosions.time>100) {
            Explosions.time = 0;
        }
        
        for(var i=0;i<Explosions.explosions.length; i++) {
            Explosions.explosions[i].update(Explosions.time);
        }
    }
}

Explosion = function(position, size) {
    
    this.position = position;
    this.size = size;
    
    this.isAlive = false;
    
    this.geometry = new THREE.PlaneGeometry( size, size, 1, 1 );
    this.geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
    this.geometry.dynamic = true;    
    this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals();    
    
    //console.log(this.geometry);
    
    this.texture = THREE.ImageUtils.loadTexture( "textures/explosion_1_38_128_corrected.png" );
    //this.texture = THREE.ImageUtils.loadTexture( "textures/explosion_sm.png" );
            
    this.material = new THREE.MeshBasicMaterial( {
        color: 0xffffff, 
        map: this.texture, 
        wireframe:false,
        transparent : true,
        depthWrite : false,
        depthTest:false,
        opacity: 0.9
    } );  
        
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.scale.set(1.0,1.0,1.0);
    this.mesh.position = this.position;
    
    this.index = 2;
    
    scene.add(this.mesh);
    
    // reset uv-s
    this.mesh.geometry.faceVertexUvs[0][0][0] = new THREE.Vector2(0, 0);
    this.mesh.geometry.faceVertexUvs[0][0][1] = new THREE.Vector2(0, 0);
    this.mesh.geometry.faceVertexUvs[0][0][2] = new THREE.Vector2(0, 0);
    this.mesh.geometry.faceVertexUvs[0][0][3] = new THREE.Vector2(0, 0);
    
    this.mesh.geometry.uvsNeedUpdate = true;
}

Explosion.prototype.update = function(dt) {
    if(this.isAlive) {
        if(dt%2==0) {
            this.index++;
            if(this.index>=64) {
                this.index = 2;
                this.isAlive = false;
            }
            //console.log(this.geometry.faceVertexUvs[0][0]);
            var n = 8;
            var s = 1/n;    
            //var index = 19;    
            var offsetU = ((this.index % n) * s);
            var offsetV =  1.0 - (Math.floor(this.index / n) * s);
            //console.log(offsetU, offsetV, this.index, s, n);
    
            this.mesh.geometry.faceVertexUvs[0][0][0] = new THREE.Vector2(offsetU, offsetV + s);
            this.mesh.geometry.faceVertexUvs[0][0][1] = new THREE.Vector2(offsetU, offsetV);
            this.mesh.geometry.faceVertexUvs[0][0][2] = new THREE.Vector2(offsetU + s, offsetV);
            this.mesh.geometry.faceVertexUvs[0][0][3] = new THREE.Vector2(offsetU + s, offsetV + s);
    
            this.mesh.geometry.uvsNeedUpdate = true;
        }
    }
}