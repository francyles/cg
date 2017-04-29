class ConvexHull {
	constructor(arrayPoints){
		this.inputPoints = arrayPoints;
		this.hullPoints = undefined;
	}

	getHullPoints(){
		if(this.hullPoints === undefined){
			var maxX = this.getMaxXPoint();
			var minX = this.getMinXPoint();

			var a = this.quickHull(this.inputPoints, minX, maxX);
			var b = this.quickHull(this.inputPoints, maxX, minX);
			
			this.hullPoints = a.concat(b.filter(function (item) {
								    return a.indexOf(item) < 0;
								}));
		}

		return this.hullPoints;
	}

	getMaxXPoint(){
		var max = this.inputPoints[0];
		for(var i = 1; i < this.inputPoints.length; i++){
			if(this.inputPoints[i].x > max.x){
				max = this.inputPoints[i];
			}
		}

		return max;
	}

	getMinXPoint(){
		var min = this.inputPoints[0];
		for(var i = 1; i < this.inputPoints.length; i++){
			if(this.inputPoints[i].x < min.x){
				min = this.inputPoints[i];
			}
		}

		return min;
	}

	calculateDistanceIndicator(start, end, point){
		var vetLine = {
			x: end.x - start.x,
			y: end.y - start.y
		};

		var vetPoint = {
			x: point.x - start.x,
			y: point.y - start.y
		}

		return ((vetPoint.y * vetLine.x) - (vetPoint.x * vetLine.y));
	}

	getPointDistanceIndicators(start, end, points){
		var pointDistanceSet = [];

		for(var i = 0; i < points.length; i++){
			var distance = this.calculateDistanceIndicator(start, end, points[i]);
			if(distance > 0){
				pointDistanceSet.push({
					point: points[i],
					distance: distance
				});
			}	
			else{
				continue;
			}
		}
		return pointDistanceSet;
	}

	getMaxPointFromLine(pointDistanceSet){
		var maxDistance = 0;
		var maxPoint = undefined;

		for(var i = 0; i < pointDistanceSet.length; i++){
			var curPoint = pointDistanceSet[i];
			if(curPoint.distance > maxDistance){
				maxDistance = curPoint.distance;
				maxPoint = curPoint.point;
			}
		}

		return maxPoint;
	}

	getPointsFromDistanceSet(pointDistanceSet){
		var points = [];

		for(var i = 0; i < pointDistanceSet.length; i++){
			points.push(pointDistanceSet[i].point);
		}

		return points;
	}

	quickHull(points, start, end){
		var pointsLeftOfLine = this.getPointDistanceIndicators(start, end, points);
		var newMaxPoint = this.getMaxPointFromLine(pointsLeftOfLine);

		if(newMaxPoint === undefined){
			return Array(end);
		}

		var newPoints = this.getPointsFromDistanceSet(pointsLeftOfLine);
		var a = this.quickHull(newPoints, start, newMaxPoint);
		var b = this.quickHull(newPoints, newMaxPoint, end);
		
		return a.concat(b.filter(
			function (item) {
				return a.indexOf(item) < 0;
			}));
	}
}

// var v = new Array({x: 1, y: 1}, {x: 1, y: 2}, {x: 2, y: 1}, {x: 3, y: 3});
//console.log(v);
function getConvexHull(){
	if (allPoints.length == 0){
		alert("Nenhum objeto selecionado!");
		return false;
	}

	var convexHull = new ConvexHull(allPoints);
	console.log(convexHull.getHullPoints());
	var hull = new Polygon(convexHull.getHullPoints());
	hull.setColor("blue");
	hull.draw(getCanvasAux());
	allPoints = []

	for (var i=0; i<canvas_obj['points'].length; i++){
        canvas_obj['points'][i].setColor();
    }
    for (var i=0; i<canvas_obj['lines'].length; i++){
        canvas_obj['lines'][i].setColor();
    }
    for (var i=0; i<canvas_obj['polylines'].length; i++){
        canvas_obj['polylines'][i].setColor();
    }
    for (var i=0; i<canvas_obj['polygons'].length; i++){
        canvas_obj['polygons'][i].setColor();
    }
}

