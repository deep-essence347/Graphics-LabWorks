function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
	background(220);

	var cuboid = [
		[50, 50, 150, 1],
		[50, 150, 150, 1],
		[150, 150, 150, 1],
		[150, 50, 150, 1],
		[50, 50, 50, 1],
		[150, 50, 50, 1],
		[150, 150, 50, 1],
		[50, 150, 50, 1],
	];

	var pyramid = [
		[0, 100, 0, 1],
		[100, 100, 0, 1],
		[100, 100, 100, 1],
		[0, 100, 100, 1],
		[50, 0, 50, 1],
	];

	// let t = new Translation(pyramid, [-80, -130, 60]);
	// t.performTranslation();

	// let r = new Rotation(cuboid, "y", 50);
	// r.performRotation();

	// let s = new Scale(pyramid, [1.8, 2.0, 1.2]);
	// s.performScaling();

	noLoop();
}

/**
 *
 * @param {Array<Array<Number>>} a m*n matrix
 * @param {Array<Numer>} b n*1 matrix
 * @returns Product of the matrices (m*1)
 */
function multiplyMatrices(a, b) {
	let result = new Array(a.length);
	if (a[0].length == b.length) {
		for (let i = 0; i < a.length; i++) {
			result[i] = new Array(1);
			for (let j = 0; j < 1; j++) {
				result[i][j] = 0;
				for (let k = 0; k < a[0].length; k++) {
					result[i][j] += a[i][k] * b[k];
				}
			}
		}
	} else {
		print("The matrices cannot be multiplied.");
	}
	return result;
}

/**
 *
 * @param {Array<Array<Number>>} t_mat m*4 Transformation Matrix
 * @param {Array<Array<Number>>} a 4*4 Matrix to be transformed
 * @returns m*3 Transformed matrix
 */
function transformShape(t_mat, a) {
	let transformedMatrix = [];
	a.forEach((e) => {
		let newRow = multiplyMatrices(t_mat, e);
		transformedMatrix.push(newRow);
	});
	return transformedMatrix;
}

class Shapes {
	constructor() {
		// this.writeLegend();
	}

	cuboid(coordinateMatrix) {
		let a = coordinateMatrix;
		noFill();
		beginShape();
		vertex(a[0][0], a[0][1], a[0][2]);
		vertex(a[1][0], a[1][1], a[1][2]);
		vertex(a[2][0], a[2][1], a[2][2]);
		vertex(a[3][0], a[3][1], a[3][2]);
		vertex(a[0][0], a[0][1], a[0][2]);
		vertex(a[4][0], a[4][1], a[4][2]);
		vertex(a[5][0], a[5][1], a[5][2]);
		vertex(a[3][0], a[3][1], a[3][2]);
		vertex(a[5][0], a[5][1], a[5][2]);
		vertex(a[6][0], a[6][1], a[6][2]);
		vertex(a[2][0], a[2][1], a[2][2]);
		vertex(a[6][0], a[6][1], a[6][2]);
		vertex(a[7][0], a[7][1], a[7][2]);
		vertex(a[1][0], a[1][1], a[1][2]);
		vertex(a[7][0], a[7][1], a[7][2]);
		vertex(a[4][0], a[4][1], a[4][2]);
		endShape(CLOSE);
	}

	pyramid(coordinateMatrix) {
		let a = coordinateMatrix;
		noFill();
		beginShape();
		vertex(a[0][0], a[0][1], a[0][2]);
		vertex(a[1][0], a[1][1], a[1][2]);
		vertex(a[4][0], a[4][1], a[4][2]);
		vertex(a[1][0], a[1][1], a[1][2]);
		vertex(a[2][0], a[2][1], a[2][2]);
		vertex(a[4][0], a[4][1], a[4][2]);
		vertex(a[2][0], a[2][1], a[2][2]);
		vertex(a[3][0], a[3][1], a[3][2]);
		vertex(a[4][0], a[4][1], a[4][2]);
		vertex(a[3][0], a[3][1], a[3][2]);
		vertex(a[0][0], a[0][1], a[0][2]);
		vertex(a[4][0], a[4][1], a[4][2]);
		endShape();
	}

	writeText(value, x, y) {
		textSize(16);
		noStroke();
		fill("black");
		textFont(inconsolate);
		text(value, x, y);
	}

	drawvertex(color, x, y) {
		stroke(color);
		strokeWeight(100);
		vertex(x, y);
	}

	writeLegend() {
		this.drawvertex("black", 400, 400);
		this.writeText("Original 2D Shape", 415, 405);
		this.drawvertex("red", 400, 40);
		this.writeText("Transformed 2D Shape", 415, 435);
	}
}

class Translation extends Shapes {
	constructor(coordinateMatrix, translationFactor) {
		super();
		this.coordinateMatrix = coordinateMatrix;
		this.tf = translationFactor;
	}

	performTranslation() {
		this.initial();
		this.final();
	}

	drawShape(mat, isTransformed) {
		if (isTransformed) stroke("red");
		else stroke("black");
		this.pyramid(mat);
	}

	initial() {
		this.drawShape(this.coordinateMatrix);
		this.translation_mat = [
			[1, 0, 0, this.tf[0]],
			[0, 1, 0, this.tf[1]],
			[0, 0, 1, this.tf[2]],
			[0, 0, 0, 1],
		];
	}

	final() {
		let translatedCoordinates = transformShape(
			this.translation_mat,
			this.coordinateMatrix
		);
		this.drawShape(translatedCoordinates, true);
	}
}

class Rotation extends Shapes {
	constructor(coordinateMatrix, rotationAxis, rotationAngle) {
		super();
		this.coordinateMatrix = coordinateMatrix;
		this.axis = rotationAxis;
		this.angle = radians(rotationAngle);
	}

	performRotation() {
		this.initial();
		this.final();
	}

	drawShape(mat, isTransformed) {
		if (isTransformed) stroke("red");
		else stroke("black");
		this.cuboid(mat);
	}

	initial() {
		this.drawShape(this.coordinateMatrix);
		switch (this.axis) {
			case "y":
				this.rotation_mat = [
					[cos(this.angle), 0, sin(this.angle), 0],
					[0, 1, 0, 0],
					[-sin(this.angle), 0, cos(this.angle), 0],
					[0, 0, 0, 1],
				];
				break;

			case "z":
				this.rotation_mat = [
					[cos(this.angle), -sin(this.angle), 0, 0],
					[sin(this.angle), cos(this.angle), 0, 0],
					[0, 0, 1, 0],
					[0, 0, 0, 1],
				];
				break;

			default:
				this.rotation_mat = [
					[1, 0, 0, 0],
					[0, cos(this.angle), -sin(this.angle), 0],
					[0, sin(this.angle), cos(this.angle), 0],
					[0, 0, 0, 1],
				];
				break;
		}
	}

	final() {
		let rotatedCoordinates = transformShape(
			this.rotation_mat,
			this.coordinateMatrix
		);
		translate(0, -120, 0);
		this.drawShape(rotatedCoordinates, true);
	}
}

class Scale extends Shapes {
	constructor(coordinateMatrix, scalingFactor) {
		super();
		this.coordinateMatrix = coordinateMatrix;
		this.sf = scalingFactor;
	}

	performScaling() {
		this.initial();
		this.final();
	}

	drawShape(mat, isTransformed) {
		if (isTransformed) stroke("red");
		else stroke("black");
		this.pyramid(mat);
	}

	initial() {
		this.drawShape(this.coordinateMatrix);
		this.scaling_mat = [
			[this.sf[0], 0, 0, 0],
			[0, this.sf[1], 0, 0],
			[0, 0, this.sf[2], 0],
			[0, 0, 0, 1],
		];
	}

	final() {
		let scaledCoordinates = transformShape(
			this.scaling_mat,
			this.coordinateMatrix
		);
		this.drawShape(scaledCoordinates, true);
	}
}
