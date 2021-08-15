function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	background(220);

	// let lb = new LiangBarsky(115, 145, 350, 500);
	// lb.clipLine();
	let cs = new CohenSutherLand(200, 300, 420, 500);
	cs.clipLine();
	noLoop();
}

function writeCoordinates(x1, y1, x2, y2, isClipped) {
	let t = isClipped ? "Clipped" : "Original";
	let y = isClipped ? 80 : 50;
	strokeWeight(0.7);
	textSize(16);
	textStyle(NORMAL);
	text(t + ": (" + x1 + ", " + y1 + ") and (" + x2 + ", " + y2 + ")", 50, y);
}

function drawLine(x1, y1, x2, y2, isClipped) {
	if (isClipped) {
		stroke("darkred");
		strokeWeight(3);
	} else strokeWeight(1);
	line(x1, y1, x2, y2);
}

class Setup {
	constructor(tl_x, tl_y, br_x, br_y) {
		this.tl_x = tl_x;
		this.tl_y = tl_y;
		this.br_x = br_x;
		this.br_y = br_y;
		this.myCanvas();
		this.xyw();
	}

	myCanvas() {
		fill(100);
		stroke("black");
		strokeWeight(1);
		rect(this.tl_x, this.tl_y, this.br_x - this.tl_x, this.br_y - this.tl_y);
	}

	xyw() {
		let xw = [this.tl_x, this.br_x];
		let yw = [this.tl_y, this.br_y];

		this.xw_min = min(xw);
		this.xw_max = max(xw);
		this.yw_min = min(yw);
		this.yw_max = max(yw);
	}
}

class Region extends Setup {
	constructor(x1, y1, x2, y2) {
		super(150, 150, 450, 450);
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.regionCodes = this.calculateCodes();
	}

	calculateCodes() {
		let x = [this.x1, this.x2];
		let y = [this.y1, this.y2];
		let regionCodes = [];
		for (const i of [0, 1]) {
			let r = this.regionCode(x[i], y[i]);
			regionCodes.push(r);
		}
		return regionCodes;
	}

	regionCode(x, y) {
		let r = [0, 0, 0, 0];

		if (y > this.yw_max) r[0] = 1;
		else if (y < this.yw_min) r[1] = 1;

		if (x > this.xw_max) r[2] = 1;
		else if (x < this.xw_min) r[3] = 1;
		return r;
	}
}

class CohenSutherLand extends Region {
	constructor(x1, y1, x2, y2) {
		super(x1, y1, x2, y2);
		this.m = (this.y2 - this.y1) / (this.x2 - this.x1);
	}

	clipLine() {
		this.writeCoordinates();
		this.drawLine();
		this.regionCodes = this.calculateCodes();
		this.conditions();
		this.writeCoordinates(true);
	}

	writeCoordinates(isClipped) {
		writeCoordinates(this.x1, this.y1, this.x2, this.y2, isClipped);
	}

	drawLine(isClipped) {
		drawLine(this.x1, this.y1, this.x2, this.y2, isClipped);
	}

	conditions() {
		let codes = this.regionCodes;
		if (codes[0].join("") == "0000" && codes[1].join("") == "0000") {
			print("The line is trivially accepted.");
		} else {
			let op = this.and(codes[0], codes[1]);
			if (op == "0000") {
				this.clipping();
			} else {
				print("The line is trivially rejected.");
			}
		}
	}

	and(a, b) {
		let result = [];
		for (const i of [0, 1, 2, 3]) {
			result.push(a[i] * b[i]);
		}
		return result.join("");
	}

	clipping() {
		let x = [this.x1, this.x2];
		let y = [this.y1, this.y2];
		let codes = this.regionCodes;

		for (const i of [0, 1]) {
			if (codes[i].join("") != "0000") {
				let newCoordinates = this.calculateNewPoints(x[i], y[i], codes[i]);
				x[i] = newCoordinates[0];
				y[i] = newCoordinates[1];
			}
		}
		this.x1 = x[0];
		this.x2 = x[1];
		this.y1 = y[0];
		this.y2 = y[1];
		this.drawLine(true);
	}

	calculateNewPoints(x_i, y_i, code) {
		let x = x_i;
		let y = y_i;
		if (code[3] == 1) {
			x = this.xw_min;
			y = y_i + floor(this.m * (x - x_i));
		} else if (code[2] == 1) {
			x = this.xw_max;
			y = y_i + floor(this.m * (x - x_i));
		} else if (code[1] == 1) {
			y = this.yw_min;
			x = x_i + floor((y - y_i) / this.m);
		} else if (code[0] == 1) {
			y = this.yw_max;
			x = x_i + floor((y - y_i) / this.m);
		}
		return [x, y];
	}
}

class LiangBarsky extends Setup {
	constructor(x1, y1, x2, y2) {
		super(150, 150, 450, 450);
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.p = [];
		this.q = [];
	}

	clipLine() {
		this.writeCoordinates();
		this.drawLine();
		this.calculate();
		this.calculateU();
		this.calculateEndPoints();
		this.writeCoordinates(true);
	}

	writeCoordinates(isClipped) {
		writeCoordinates(this.x1, this.y1, this.x2, this.y2, isClipped);
	}

	drawLine(isClipped) {
		drawLine(this.x1, this.y1, this.x2, this.y2, isClipped);
	}

	calculate() {
		this.dx = this.x2 - this.x1;
		this.dy = this.y2 - this.y1;
		for (let k = 1; k <= 4; k++) {
			this.calculatePQ(k);
		}
	}

	calculatePQ(k) {
		let dx = this.dx;
		let dy = this.dy;
		let p = 0,
			q = 0;
		switch (k) {
			case 1:
				p = -dx;
				q = this.x1 - this.xw_min;
				break;
			case 2:
				p = dx;
				q = this.xw_max - this.x1;
				break;
			case 3:
				p = -dy;
				q = this.y1 - this.yw_min;
				break;
			case 4:
				p = dy;
				q = this.yw_max - this.y1;
				break;
			default:
				break;
		}
		this.p.push(p);
		this.q.push(q);
	}

	calculateU() {
		let gt0 = [1];
		let lt0 = [0];
		let p = this.p;
		let q = this.q;
		for (let k = 0; k < p.length; k++) {
			if (p[k] == 0 && q[k] < 0) {
				gt0 = [1];
				lt0 = [0];
				break;
			} else if (p[k] < 0) lt0.push(q[k] / p[k]);
			else if (p[k] > 0) gt0.push(q[k] / p[k]);
		}

		if (!(gt0.length == 1 && lt0.length == 1)) {
			this.u1 = max(lt0);
			this.u2 = min(gt0);
		}
	}

	calculateEndPoints() {
		if (this.u1 <= this.u2) {
			this.x2 = floor(this.x1 + this.u2 * this.dx);
			this.y2 = floor(this.y1 + this.u2 * this.dy);
			this.x1 += floor(this.u1 * this.dx);
			this.y1 += floor(this.u1 * this.dy);
			this.drawLine(true);
		} else {
			print("The line is outside and is rejected.");
		}
	}
}
