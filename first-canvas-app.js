window.onload = function(){
	document.getElementById("load-canvas").addEventListener('change', loadTextFile, false);
	createCanvasAux();
}

var canvas_obj = initCanvas();

function initCanvas(){
	return {
		'points' : [],
		'lines' : [],
		'polylines' : [],
		'polygons' : []
	};
}

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

function createCanvasAux(){
	var canvas_aux = document.createElement('canvas');
	var container = getCanvas().parentNode;
	canvas_aux.id = 'canvas-aux';
	canvas_aux.width = getCanvas().width;
	canvas_aux.height = getCanvas().height;
	container.appendChild(canvas_aux);
}

function getCanvas(){
	return document.getElementById("canvas-1");
}

function getCanvasAux(){
	return document.getElementById("canvas-aux");
}

function reloadCanvas(){
	document.getElementById("painel").innerHTML = "<canvas id='canvas-1' width='800px' height='500px'></canvas>";
	createCanvasAux();
	
	this.printPoints = function(canvas, point){
		var context = canvas.getContext('2d');    
	    context.fillRect(point.x,point.y,2,2);
	}

	this.printLine = function(canvas, line){
		var context = canvas.getContext('2d');
		context.beginPath();
		context.moveTo(line[0].x, line[0].y);
		context.lineTo(line[1].x, line[1].y);
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
	canvas_obj = initCanvas();
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
	var canvas = getCanvasAux();
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
	var canvas = getCanvasAux();
	var points = [];
	var count = 0;
	var init = false;
	var context = canvas.getContext('2d');

	function savePoint(point){
		points.push(point);
	}

	function initLine(evt){
    	var mousePos = getMousePos(canvas, evt);
    	savePoint(mousePos);
    	init = true;
    	console.log(points[0]);

	}
	function printLine(evt){
		if(!init) return;	
		context.clearRect(0, 0, canvas.width, canvas.height);
		var mousePos = getMousePos(canvas, evt);
		context.beginPath();
		context.moveTo(points[0].x, points[0].y);
		context.lineTo(mousePos.x, mousePos.y);
		context.stroke();
	}
	function saveLine(evt){
		var mousePos = getMousePos(canvas, evt);
		points.push({'x': mousePos.x, 'y':mousePos.y});
		var line = [{'x': points[0].x, 'y':points[0].y},
					{'x': points[1].x, 'y':points[1].y} 
					];
		canvas_obj['lines'].push(line);
		init = false;
		points = [];
		reloadCanvas();
	}
	canvas.addEventListener('mousedown', initLine, false);
	canvas.addEventListener('mousemove', printLine, false);
	canvas.addEventListener('mouseup', saveLine, false);

	 // canvas.removeEventListener('mousedown', initLine, true);
	 // canvas.removeEventListener('mousemove', printLine, true);
	 // canvas.removeEventListener('mouseup', saveLine, true);
	//canvas.removeEventListener('mousedown', mainLine, true);
	
}

function drawPolyline(){
	reloadCanvas();
	var canvas = getCanvasAux();
	var points = [];
	var lines = [];
	var polylines = [];
	
	function savePoint(point){
		if(points.length<=2)
			points.push(point);
	}

	function saveLines(points){
		var line = [{'x': points[0].x, 'y':points[0].y},
					{'x': points[1].x, 'y':points[1].y} 
					];
		lines.push(line);
		console.log(lines);
	}

	function savePolylines(lines){
		var polyline = [];
		for (var i = 0; i < lines.length; i++){
			polyline.push(lines[i]);
		}
		canvas_obj['polylines'].push(polyline);
		reloadCanvas();
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
	var canvas = getCanvasAux();
	var points = [];
	var lines = [];
	var polygons = [];
	
	function savePoint(point){
		if(points.length<=2)
			points.push(point);
	}

	function saveLines(points){
		var line = [{'x': points[0].x, 'y':points[0].y},
					{'x': points[1].x, 'y':points[1].y} 
					];
		lines.push(line);
	}

	function savePolygons(lines){
		var polygon = [];
		for (var i = 0; i < lines.length; i++){
			polygon.push(lines[i]);
		}
		canvas_obj['polygons'].push(polygon);
		reloadCanvas();
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
    		if(lines.length > 0 && isPoint(lines[0][0], mousePos)){
    			console.log(isPoint(lines[0][0], mousePos));
    			printLine(canvas, [points[0], lines[0][0]]);
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
function selectionObj(someFunction){
	reloadCanvas();
	var canvas = getCanvasAux();
	
	function select(evt){
		console.log("selectionObj");
		var mousePos = getMousePos(canvas, evt);
		for (var i=0; i< canvas_obj['points'].length; i++){ //verifica pontos
			if(isPoint(canvas_obj['points'][i], mousePos)){
				dragAndDrop(canvas_obj['points'][i]);
			}
		}
		for (var i=0; i<canvas_obj['lines'].length; i++){ //verifica linhas
				if(pickLine(canvas_obj['lines'][i], mousePos)){
					//função de agarrar o objeto
					dragAndDrop(canvas_obj['lines'][i], mousePos);
					//console.log(canvas_obj['lines'][i]);
				}
		}
		for (var i=0; i<canvas_obj['polylines'].length; i++){ //verifica poligonos
				if(pickLine(canvas_obj['polylines'][i],mousePos)){
					//função de agarrar o objeto
					console.log(canvas_obj['polylines'][i]);
					//dragAndDrop(canvas_obj['polylines'][i], mousePos);
				}
		}
		for (var i=0; i<canvas_obj['polygons'].length; i++){ //verifica poligonos
				if(pickAreaAngle(mousePos, canvas_obj['polygons'][i])){
					//função de agarrar o objeto
					dragAndDrop(canvas_obj['polygons'][i], mousePos);
				}
		}
		
	}
	canvas.addEventListener('mousedown',select, false);
	//canvas.removeEventListener('mousedown',select, true);

}
/******Pick de area pela soma dos angulos********/
function pickAreaAngle(point, poligono){
	var soma = 0;
	var lines = [];
	
	for(var i = 0; i < poligono.length; i++){
		var v = [poligono[i][0].x - point.x , poligono[i][0].y - point.y];
		lines.push(v);
	}

	for(var i = 0; i < lines.length; i++){
		var cosAng;
		if(i == lines.length-1)
			cosAng = (lines[i][0] * lines[0][0] + lines[i][1] * lines[0][1]) / (Math.sqrt(Math.pow(lines[i][0],2) + Math.pow(lines[i][1],2)) * Math.sqrt(Math.pow(lines[0][0],2) + Math.pow(lines[0][1],2)));
		else
			cosAng = (lines[i][0] * lines[i+1][0] + lines[i][1] * lines[i+1][1]) / (Math.sqrt(Math.pow(lines[i][0],2) + Math.pow(lines[i][1],2)) * Math.sqrt(Math.pow(lines[i+1][0],2) + Math.pow(lines[i+1][1],2)));
		var ang = Math.acos(cosAng);
		soma = soma + ang;
	}

	console.log(soma == 2*Math.PI);

	return (soma == 2*Math.PI);
}
/***Pick de reta **/
function pickLine(line, clickPoint){
  
  function code(x, y, clickX, clickY, tol, codigo){
  	for(var i = 0; i < 4; i++){
		codigo[i] = 0;
	}
	  
	if(x < clickX - tol){codigo[0] = 1;}
	if(x > clickX + tol){codigo[1] = 1;}
	if(y < clickY - tol){codigo[2] = 1;}
	if(y > clickY + tol){codigo[3] = 1;}
  }

  var code1 = [];
  var code2 = [];
  var j;
  var newY;
  var tol = 5;
  
  x1 = line[0].x;
  y1 = line[0].y;
  x2 = line[1].x;
  y2 = line[1].y;
  
  ymin = clickPoint.y - tol;
  ymax = clickPoint.y + tol;
  xmin = clickPoint.x - tol;
  xmax = clickPoint.x + tol;
  
  
  code(x2, y2, clickPoint.x, clickPoint.y, tol, code2);

  var cont = 0;
  do{
    code(x1, y1, clickPoint.x, clickPoint.y, tol, code1);
    
    for(j = 0; j < 4; j++){
        if(code1[j] && code2[j]){
        break;
      }
      }
    if (j != 4) break;

    var dx = x2 - x1;
    var dy = y2 - y1;

    if (code1[0]) {y1 = (((xmin - x1) * dy)/dx) + y1; x1 = xmin}
    else if (code1[1]) {y1 = (((xmax - x1) * dy)/dx) + y1; x1 = xmax}
    else if (code1[2]) {x1 = (((ymin - y1) * dx)/dy) + x1; y1 = ymin}
    else if (code1[3]) {x1 = (((ymax - y1) * dx)/dy) + x1; y1 = ymax}
    else return true;
  } while(1);

  return false;
}



function dragAndDrop(obj, mp){
	var obj = obj;
	var context = getCanvasAux().getContext('2d');
	var moveObj, leaveObj, diff_x, diff_y;
	
	function isArray(obj){
    	return !!obj && obj.constructor === Array;
	}

	if(!isArray(obj)){
		moveObj = function(e){
			context.clearRect(0, 0, getCanvasAux().width, getCanvasAux().height);
			obj.x = e.x - getCanvasAux().offsetLeft;
			obj.y = e.y - getCanvasAux().offsetTop;
			context.fillRect(obj.x,obj.y,2,2);	
		}

		leaveObj = function (e){
			context.fillRect(obj.x,obj.y,2,2);
			reloadCanvas();
		}
	}
	else{
		moveObj = function(e){
			console.log(mp.x, mp.y);
			context.clearRect(0, 0, getCanvasAux().width, getCanvasAux().height);
			var mousePos = getMousePos(getCanvasAux(), e);
			var aux_x = mousePos.x - getCanvasAux().offsetLeft;
			var aux_y = mousePos.y - getCanvasAux().offsetTop;
			diff_x = aux_x - mp.x;
			diff_y =  aux_y - mp.y;
			console.log(diff_x, diff_y);

		}

		leaveObj = function (e){
			var mousePos = getMousePos(getCanvasAux(), e);
			var aux_x = mousePos.x - getCanvasAux().offsetLeft;
			var aux_y = mousePos.y - getCanvasAux().offsetTop;
			diff_x = aux_x - mp.x;
			diff_y = aux_y - mp.y;
			for(var i=0; i<obj.length; i++){
				obj[i][0].x += diff_x; 
				obj[i][0].y += diff_y;
				obj[i][1].x += diff_x; 
				obj[i][1].y += diff_y;
			}
			for(var i=0; i<obj.length; i++){
				context.beginPath();
				context.moveTo(obj[i][0].x, obj[i][0].y);
				context.lineTo(obj[i][1].x, obj[i][1].y);
				context.stroke();
			}

			reloadCanvas();
		}	
	}

	getCanvasAux().addEventListener("mousemove", moveObj, false);
	getCanvasAux().addEventListener("mouseup", leaveObj, false);

	
}