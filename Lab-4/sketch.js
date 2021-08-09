function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	background(220);

	// ?Mark only one function at a time as uncommented
	// translation();
	// rotation();
	// scaling();
	// reflection();
	// shear();
}

function translation() {
	let t = new Translation();
	t.performTranslation();
}

function rotation() {
	let r = new Rotation();
	r.performRotation();
}

function scaling() {
	let s = new Scale();
	s.performScaling();
}

function reflection() {
	let r = new Reflection("xy");
	r.performReflection();
}

function shear() {
	let s = new Shear("x");
	s.performShear();
}

/**
 *
 * @param {Array<Array<Number>>} a
 * @param {Array<Numer>} b
 * @returns Product of the matrices
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
 * @param {Array<Array<Number>>} t_mat Transformation Matrix
 * @param {Array<Array<Number>>} a Matrix to be transformed
 * @returns Transformed matrix
 */
function transformShape(t_mat, a) {
	let transformedCoordinates = [];
	a.forEach((e) => {
		let newRow = multiplyMatrices(t_mat, e);
		transformedCoordinates.push(newRow);
	});
	return transformedCoordinates;
}

class Shapes {
	/**
	 *
	 * @param {Array} a Matrix with row length 2
	 */
	drawLine(a) {
		if (a.length < 2) {
			print("Matrix length is not valid to draw a line");
			return false;
		}
		strokeWeight(3);
		beginShape();
		vertex(a[0][0], a[0][1]);
		vertex(a[1][0], a[1][1]);
		endShape();
	}

	/**
	 *
	 * @param {Array} a Matrix with row Length 3
	 */
	drawTriangle(a) {
		if (a.length < 3) {
			print("Matrix length is not valid to draw a triangle");
			return;
		}
		strokeWeight(3);
		noFill();
		beginShape();
		vertex(a[0][0], a[0][1]);
		vertex(a[1][0], a[1][1]);
		vertex(a[2][0], a[2][1]);
		endShape(CLOSE);
	}

	/**
	 *
	 * @param {Array} a Matrix with row length 4
	 */
	drawQuad(a) {
		if (a.length < 4) {
			print("Matrix length is not valid to draw a rectangle");
			return;
		}
		noFill();
		strokeWeight(3);
		beginShape();
		vertex(a[0][0], a[0][1]);
		vertex(a[1][0], a[1][1]);
		vertex(a[2][0], a[2][1]);
		vertex(a[3][0], a[3][1]);
		endShape(CLOSE);
	}
}

class Translation extends Shapes {
	constructor() {
		super();
		this.mat = [
			[40, 40, 1],
			[100, 40, 1],
			[140, 200, 1],
		];
		this.tf = [100, 200];
	}

	performTranslation() {
		this.initial();
		this.final();
	}

	drawShape(mat, isTransformed) {
		if (isTransformed) stroke("red");
		else stroke("black");
		this.drawTriangle(mat);
	}

	initial() {
		this.drawShape(this.mat);
		this.translation_mat = [
			[1, 0, this.tf[0]],
			[0, 1, this.tf[1]],
			[0, 0, 1],
		];
	}

	final() {
		let translatedCoordinates = transformShape(this.translation_mat, this.mat);
		this.drawShape(translatedCoordinates, true);
	}
}

class Rotation extends Shapes {
	constructor() {
		super();
		this.mat = [
			[40, 40, 1],
			[220, 40, 1],
			[220, 200, 1],
			[40, 200, 1],
		];
		this.angle = radians(40);
	}

	performRotation() {
		this.initial();
		this.final();
	}

	drawShape(mat, isTransformed) {
		if (isTransformed) stroke("red");
		else stroke("black");
		this.drawQuad(mat);
	}

	initial() {
		this.drawShape(this.mat);
		this.translation_mat = [
			[cos(this.angle), -sin(this.angle), 0],
			[sin(this.angle), cos(this.angle), 0],
			[0, 0, 1],
		];
	}

	final() {
		let rotatedCoordinates = transformShape(this.translation_mat, this.mat);
		translate(150, 200);
		this.drawShape(rotatedCoordinates, true);
	}
}

class Scale extends Shapes {
	constructor() {
		super();
		this.mat = [
			[40, 40, 1],
			[100, 40, 1],
			[140, 200, 1],
		];
		this.sf = [2, 1.5];
	}

	performScaling() {
		this.initial();
		this.final();
	}

	drawShape(mat, isTransformed) {
		if (isTransformed) stroke("red");
		else stroke("black");
		this.drawTriangle(mat);
	}

	initial() {
		this.drawShape(this.mat);
		this.scaling_mat = [
			[this.sf[0], 0, 0],
			[0, this.sf[0], 0],
			[0, 0, 1],
		];
	}

	final() {
		let scaledCoordinates = transformShape(this.scaling_mat, this.mat);
		this.drawShape(scaledCoordinates, true);
	}
}

class Reflection extends Shapes {
	/**
	 *
	 * @param {String} reflectionAxis `x` for `X-Axis`, `y` for `Y-Axis`, `o` for `Origin`, `xy` for `x=y`
	 */
	constructor(reflectionAxis) {
		super();
		this.mat = [
			[500, 350, 1],
			[360, 280, 1],
		];
		this.axis = [250, 250, 0];
		this.reflectionAxis = reflectionAxis;
	}

	performReflection() {
		this.initial();
		this.final();
	}

	drawShape(mat, isTransformed) {
		if (isTransformed) stroke("red");
		else stroke("black");
		this.drawLine(mat);
	}

	initial() {
		this.drawShape(this.mat);
		let reflectionMat = [];
		let tf = [this.mat[0][0], this.mat[0][1]];
		switch (this.reflectionAxis) {
			case "x":
				reflectionMat = [
					[1, 0, 0],
					[0, -1, 0],
					[0, 0, 1],
				];
				tf = [0, tf[1] + 150];
				break;
			case "y":
				reflectionMat = [
					[-1, 0, 0],
					[0, 1, 0],
					[0, 0, 1],
				];
				tf = [tf[0] + 150, 0];

				break;
			case "xy":
				reflectionMat = [
					[0, 1, 0],
					[1, 0, 0],
					[0, 0, 1],
				];
				tf = [0, 0];
				break;
			default:
				reflectionMat = [
					[-1, 0, 0],
					[0, -1, 0],
					[0, 0, 1],
				];
				tf = [tf[0] + 150, tf[1] + 150];
				break;
		}
		this.ref_mat = reflectionMat;
		this.tf = tf;
	}

	final() {
		let reflectedCoordinates = transformShape(this.ref_mat, this.mat);
		translate(this.tf[0], this.tf[1]);
		this.drawShape(reflectedCoordinates, true);
	}
}

class Shear extends Shapes {
	constructor(shearAxis) {
		super();
		this.mat = [
			[40, 40, 1],
			[220, 40, 1],
			[220, 200, 1],
			[40, 200, 1],
		];
		this.sh = [radians(30), radians(50)];
		this.shearAxis = shearAxis;
	}

	performShear() {
		this.initial();
		this.final();
	}

	drawShape(mat, isTransformed) {
		if (isTransformed) stroke("red");
		else stroke("black");
		this.drawQuad(mat);
	}

	initial() {
		this.drawShape(this.mat);
		switch (this.shearAxis) {
			case "x":
				this.shearing_mat = [
					[1, this.sh[0], 0],
					[0, 1, 0],
					[0, 0, 1],
				];
				break;
			case "y":
				this.shearing_mat = [
					[1, 0, 0],
					[this.sh[1], 1, 0],
					[0, 0, 1],
				];
				break;
			default:
				break;
		}
	}

	final() {
		let shearCoordinates = transformShape(this.shearing_mat, this.mat);
		this.drawShape(shearCoordinates, true);
	}
}
