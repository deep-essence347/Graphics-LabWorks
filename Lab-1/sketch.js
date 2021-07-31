function setup() {
	createCanvas(windowWidth, windowHeight);
	var r1 = new MyResolution();
	myScreenResolution();
}

function draw() {
	background(220);
	drawFlag();
}

class MyResolution {
	/** Prints the resolution of the display. */
	myScreenResolution() {
		print("Resolution: " + displayWidth + " * " + displayHeight);
	}
}

function drawFlag() {
	drawLayout();
	drawMoon();
	drawSun();
}

/** Draws the overall color-filled layout of the flag with border stroke.*/
function drawLayout() {
	fill(220, 20, 60);
	strokeWeight(8);
	stroke(0, 56, 147);
	strokeJoin(MITER);
	beginShape();
	vertex(30, 30);
	vertex(350, 250);
	vertex(140, 250);
	vertex(330, 460);
	vertex(30, 460);
	endShape(CLOSE);
}

/** Draws a moon at the upper half triangle of  the flag. */
function drawMoon() {
	fill(255, 255, 255);
	noStroke();
	beginShape();
	vertex(175, 175);
	bezierVertex(150, 230, 60, 200, 55, 175);
	bezierVertex(70, 250, 150, 250, 170, 193);
	vertex(175, 175);
	endShape(CLOSE);
	beginShape();
	drawSharpEdges(115, 189, 20, 30, 9, radians(-45), radians(270 - 45));
	endShape(CLOSE);
}

/** Draws a sun at the lower half triangle of  the flag. */
function drawSun() {
	fill(255, 255, 255);
	beginShape();
	drawSharpEdges(115, 350, 35, 55, 12);
	endShape(CLOSE);
}

/**
 *
 * @param {Number} x -Starting x co-ordinate
 * @param {Number} y Starting y co-ordinate
 * @param {Number} innerRadius Radius of Inner edges
 * @param {Number} outerRadius Radius of Outer edges
 * @param {Number} count Number of edges
 * @param {Radian} startAngle The angle to start drawing the edges from
 * @param {Radian} endAngle The angle to stop drawing the edges at
 */
function drawSharpEdges(
	x,
	y,
	innerRadius,
	outerRadius,
	count,
	startAngle,
	endAngle
) {
	if (!(startAngle || endAngle)) {
		startAngle = 0;
		endAngle = radians(360);
	}

	var angle = (endAngle - startAngle) / count;
	var halved = angle / 2;

	for (var i = endAngle; i >= startAngle; i -= angle) {
		var x1 = x - cos(i + halved) * innerRadius;
		var y1 = y - sin(i + halved) * innerRadius;
		vertex(x1, y1);
		var x2 = x - cos(i) * outerRadius;
		var y2 = y - sin(i) * outerRadius;
		vertex(x2, y2);
	}
}
