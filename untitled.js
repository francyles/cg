var Point = function(x, y){
    this.x = x;
    this.y = y;
    this.color = "black";

    this.setColor = function(color){
        this.color = color;
    };

    this.draw = function(canvas){
        var context = canvas.getContext('2d');
        context.fillRect(this.x,this.y,2,2);
    };
};

var Line = function(p1, p2){
    this.p1 = p1;
    this.p2 = p2;
    this.color = "black";
    
    this.setColor = function(color){
        this.color = color;
    };

    this.draw = function(canvas){
        
    }    
}