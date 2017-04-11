canvas.addEventListener('mousedown', function(evt) {
    	evt.stopPropagation();
    	var mousePos = getMousePos(canvas, evt);
    	savePoint(mousePos);
    	    	
    	if(points.length >=2 ){
    		for(var i = 0; i<lines.length; i++){
    			if(isPoint(lines[i]['p2'], points[0])){
    				points[0] = lines[i]['p2'];
    			}
    		}
			printLine(canvas, points);
    		saveLines(points);
    		points = [];
    	}
	}, false);










window.onload = function(){
    initCanvas();
}

function initCanvas(){
    getCanvas();
    //getMousePosition(getCanvas());
    //drawPoint();
    //drawLine();
    //drawPolyline();
    //drawPolygon();
}

function getCanvas(){
    return document.getElementById("canvas-1");
}

function getMousePosition(canvas){
    var position;

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }

    canvas.addEventListener('mousedown', function(evt) {
        evt.stopPropagation();
        position = getMousePos(canvas, evt);
    }, false);

    return position;
}

function eraseCanvas(){
    var canvas = getCanvas();
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
}



function isPoint(target, myPoint){
    var T = 10;

    if (target === undefined || myPoint === undefined) return false;

    if(myPoint.x  <= target.x + T && myPoint.y  <= target.y + T){
        if( myPoint.x  >= target.x - T && myPoint.y >= target.y - T){
            return true;
        }
    }

    return false;
}

function drawPoint(){
    var canvas = getCanvas();
    function pointing(canvas, x, y) {
        var context = canvas.getContext('2d');    
        context.fillRect(x,y,1,1);
    }

    function main(){
        var mousePos = getMousePosition(canvas);
        pointing(canvas, mousePos.x, mousePos.y);
    }
    main();

}

function drawLine(){
    var canvas = getCanvas();
    var points = [];
    var count = 0;

    function savePoint(point, count){
        if(count<=2)
            points.push(point);
    }

    function printLine(canvas, points){
        var context = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        context.lineTo(points[1].x, points[1].y);
        context.stroke();
    }

    function main(){
        var mousePos = getMousePosition(canvas);
        savePoint(mousePos, count);
        count+=1;
        console.log(points);
        if(count >=2 ){
            printLine(canvas, points);
            count = 0;
            points = [];
        }
    }
    main(); 
}

function drawPolyline(){
    var canvas = getCanvas();
    var points = [];
    var lines = [];
    var polylines = [];
    
    function savePoint(point){
        if(points.length<=2)
            points.push(point);
    }

    function saveLines(points){
        var line = {'p1' : points[0], 'p2': points[1]};
        lines.push(line);
    }

    function savePolylines(lines){
        var polyline = [];
        for (var i = 0; i < lines.length; i++){
            polyline.push(lines[i]);
        }
        polylines.push(polyline);
    }

    function printLine(canvas, points){
        var context = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        context.lineTo(points[1].x, points[1].y);
        context.stroke();
        saveLines(points);
    }
    

    function main(){
        var mousePos = getMousePosition(canvas);
        savePoint(mousePos);
        if(points.length >=2 ){
            for(var i = 0; i<lines.length; i++){
                if(isPoint(lines[i]['p2'], points[0])){
                    points[0] = lines[i]['p2'];
                }
            }
            printLine(canvas, points);
            saveLines(points);
            points = [];
        }
    }
    
    main();
}

function drawPolygon(){
    var canvas = getCanvas();
    var points = [];
    var lines = [];
    var polygons = [];
    
    canvas.removeEventListener('mousedown');

    function savePoint(point){
        if(points.length<=2)
            points.push(point);
    }

    function saveLines(points){
        var line = {'p1' : points[0], 'p2': points[1]};
        lines.push(line);
    }

    function savePolygons(lines){
        var polygon = [];
        for (var i = 0; i < lines.length; i++){
            polygon.push(lines[i]);
        }
        polygons.push(polygon);
    }

    function printLine(canvas, points){
        var context = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        context.lineTo(points[1].x, points[1].y);
        context.stroke();
        saveLines(points);
    }

    function main(){
        var mousePos = getMousePosition(canvas);
        savePoint(mousePos);
        
        if(points.length >=2 ){
            if(lines.length > 0 && isPoint(lines[0]["p1"], mousePos)){
                console.log(isPoint(lines[0]["p1"], mousePos));
                printLine(canvas, [points[0], lines[0]["p1"]]);
                savePolygons(lines);
                points = [];
                lines = [];
            }
            else{
                printLine(canvas, points);
                points.shift(); 
            }
        }
    }

    main();
}
