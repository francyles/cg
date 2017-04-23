window.onload = function(){
    document.getElementById("load-canvas").addEventListener('change', loadTextFile, false);
    createCanvasAux();
    console.log("init canvas");
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
        instanceObjects();
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

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function eraseCanvas(){
    refreshCanvas(getCanvas());
    refreshCanvas(getCanvasAux()); 
    canvas_obj = initCanvas();
}

function refreshCanvas(canvas){
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function reloadCanvas(refresh=false){
    if(!refresh){
        document.getElementById("painel").innerHTML = "<canvas id='canvas-1' width='850px' height='550px'></canvas>";
        createCanvasAux();    
    }
    else{
        refreshCanvas(getCanvas());
        refreshCanvas(getCanvasAux());  
    }

    for (var i=0; i<canvas_obj['points'].length; i++){
        canvas_obj['points'][i].draw(getCanvas());
    }
    for (var i=0; i<canvas_obj['lines'].length; i++){
        canvas_obj['lines'][i].draw(getCanvas());    }
    for (var i=0; i<canvas_obj['polylines'].length; i++){
        canvas_obj['polylines'][i].draw(getCanvas());
    }
    for (var i=0; i<canvas_obj['polygons'].length; i++){
        canvas_obj['polygons'][i].draw(getCanvas());
    }

}

function instanceObjects(){
    for (var i=0; i<canvas_obj['points'].length; i++){
        var obj_aux = canvas_obj['points'][i];
        var p = new Point(obj_aux.x, obj_aux.y);
        p.setColor(obj_aux.color);
        p.draw(getCanvas());
        canvas_obj['points'][i] = p;
    }
    for (var i=0; i<canvas_obj['lines'].length; i++){
        var obj_aux = canvas_obj['lines'][i];
        var p = new Line(obj_aux.p1, obj_aux.p2);
        p.setColor(obj_aux.color);
        p.draw(getCanvas());
        canvas_obj['lines'][i] = p;
    }
    for (var i=0; i<canvas_obj['polylines'].length; i++){
        var obj_aux = canvas_obj['polylines'][i];
        var p = new Polyline(obj_aux.arrayPoints);
        p.setColor(obj_aux.color);
        p.draw(getCanvas());
        canvas_obj['polylines'][i] = p;
    }
    for (var i=0; i<canvas_obj['polygons'].length; i++){
        var obj_aux = canvas_obj['polygons'][i];
        var p = new Polygon(obj_aux.arrayPoints);
        p.setColor(obj_aux.color);
        p.draw(getCanvas());
        canvas_obj['polygons'][i] = p;
    }
}

/******************************* Elementos geométricos   ***********************************************************/
var Point = function(x, y){
    this.x = x;
    this.y = y;
    this.color = "black";

    this.setColor = function(color="black"){
        this.color = color;
    };

    this.isSelected = function(selected){
        if(selected)
            this.setColor("red");
        else
            this.setColor();
    };

    this.draw = function(canvas){
        var context = canvas.getContext('2d');
        context.fillStyle = this.color;
        context.fillRect(this.x,this.y,2,2);
    };

    this.translate = function(dx, dy){
        this.x += dx;
        this.y += dy;
    }

    this.scale = function(Sx, Sy){
        var xO = this.x;
        var yO = this.y;
        this.translate(-xO, -yO);
        this.x *= Sx;
        this.y *= Sy;
        this.translate(xO, yO);
    }

    this.rotate = function(point, angle){
        this.translate(-point.x, -point.y);
        this.x = this.x*Math.cos(angle) - this.y*Math.sin(angle);
        this.y = this.x*Math.sin(angle) + this.y*Math.cos(angle);
        this.translate(point.x, point.y);
    }

    this.mirror = function(p1, p2){
        var dx, dy, u, v;
        var x2 ,y2;

        dx  = (p2.x - p1.x);
        dy  = (p2.y - p1.y);

        u   = (dx * dx - dy * dy) / (dx * dx + dy*dy);
        v   = 2 * dx * dy / (dx*dx + dy*dy);

        x2  = Math.round(u * (this.x - p1.x) + v*(this.y - p1.y) + p1.x); 
        y2  = Math.round(v * (this.x - p1.x) - u*(this.y - p1.y) + p1.y);

        this.x = x2;
        this.y = y2;
    }

};

var Line = function(p1, p2){
    this.p1 = p1;
    this.p2 = p2;
    this.color = "black";
    
    this.setColor = function(color="black"){
        this.color = color;
    };

    this.isSelected = function(selected){
        if(selected)
            this.setColor("red");
        else
            this.setColor();
    };

    this.draw = function(canvas){
        var context = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(this.p1.x, this.p1.y);
        context.lineTo(this.p2.x, this.p2.y);
        context.strokeStyle = this.color;
        context.stroke();
    };

    this.translate = function(dx, dy){
        this.p1.x += dx;
        this.p1.y += dy;
        this.p2.x += dx;
        this.p2.y += dy;
    }

    this.scale = function(Sx, Sy){
        var Xm = (this.p1.x + this.p2.x)/2;
        var Ym = (this.p1.y + this.p2.y)/2;
        this.translate(-Xm, -Ym);
        this.p1.x *= Sx;
        this.p1.y *= Sy;
        this.p2.x *= Sx;
        this.p2.y *= Sy;
        this.translate(Xm, Ym);

    }

    this.rotate = function(point, angle){
        this.translate(-point.x, -point.y);
        this.p1.x = this.p1.x*Math.cos(angle) - this.p1.y*Math.sin(angle);
        this.p1.y = this.p1.x*Math.sin(angle) + this.p1.y*Math.cos(angle);
        this.p2.x = this.p2.x*Math.cos(angle) - this.p2.y*Math.sin(angle);
        this.p2.y = this.p2.x*Math.sin(angle) + this.p2.y*Math.cos(angle);
        this.translate(point.x, point.y);
    }

    this.mirror = function(p1, p2){
        this.p1.mirror(p1, p2);
        this.p2.mirror(p1,p2);
    }

};

var Polyline = function(arrayPoints=[]){
    this.arrayPoints = arrayPoints;
    this.color = "black";
    this.arrayLines = [];

    this.setColor = function(color="black"){
        this.color = color;
    };

    this.isSelected = function(selected){
        if(selected)
            this.setColor("red");
        else
            this.setColor();
    };

    this.addPoints = function(point){
        this.arrayPoints.push(point);
    };

    this.setArraylines = function(arrayPoints){
        var aux = [];
        var p1 = arrayPoints[0];
        for(var i = 1; i< arrayPoints.length; i++){
            aux.push(new Line(p1, arrayPoints[i]));
            p1 = arrayPoints[i];
        }
        this.arrayLines = aux;
    }

    this.draw = function(canvas){
        var context = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(this.arrayPoints[0].x, this.arrayPoints[0].y);
        for(var i = 1; i<arrayPoints.length; i++){
            context.lineTo(this.arrayPoints[i].x, this.arrayPoints[i].y);
        }
        context.strokeStyle = this.color;
        context.stroke();
        this.setArraylines(arrayPoints);
    };

    this.translate = function(dx, dy){
        for(var i = 0; i<this.arrayPoints.length; i++){
            this.arrayPoints[i].x += dx;
            this.arrayPoints[i].y += dy;
        }
    }

    this.scale = function(Sx, Sy){
        var centroid = {};
        centroid.x = centroid.y = 0;
        for(var i = 0; i < this.arrayPoints.length; i++){
            centroid.x += arrayPoints[i].x/arrayPoints.length;
            centroid.y += arrayPoints[i].y/arrayPoints.length;
        }
        this.translate(-centroid.x, -centroid.y);
        for(var i = 0; i < this.arrayPoints.length; i++){
            arrayPoints[i].x *= Sx;
            arrayPoints[i].y *= Sy;
        }
        this.translate(centroid.x, centroid.y);
    }

    this.rotate = function(point, angle){
        this.translate(-point.x, -point.y);
        for(var i = 0; i < this.arrayPoints.length; i++){
            arrayPoints[i].x = arrayPoints[i].x*Math.cos(angle) - arrayPoints[i].y*Math.sin(angle);
            arrayPoints[i].y = arrayPoints[i].x*Math.sin(angle) + this.arrayPoints[i].y*Math.cos(angle);
        }
        this.translate(point.x, point.y);
    }

    this.mirror = function(p1, p2){
        for(var i = 0; i < this.arrayPoints.length; i++){
            this.arrayPoints[i].mirror(p1, p2);
        }
    }

};

var Polygon = function(arrayPoints=[]){
    Polyline.call(this, arrayPoints);
    
    //funcoes especificas do poligono
    this.draw = function(canvas){
        var context = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(this.arrayPoints[0].x, this.arrayPoints[0].y);
        for(var i = 1; i<arrayPoints.length; i++){
            context.lineTo(this.arrayPoints[i].x, this.arrayPoints[i].y);
        }
        context.lineTo(this.arrayPoints[0].x, this.arrayPoints[0].y);
        context.strokeStyle = this.color;
        context.stroke();
        this.setArraylines(arrayPoints);
    };
};
Polygon.prototype = Object.create(Polyline.prototype);
Polygon.prototype.constructor = Polygon;

/************************** Funções para desenhar os objetos na tela **********************************************/
function drawPoint(){
    reloadCanvas();
    var canvas = getCanvasAux();
    
    var printPoint = function(e){
        var mousePos = getMousePos(canvas, e);
        console.log(mousePos);
        var p = new Point(mousePos.x, mousePos.y);
        p.draw(canvas);
        canvas_obj.points.push(p);
    }

    canvas.addEventListener('mousedown', printPoint, false);
    canvas.removeEventListener('mousedown', printPoint,true);
    
}

function drawLine(){
    reloadCanvas();
    var canvas = getCanvasAux();
    var context = canvas.getContext('2d');
    var init;
    var p1, p2;

    var initLine = function(evt){
        var mousePos = getMousePos(canvas, evt);
        p1 = new Point(mousePos.x, mousePos.y);
        init = true;
    }

    var printLine = function(evt){
        if(!init) return;   
        context.clearRect(0, 0, canvas.width, canvas.height);
        var mousePos = getMousePos(canvas, evt);
        context.beginPath();
        context.moveTo(p1.x, p1.y);
        context.lineTo(mousePos.x, mousePos.y);
        context.stroke();
    }

    var saveLine = function(evt){
        evt.stopPropagation();
        var mousePos = getMousePos(canvas, evt);
        p2 = new Point(mousePos.x, mousePos.y);
        var line = new Line(p1,p2);
        canvas_obj['lines'].push(line);
        init = false;
        reloadCanvas(refresh=true);
    }

    canvas.addEventListener("mousedown", initLine, false);
    canvas.addEventListener("mousemove", printLine, false);
    canvas.addEventListener("mouseup", saveLine, false);    
    
}

function drawPolyline(){
    reloadCanvas();
    var canvas = getCanvasAux();
    var context = canvas.getContext('2d');
    var arrayPoints = []; //guarda pontos para o desenho
    var points = []; // guarda os pontos para criar o objeto Polyline

    this.printLine = function(arrayPoints){
        context.beginPath();
        context.moveTo(arrayPoints[0].x, arrayPoints[0].y);
        context.lineTo(arrayPoints[1].x, arrayPoints[1].y);
        context.stroke();
    };

    this.saveObject = function(){
        if(pickPoint(arrayPoints[0], points[points.length-1])){
            var polyline = new Polyline(points);
            canvas_obj['polylines'].push(polyline);
            arrayPoints = [];
            points = [];
            reloadCanvas(refresh=true);
        }
    }

    this.printObject = function(evt){
        var mousePos = getMousePos(canvas, evt);
        var point = new Point(mousePos.x, mousePos.y);
        arrayPoints.push(point);
        if(arrayPoints.length == 2){
            printLine(arrayPoints);
            points.push(arrayPoints.shift());
            saveObject();
        }
        console.log(points);
    }

    canvas.addEventListener("mousedown", printObject, false);
}

function drawPolygon(){
    reloadCanvas();
    var canvas = getCanvasAux();
    var context = canvas.getContext('2d');
    var arrayPoints = []; //guarda pontos para o desenho
    var points = []; // guarda os pontos para criar o objeto Polyline

    var printLine = function(arrayPoints){
        context.beginPath();
        context.moveTo(arrayPoints[0].x, arrayPoints[0].y);
        context.lineTo(arrayPoints[1].x, arrayPoints[1].y);
        context.stroke();
    };

    var saveObject = function(){
        var polygon = new Polygon(points);
        canvas_obj['polygons'].push(polygon);
        arrayPoints = [];
        points = [];
        reloadCanvas(refresh=true);
    }

    var printObject = function(evt){
        var mousePos = getMousePos(canvas, evt);
        var point = new Point(mousePos.x, mousePos.y);
        arrayPoints.push(point);
        if(arrayPoints.length == 2){
            if(points.length > 0 && pickPoint(points[0], mousePos)){
                points.push(arrayPoints.shift());
                printLine([points[points.length-1], points[0]]);
                saveObject();
                points = [];
            }
            else{
                printLine(arrayPoints);
                points.push(arrayPoints.shift()); 
            }
        }
        //console.log(points);
    }

    canvas.addEventListener("mousedown", printObject, false);
}


/********************************* Picks de objetos *************************************/
//Pick de ponto
function pickPoint(target, myPoint){ 
    var T = 10;

    if (target === undefined || myPoint === undefined) return false;

    if(myPoint.x  <= target.x + T && myPoint.y  <= target.y + T){
        if( myPoint.x  >= target.x - T && myPoint.y >= target.y - T){
            return true;
        }
    }

    return false;
}

//Pick de reta
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
  
  x1 = line.p1.x;
  y1 = line.p1.y;
  x2 = line.p2.x;
  y2 = line.p2.y;
  
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

//Pick de area pela soma dos angulos
function pickAreaAngle(point, poligono){
    var soma = 0;
    var lines = [];
    
    
    for(var i = 0; i < poligono.arrayPoints.length; i++){
        var v = [poligono.arrayPoints[i].x - point.x , poligono.arrayPoints[i].y - point.y];
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

    
    return (soma >= 2*Math.PI);
}

//Seleção de objetos
function selectionObj(someFunction){
    reloadCanvas();
    var canvas = getCanvasAux();
    
    function select(evt){
        var mousePos = getMousePos(canvas, evt);
        for (var i=0; i< canvas_obj['points'].length; i++){ //verifica pontos
            if(pickPoint(canvas_obj['points'][i], mousePos)){
                //canvas_obj['points'][i].isSelected(true);
                someFunction(canvas_obj['points'][i]);
            }
        }
        for (var i=0; i<canvas_obj['lines'].length; i++){ //verifica linhas
                if(pickLine(canvas_obj['lines'][i], mousePos)){
                  //  canvas_obj['lines'][i].isSelected(true);
                    someFunction(canvas_obj['lines'][i]);
                    //canvas_obj['lines'][i].isSelected(false);
                }
        }
        for (var i=0; i<canvas_obj['polylines'].length; i++){ //verifica polylines
            for(var j=0; j<canvas_obj['polylines'][i].arrayLines.length; j++){
                var line = canvas_obj['polylines'][i].arrayLines[j];
                if(pickLine(line,mousePos)){
                    //canvas_obj['polylines'][i].isSelected(true);
                    someFunction(canvas_obj['polylines'][i]);
                    //canvas_obj['polylines'][i].isSelected(false);
                }
            }

        }
        for (var i=0; i<canvas_obj['polygons'].length; i++){ //verifica poligonos
                if(pickAreaAngle(mousePos, canvas_obj['polygons'][i])){
                    //canvas_obj['polygons'][i].isSelected(true);
                    someFunction(canvas_obj['polygons'][i]);
                    //canvas_obj['polygons'][i].isSelected(false);
                }
        }
        
    }
    canvas.addEventListener('mousedown',select, false);
}

/****************** Transformações geométricas **********/
//Translação estilo DRAG-AND-DROP
function translateObj(obj){
    reloadCanvas();
    var canvas = getCanvasAux();
    var context = canvas.getContext('2d');
    var origClick;
    
    var clickObj = function(e){
        origClick = getMousePos(canvas, e);
    }
    
    var moveObj = function(e){
            context.clearRect(0, 0, canvas.width, canvas.height);
            var mousePos = getMousePos(canvas, e);
            X = mousePos.x - origClick.x;
            Y = mousePos.y - origClick.y;
            origClick = mousePos;
            obj.translate(X, Y);
            obj.draw(canvas);
    }

    var leaveObj = function (e){
            obj.draw(canvas);
            reloadCanvas();
           
    }
    this.addEventListener("mousedown", clickObj, false);
    canvas.addEventListener("mousemove", moveObj, false);
    canvas.addEventListener("mouseup", leaveObj, false);
}

//Escala
function scaleObj(obj){
    reloadCanvas();
    var canvas = getCanvasAux();
    var context = canvas.getContext('2d');
    
    var scaling = function(e){
        if(e.deltaY < 0){
            context.clearRect(0, 0, canvas.width, canvas.height);
            var Sx = 1.1;
            var Sy = 1.1;
            obj.scale(Sx, Sy);
        }
        else if (e.deltaY > 0){
            context.clearRect(0, 0, canvas.width, canvas.height);
            var Sx = 0.9;
            var Sy = 0.9;
            obj.scale(Sx, Sy);
        }
        obj.draw(canvas);
        reloadCanvas(refresh=true);
    }

    canvas.addEventListener("wheel", scaling, false);
}

//Rotação
function rotateObj(obj){
    reloadCanvas();
    var canvas = getCanvasAux();
    var context = canvas.getContext('2d');
    var pointOfReference;

    var getAngle = function(degrees){
        return  degrees*(Math.PI/180);
    }

    var getPoint = function(e){
        console.log("oi");
        var mousePos = getMousePos(canvas, e);
        pointOfReference = new Point(mousePos.x, mousePos.y);
        pointOfReference.draw(canvas);

    }
    var rotating = function(e){
        var angle = 2;
        if(e.deltaY < 0){
            context.clearRect(0, 0, canvas.width, canvas.height);
            obj.rotate(pointOfReference, getAngle(angle));
        }
        else if (e.deltaY > 0){
            context.clearRect(0, 0, canvas.width, canvas.height);
            obj.rotate(pointOfReference, (-1)*getAngle(angle));
        }

        obj.draw(canvas);
        reloadCanvas(refresh=true);

    }

    canvas.addEventListener("mousedown", getPoint, false);
    canvas.addEventListener("wheel", rotating, false);
}

//Espelhamento
function mirrorObj(obj){
    reloadCanvas();
    var canvas = getCanvasAux();
    var context = canvas.getContext('2d');
    var points = [];
    var lineOfReference;
    
    var getLine = function(e){
        var mousePos = getMousePos(canvas, e);
        points.push(mousePos);
        if(points.length >= 2){
            lineOfReference = new Line(points[0], points[1]);
            lineOfReference.draw(canvas);
        }
    }

    var getAngleOfReference = function(line){
        var xAxis = new Point(1, 0);
        var vetLine = new Point(line.p2.x - line.p1.x, line.p2.y - line.p1.y);

        var cosAng = (vetLine.x * xAxis.x ) / (Math.sqrt(Math.pow(vetLine.x,2) + Math.pow(vetLine.y,2)) * Math.sqrt(Math.pow(xAxis.x,2)));
        
        return Math.acos(cosAng);

    }

    var mirroring = function(e){
        var Mx, My;
        if(e.deltaY < 0 || e.deltaY > 0){
            context.clearRect(0, 0, canvas.width, canvas.height);
            Mx = 1;
            My = -1;
            obj.mirror(lineOfReference.p1, lineOfReference.p2);//, getAngleOfReference(lineOfReference), Mx, My);
        }
        obj.draw(canvas);
        reloadCanvas(refresh=true);
    }
    canvas.addEventListener("mousedown", getLine, false);
    canvas.addEventListener("wheel", mirroring, false);
}

//Deletar Objeto
function deleteObj(obj){
    reloadCanvas();
    var canvas = getCanvasAux();
    var context = canvas.getContext('2d');
    var className = obj.constructor.name.toLowerCase()+"s";

    var searchObj = function(obj){
        for(var i = 0; i<canvas_obj[className].length; i++)
            if(canvas_obj[className][i] === obj){
                canvas_obj[className].splice(i, 1);
                break;
            }
    };

    var deleting = function(e){
        if(confirm("Deseja deletar o objeto?")){
            searchObj(obj);
            reloadCanvas(refresh=true);
        }
    };
    
    return deleting();
}