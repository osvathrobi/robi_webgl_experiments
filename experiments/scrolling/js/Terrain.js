var Terrain = {
    
    meshes : [],
    textures : [],
    geometries : [],
    
    wp : 0,
    
    init : function(scene) {
        var worldWidth = 1;
        var worldDepth = 1;
        for(var i=0;i<3;i++) {
            geometry = new THREE.PlaneGeometry( 2000, 2000, worldWidth - 1, worldDepth - 1 );
            geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
            geometry.dynamic = true;
            geometry.computeFaceNormals();
            geometry.computeVertexNormals();
            Terrain.geometries.push(geometry);
        }
        
        geometry = new THREE.PlaneGeometry( 2000, 2000, 1, 1 );
        geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
        geometry.dynamic = true;
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        Terrain.geometries.push(geometry);

        //var texture = THREE.ImageUtils.loadTexture( "../../threejs/examples/textures/water.jpg" );
        var texture = THREE.ImageUtils.loadTexture( "textures/dirt_sc.jpg" );
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 8,8 );
    
        var texture_cloud = THREE.ImageUtils.loadTexture( "textures/cloud3.png" );
        texture_cloud.wrapS = texture_cloud.wrapT = THREE.RepeatWrapping;
        texture_cloud.repeat.set( 2.5,2 );
        
        var texture_building = THREE.ImageUtils.loadTexture( "textures/building2.jpg" );
        texture_building.wrapS = texture_building.wrapT = THREE.RepeatWrapping;
        texture_building.repeat.set( 2,3 );
        
    
    
        var mesh;
        
        material = new THREE.MeshBasicMaterial( {
            color: 0xffffff, 
            map: texture, 
            wireframe:false
        } );  
        mesh = new THREE.Mesh( Terrain.geometries[0], material );
        Terrain.meshes.push(mesh);
        scene.add(mesh);
    
        material = new THREE.MeshBasicMaterial( {
            color: 0xffffff, 
            map: texture, 
            wireframe:false
        } );                                                          
        mesh = new THREE.Mesh( Terrain.geometries[1], material );    
        Terrain.meshes.push(mesh);    
        scene.add(mesh);
        //mesh.position.set(0, -200, 0);
    
        material = new THREE.MeshBasicMaterial( {
            color: 0xffffff, 
            map: texture, 
            wireframe:false
        } );                                                          
        mesh = new THREE.Mesh( Terrain.geometries[2], material );
        Terrain.meshes.push(mesh);
        //meshes[2].position.set(0, -4000, 0);
        scene.add(mesh);
    

        // CLOUDS        
        
        material_cloud = new THREE.MeshBasicMaterial( {
            color: 0xffffff, 
            map: texture_cloud, 
            wireframe:false,
            transparent : true,
            opacity:0.9,
            blending : 1,
            depthTest: true,
            depthWrite : true, 
        //alphaTest: 0.5
        //  combine : THREE.MixOperation
        } );                                                          
        mesh = new THREE.Mesh( Terrain.geometries[3], material_cloud );
        Terrain.meshes.push(mesh);
        scene.add(mesh);
        mesh = new THREE.Mesh( Terrain.geometries[3], material_cloud );
        Terrain.meshes.push(mesh);
        scene.add(mesh);
        mesh = new THREE.Mesh( Terrain.geometries[3], material_cloud );
        Terrain.meshes.push(mesh);
        scene.add(mesh);
        mesh = new THREE.Mesh( Terrain.geometries[3], material_cloud );
        Terrain.meshes.push(mesh);
        scene.add(mesh);
        mesh = new THREE.Mesh( Terrain.geometries[3], material_cloud );
        Terrain.meshes.push(mesh);
        scene.add(mesh);
        mesh = new THREE.Mesh( Terrain.geometries[3], material_cloud );
        Terrain.meshes.push(mesh);
        scene.add(mesh);
        
        // Buildings
        var j;
        material = new THREE.MeshBasicMaterial( {
            color: 0xcccccc, 
            map: texture_building, 
            wireframe:false
        } );                  
        for(j=0;j<120;j++) {
            geometry = new THREE.CubeGeometry( 30, 90, 30 );
            mesh = new THREE.Mesh( geometry, material );
            Terrain.meshes.push(mesh);
            scene.add( mesh );                                
        }
        
        // Position terrain
        Terrain.meshes[0].position.set(0, 0,0);
        Terrain.meshes[1].position.set(0, 0, -2000);
        Terrain.meshes[2].position.set(0, 0, -4000);
        
        // Position clouds
        Terrain.meshes[3].position.set(200, 80, 0);
        Terrain.meshes[4].position.set(200, 80, -2000);
        Terrain.meshes[5].position.set(200, 80, -4000);
        Terrain.meshes[6].position.set(-200, 90, 500);
        Terrain.meshes[7].position.set(-200, 90, -1500);
        Terrain.meshes[8].position.set(-200, 90, -3500);
        
        // position buildings
        for(j=0;j<120;j++) {
            Terrain.meshes[9 + j].position.set(-1000 + (Math.random() * 2000), 0, Math.random() * (-6000));
        }
        
        
        
        
                                
                                
    },
    
    
    reshuffle : function (p) {
        var m = 0;
        //console.log(wp);
    
        var data = generateHeight( worldWidth, worldDepth, (Terrain.wp*100) );
    
        for ( var i = 0, l = Terrain.geometries[p].vertices.length; i < l; i ++ ) {
            if( (i > worldWidth) && (i < l - worldWidth)) {
                var h = 10-(data[ i ] * 9.7);
                Terrain.geometries[p].vertices[ i ].y =  h; //70 * Math.sin( i / 5 + ( 100 + i ) / 7 );
            
                if(h>m) {
                    m = h;
                }
            }
        }

        Terrain.geometries[p].computeFaceNormals();
        Terrain.geometries[p].computeVertexNormals();

        Terrain.meshes[p].geometry.verticesNeedUpdate = true;   
        return m;
    },

    generateHeight : function( width, height, offset ) {

        var size = width * height, data = new Float32Array( size ),
        perlin = new ImprovedNoise(), quality = 4, z = 0;// Math.random() * 100;

        for ( var i = 0; i < size; i ++ ) {

            data[ i ] = 0

        }

        for ( var j = 0; j < 3; j ++ ) {
        
            var cn = 0;
        
            for ( var y = 0; y < height; y ++ ) {
                for ( var x = 0; x < width; x ++ ) {
    
                    data[ cn ] += perlin.noise(x / quality, (y+(offset)) / quality, z) * quality * 1.75;
                    cn++;
                }

            }

            quality *= 5;

        }

        return data;

    },
    
    time : 0,
    
    updateBeforeRender : function() {
        time += 0.02;
        
        for(var i=0;i<Terrain.meshes.length;i++) {
            
              
            var speed=2.0;
        
            // scroll speed for Clouds
            if( (i>=3)&&(i<6) ) {
                speed = 2.2;
            }
            if( (i>=6)&&(i<9) ) {
                speed = 2.9;
            }
            
            if(Terrain.meshes[i].position.z>2000) {                
                
                Terrain.meshes[i].position.z = -4000 + (speed);
                //var m = reshuffle(i);
                Terrain.wp++;
            }
        
            Terrain.meshes[i].position.set(Terrain.meshes[i].position.x, Terrain.meshes[i].position.y, Terrain.meshes[i].position.z + speed);
                
        }
    }
}

