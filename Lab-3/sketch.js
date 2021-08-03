function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	background(220);

	let circle = new MPCircle(200, 200, 111);
	circle.drawCircle();
	let ellipse = new MPEllipse(250, 250, 140, 90);
	ellipse.drawEllipse();
}

function isFloat(n) {
	return Number(n) === n && n % 1 !== 0;
}

class SymmetricPoints {
	constructor(x_c, y_c) {
		this.x_c = x_c;
		this.y_c = y_c;
	}

	constructPoint(x, y) {
		point(x + this.x_c, y + this.y_c);
	}

	getSymmetricPoints(x, y) {
		this.constructPoint(x, y);
		this.constructPoint(x, -y);
		this.constructPoint(-x, y);
		this.constructPoint(-x, -y);
	}
}

class MPCircle extends SymmetricPoints {
	/**
	 *
	 * @param {Number} x_c x-coordinate of the center
	 * @param {Number} y_c y-coordinate of the center
	 * @param {Number} r Radius of the circle
	 */
	constructor(x_c, y_c, r) {
		super(x_c, y_c);
		this.r = r;
	}

	drawCircle() {
		this.set();
		strokeWeight(3);
		this.getQ1Points();
		this.writeCoordinate(this.x_c, this.y_c, this.r);
	}

	set() {
		this.x = 0;
		this.y = this.r;
		this.getOtherPoints(this.x, this.y);

		if (isFloat(this.r)) this.p0 = 5 / 4 - this.r;
		else this.p0 = 1 - this.r;
	}

	getQ1Points() {
		let p_k = this.p0;
		let x = this.x;
		let y = this.y;
		while (x < y) {
			if (p_k < 0) {
				x += 1;
				y = y;
				p_k = p_k + 2 * x + 1;
			} else {
				x += 1;
				y -= 1;
				p_k = p_k + 2 * x - 2 * y + 1;
			}

			this.getOtherPoints(x, y);
		}
	}

	getOtherPoints(x, y) {
		this.getSymmetricPoints(x, y);
		this.getSymmetricPoints(y, x);
	}

	writeCoordinate(x, y, r) {
		textSize(16);
		textStyle(NORMAL);
		fill("#993300");
		strokeWeight(1.1);
		text("Center: (" + x + ", " + y + ")\nRadius: " + r, x + r + 20, y);
	}
}

class MPEllipse extends SymmetricPoints {
	constructor(x_c, y_c, r_x, r_y) {
		super(x_c, y_c);
		this.r_x = r_x;
		this.r_y = r_y;
	}

	drawEllipse() {
		strokeWeight(3);
		this.setR1();
		this.drawR1();
		this.setR2();
		this.drawR2();
		this.writeCoordinate(this.x_c, this.y_c, this.r_x, this.r_y);
	}

	setR1() {
		this.x = 0;
		this.y = this.r_y;
		this.sq_rx = sq(this.r_x);
		this.sq_ry = sq(this.r_y);
		this.p1_0 = this.sq_ry - this.sq_rx * this.r_y + (1 / 4) * this.sq_rx;
	}

	drawR1() {
		let x = this.x;
		let y = this.y;
		let p1_k = this.p1_0;

		let try2x = 2 * this.sq_ry * x;
		let trx2y = 2 * this.sq_rx * y;

		while (try2x < trx2y) {
			if (p1_k < 0) {
				x += 1;
				y = y;
				p1_k = p1_k + 2 * this.sq_ry * x + this.sq_ry;
			} else {
				x += 1;
				y -= 1;
				p1_k = p1_k + 2 * this.sq_ry * x - 2 * this.sq_rx * y + this.sq_ry;
			}
			this.getSymmetricPoints(x, y);
			try2x = 2 * this.sq_ry * x;
			trx2y = 2 * this.sq_rx * y;
			this.x = x;
			this.y = y;
		}
	}

	setR2() {
		this.p2_0 =
			this.sq_ry * sq(this.x + 1 / 2) +
			this.sq_rx * sq(this.y - 1) -
			this.sq_rx * this.sq_ry;
	}

	drawR2() {
		let x = this.x;
		let y = this.y;
		let p2_k = this.p2_0;

		while (y != 0) {
			if (p2_k < 0) {
				x += 1;
				y -= 1;
				p2_k = p2_k + 2 * this.sq_ry * x - 2 * this.sq_rx * y + this.sq_rx;
			} else {
				x = x;
				y -= 1;
				p2_k = p2_k - 2 * this.sq_rx * y + this.sq_rx;
			}
			this.getSymmetricPoints(x, y);
		}
	}

	writeCoordinate(x, y, r_x, r_y) {
		textSize(18);
		textStyle(NORMAL);
		fill("#993300");
		strokeWeight(1.1);
		text(
			"Center: (" +
				x +
				", " +
				y +
				")\nMajor Radius: " +
				r_x +
				"\nMinor Radius: " +
				r_y,
			x - 70,
			y + r_y + 30
		);
	}
}
