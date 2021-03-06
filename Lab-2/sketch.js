function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	background(220);

	/** Digital Differential Analyzer */
	var ddaLine = new DDALine(100, 60, 360, 190);
	ddaLine.drawLine();

	/** Bresenham Line Drawing Algorithm */
	var bresenhamLine1 = new BresenhamLine(160, 120, 365, 300);
	bresenhamLine1.drawLine();
	var bresenhamLine2 = new BresenhamLine(160, 204, 380, 458);
	bresenhamLine2.drawLine();

	/** Mid-Point Line Drawing Algorithm */
	var mpLine1 = new MPLine(50, 70, 200, 320);
	mpLine1.drawLine();
	var mpLine2 = new MPLine(100, 120, 290, 210);
	mpLine2.drawLine();
}

class Slope {
	constructor(x1, y1, x2, y2) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	}

	slope() {
		this.dx = this.x2 - this.x1;
		this.dy = this.y2 - this.y1;
		this.m = abs(this.dy / this.dx);
	}

	writeCoordinate(x, y) {
		textSize(16);
		textStyle(NORMAL);
		text("(" + x + ", " + y + ")", x + 8, y - 8);
	}
}

class DDALine extends Slope {
	/**
	 *
	 * @param {Number} x1 Starting x-coordinate
	 * @param {Number} y1 Starting y-coordinate
	 * @param {Number} x2 Ending x-coordinate
	 * @param {Number} y2 Ending y-coordinate
	 */
	constructor(x1, y1, x2, y2) {
		super(x1, y1, x2, y2);
	}

	drawLine() {
		stroke(0, 0, 0);
		strokeWeight(1.5);
		this.slope();
		this.calculateStepsize();
		this.calculateIncrement();
		this.constructLine();
	}

	/** Calculates `stepSize` based on `dx` and `dy` */
	calculateStepsize() {
		var abs_dx = abs(this.dx);
		var abs_dy = abs(this.dy);
		if (abs_dx > abs_dy) this.stepSize = abs_dx;
		else this.stepSize = abs_dy;
	}

	/** Calculation increment value on `x` and `y` */
	calculateIncrement() {
		this.x_inc = this.dx / this.stepSize;
		this.y_inc = this.dy / this.stepSize;
	}

	/** Constructs a line based on the values from earlier functions. */
	constructLine() {
		var x = this.x1;
		var y = this.y1;

		point(x, y);
		this.writeCoordinate(x, y);
		for (var i = 0; i < this.stepSize; i++) {
			x = x + this.x_inc;
			y = y + this.y_inc;
			point(x, y);
		}
		this.writeCoordinate(x, y);
	}
}

class BresenhamLine extends Slope {
	/**
	 *
	 * @param {Number} x1 Starting x-coordinate
	 * @param {Number} y1 Starting y-coordinate
	 * @param {Number} x2 Ending x-coordinate
	 * @param {Number} y2 Ending y-coordinate
	 */
	constructor(x1, y1, x2, y2) {
		super(x1, y1, x2, y2);
	}

	drawLine() {
		stroke(0, 0, 0);
		strokeWeight(1.5);
		this.slope();
		this.set();
		this.initialCalculations();
		this.constructLine();
		this.writeCoordinate(this.x, this.y);
	}

	set() {
		this.x = this.x1;
		this.y = this.y1;
		point(this.x, this.y);
		this.writeCoordinate(this.x, this.y);
	}

	initialCalculations() {
		this.twice_delX = 2 * this.dx;
		this.twice_delY = 2 * this.dy;
		let tdymdx = this.twice_delY - this.dx;
		let tdxmdy = this.twice_delX - this.dy;
		if (this.m >= 1) this.p0 = tdxmdy;
		else this.p0 = tdymdx;
	}

	constructLine() {
		let p_i = this.p0;
		let x = this.x;
		let y = this.y;

		let count = 0;
		if (this.m >= 1) count = this.dy;
		else count = this.dx;

		for (var k = 0; k < count; k++) {
			if (p_i < 0) {
				if (this.m >= 1) {
					x = x;
					y += 1;
					p_i = p_i + this.twice_delX;
				} else {
					x += 1;
					y = y;
					p_i = p_i + this.twice_delY;
				}
			} else {
				x += 1;
				y += 1;
				if (this.m >= 1) p_i = p_i + this.twice_delX - this.twice_delY;
				else p_i = p_i + this.twice_delY - this.twice_delX;
			}

			point(x, y);
		}

		this.x = x;
		this.y = y;
	}
}

class MPLine extends Slope {
	constructor(x1, y1, x2, y2) {
		super(x1, y1, x2, y2);
	}

	drawLine() {
		stroke(0, 0, 0);
		strokeWeight(1.5);
		this.slope();
		this.set();
		this.initialCalculations();
		this.constructLine();
	}

	set() {
		this.x = this.x1;
		this.y = this.y1;

		point(this.x, this.y);
		this.writeCoordinate(this.x, this.y);
	}

	initialCalculations() {
		if (this.m >= 1) this.p0 = this.dx - this.dy / 2;
		else this.p0 = this.dy - this.dx / 2;
	}

	constructLine() {
		let p_k = this.p0;
		let x = this.x;
		let y = this.y;

		let count = 0;
		if (this.m >= 1) count = this.dy;
		else count = this.dx;

		for (let k = 0; k < count; k++) {
			if (p_k < 0) {
				if (this.m >= 1) {
					x = x;
					y += 1;
					p_k = p_k + this.dx;
				} else {
					x += 1;
					y = y;
					p_k = p_k + this.dy;
				}
			} else {
				x += 1;
				y += 1;
				if (this.m >= 1) p_k = p_k + this.dx - this.dy;
				else p_k = p_k + this.dy - this.dx;
			}
			point(x, y);
		}
		this.writeCoordinate(x, y);
	}
}
