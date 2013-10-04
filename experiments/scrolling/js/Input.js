var Input = {
    init : function() {        
        window.addEventListener( 'keydown', Input.onKeyDown, false );
        window.addEventListener( 'keyup', Input.onKeyUp, false );
    },
    
    moveLeft : false,
    moveRight : false,
    
    onKeyDown : function(event) {        
        //console.log(event.keyCode);
        
        switch ( event.keyCode ) {
            case 37:
                Input.moveLeft = true;
                break;
            case 39:
                Input.moveRight = true;
                break;
            case 38:
                Input.moveUp = true;
                break;
            case 40:
                Input.moveDown = true;
                break;  
            case 16:
                Input.elevUp = true;
                break;
            case 17:
                Input.elevDown = true;
                break;  
        }
    },
    
    onKeyUp : function(event) {
        switch ( event.keyCode ) {
            case 37:
                Input.moveLeft = false;
                break;
            case 39:
                Input.moveRight = false;
                break;
            case 38:
                Input.moveUp = false;
                break;
            case 40:
                Input.moveDown = false;
                break;  
            case 16:
                Input.elevUp = false;
                break;
            case 17:
                Input.elevDown = false;
                break; 
        }
    },
    
    update : function() {
        if(Input.moveLeft) {
            Ship.panLeft();
        }
        
        if(Input.moveRight) {
            Ship.panRight();
        }
        
        if(Input.moveUp) {
            Ship.panForward();
        }
        
        if(Input.moveDown) {
            Ship.panBack();
        }
        
        if(Input.elevUp) {
            Ship.elevUp();
        }
        
        if(Input.elevDown) {
            Ship.elevDown();
        }
    }
}