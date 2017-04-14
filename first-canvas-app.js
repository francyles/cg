window.onload = function(){
	initCanvas();
	document.getElementById("load-canvas").addEventListener('change', loadTextFile, false);
}

var canvas_obj = {
	'points' : [],
	'lines' : [],
	'polylines' : [],
	'polygons' : []
};

function saveTextFile() {
	var text = JSON.stringify(canvas_obj);
	var name = "cg_canvas.txt";
	var type = "text/plain";
	var toSave = document.getElementById("save-canvas");
	var file = new Blob([text], {type: type});
	toSave.href = URL.createObjectURL(file);
	toSave.download = name;
}

function loadTextFile(evt){
	var files = evt.target.files;
	var readObj;
	var cg = new FileReader();
	cg.onloadend = function(evt){
		readObj = JSON.parse(evt.target.result);
		canvas_obj = readObj;
		reloadCanvas();
	}
	cg.readAsBinaryString(files[0]);

}


function initCanvas(){
	getCanvas();
}

function getCanvas(){
	return document.getElementById("canvas-1");
}

function reloadCanvas(){
	document.getElementById("painel").innerHTML = "<canvas id='canvas-1' width='800px' height='500px'></canvas>";
	
	function printPoints(canvas, point){
		var context = canvas.getContext('2d');    
	    context.fillRect(point.x,point.y,2,2);
	}

	function printLine(canvas, line){
		var context = canvas.getContext('2d');
		context.beginPath();
		context.moveTo(line['p1'].x, line['p1'].y);
		context.lineTo(line['p2'].x, line['p2'].y);
		context.stroke();
	}

	console.log(canvas_obj);
	for (var i=0; i<canvas_obj['points'].length; i++){
		printPoints(getCanvas(), canvas_obj['points'][i]);
	}
	for (var i=0; i<canvas_obj['lines'].length; i++){
		printLine(getCanvas(), canvas_obj['lines'][i]);
	}
	for (var i=0; i<canvas_obj['polylines'].length; i++){
		for (var j=0; j<canvas_obj['polylines'][i].length; j++)
			printLine(getCanvas(), canvas_obj['polylines'][i][j]);
	}
	for (var i=0; i<canvas_obj['polygons'].length; i++){
		for (var j=0; j<canvas_obj['polygons'][i].length; j++)
			printLine(getCanvas(), canvas_obj['polygons'][i][j]);
	}

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


function drawPoint(){
	reloadCanvas();
	var canvas = getCanvas();
	function pointing(canvas, x, y) {
	    var context = canvas.getContext('2d');    
	    context.fillRect(x,y,2,2);
	    canvas_obj['points'].push({'x':x, 'y':y});
	}
	function mainPoint(evt){
		var mousePos = getMousePos(canvas, evt);
    	pointing(canvas, mousePos.x, mousePos.y);    	
	}

	canvas.addEventListener('mousedown', mainPoint, false);
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
	reloadCanvas();
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
		canvas_obj['polygons'].push(polygon);
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

/**** Funções de seleção de objetos ****/
function selectionObj(){
	reloadCanvas();
	var canvas = getCanvas();
	
	function select(evt){
		console.log("selectionObj");
		var mousePos = getMousePos(canvas, evt);
		for (var i=0; i<canvas_obj['polygons'].length; i++){
				if(pickAreaAngle(mousePos, canvas_obj['polygons'][i])){
					console.log(canvas_obj['polygons'][i]);
				}
		}
	}
	canvas.addEventListener('mousedown',select, false);

}

function pickAreaAngle(point, poligono){
	var soma = 0;
	var lines = [];
	
	for(var i = 0; i < poligono.length; i++){
		var v = [poligono[i]["p1"].x - point.x , poligono[i]["p2"].y - point.y];
		console.log(v);
		lines.push(v);
		var context = getCanvas().getContext('2d');
		context.beginPath();
		context.moveTo(poligono[i]["p1"].x, poligono[i]["p2"].y);
		context.lineTo(point.x, point.y);
		context.stroke();
	}
	var i;
	for(i = 0; i < lines.length; i++){
		var cosAng;
		if(i == lines.length-1)
			cosAng = (lines[i][0] * lines[0][0] + lines[i][1] * lines[0][1]) / (Math.sqrt(Math.pow(lines[i][0],2) + Math.pow(lines[i][1],2)) * Math.sqrt(Math.pow(lines[0][0],2) + Math.pow(lines[0][1],2)));
		else
			cosAng = (lines[i][0] * lines[i+1][0] + lines[i][1] * lines[i+1][1]) / (Math.sqrt(Math.pow(lines[i][0],2) + Math.pow(lines[i][1],2)) * Math.sqrt(Math.pow(lines[i+1][0],2) + Math.pow(lines[i+1][1],2)));
		var ang = Math.acos(cosAng);
		soma = soma + Math.abs(ang);
	}

	console.log(soma);

	return (soma == 2*Math.PI);
}