window.onload = function(){
	initCanvas();
}
function reloadCanvas(){
	document.getElementById("painel").innerHTML = "<canvas id='canvas-1' width='800px' height='500px'></canvas>";
	
	function printLine(canvas, line){
		var context = canvas.getContext('2d');
		context.beginPath();
		context.moveTo(line['p1'].x, line['p1'].y);
		context.lineTo(line['p2'].x, line['p2'].y);
		context.stroke();
	}

	console.log(canvas_obj);
	for (var i=0; i<canvas_obj['lines'].length; i++){
		//console.log(canvas_obj['lines'][i]);
		printLine(getCanvas(), canvas_obj['lines'][i]);
	}
	for (var i=0; i<canvas_obj['polylines'].length; i++){
		//console.log(canvas_obj['polylines'][i]);
		for (var j=0; j<canvas_obj['polylines'][i].length; j++)
			printLine(getCanvas(), canvas_obj['polylines'][i][j]);
	}
}

function initCanvas(){
	getCanvas();
}

function getCanvas(){
	return document.getElementById("canvas-1");
}


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
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

var canvas_obj = {
	'points' : [],
	'lines' : [],
	'polylines' : [],
	'polygons' : []
};


function drawPoint(){
	var canvas = getCanvas();
	function pointing(canvas, x, y) {
	    var context = canvas.getContext('2d');    
	    context.fillRect(x,y,1,1);
	    canvas_obj['points'].push({'x':x, 'y':y});
	}
	function mainPoint(evt){
		var mousePos = getMousePos(canvas, evt);
    	pointing(canvas, mousePos.x, mousePos.y);    	
	}

	canvas.addEventListener('mousedown', mainPoint, true);
	canvas.removeEventListener('mousedown', mainPoint, true);

}

function drawLine(){
	reloadCanvas();
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
		var line = {'p1': points[0] , 'p2': points[1] };
		canvas_obj['lines'].push(line);
	}

	function mainLine(evt){
    	var mousePos = getMousePos(canvas, evt);
    	savePoint(mousePos, count);
    	count+=1;
    	console.log(points);
    	if(count >=2 ){
    		printLine(canvas, points);
    		count = 0;
    		points = [];
    	}
	}

	canvas.addEventListener('mousedown', mainLine, false);
	canvas.removeEventListener('mousedown', mainLine, true);
	
}

function drawPolyline(){
	reloadCanvas();
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
		console.log(lines);
	}

	function savePolylines(lines){
		var polyline = [];
		for (var i = 0; i < lines.length; i++){
			polyline.push(lines[i]);
		}
		//polylines.push(polyline);
		canvas_obj['polylines'].push(polyline);
	}

	function printLine(canvas, points){
		var context = canvas.getContext('2d');
		context.beginPath();
		context.moveTo(points[0].x, points[0].y);
		context.lineTo(points[1].x, points[1].y);
		context.stroke();
	}
	
	function mainPolyline(evt){
		var mousePos = getMousePos(canvas, evt);
		var last;
		savePoint(mousePos);
		if(points.length >=2 ){
			printLine(canvas, points);
    		saveLines(points);
    		last = points.shift();
    		if(isPoint(points[0], last)){
				savePolylines(lines);
				points = [];
				lines=[];
    		}
		}
		
	}

	canvas.addEventListener('mousedown',mainPolyline, false);

	canvas.removeEventListener('mousedown', mainPolyline, true);
}

function drawPolygon(){
	var canvas = getCanvas();
	var points = [];
	var lines = [];
	var polygons = [];
	
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

	function mainPolygon(evt){
    	evt.stopImmediatePropagation();
    	var mousePos = getMousePos(canvas, evt);
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

	canvas.addEventListener('mousedown',mainPolygon, false);
	canvas.removeEventListener('mousedown', mainPolygon, true);

	
}
