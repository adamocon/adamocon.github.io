var vmove;
var vold;
var vnew;
var vcen;

var beads = [];
var block_cols = [0, 255, 60]

var num_beads = 1000;
var bead_size = 6;
var step_size = 14;

var colorSetting = 0;

var c_x;
var c_y;

function setup() {
	createCanvas(windowWidth, windowHeight);
	genPolymer();
	drawPolymer();

	frameRate(1);
	noLoop();
}

function draw() {
	genPolymer();
	drawPolymer();
}

function genPolymer(){
	for (var bead_in = 0; bead_in < num_beads; bead_in++){ 
		vmove = p5.Vector.random2D();
		beads[bead_in] = vmove;
	}
}

function drawPolymer(){
	colorMode(RGB);
	background(240, 255);

	fill(0,120);
	textStyle(ITALIC);
	textAlign(CENTER);
	textSize(20);
	text("← arrow keys to cycle colours →", windowWidth/2, height*17/20);
	text("SPACE to generate a new polymer", windowWidth/2, height*18/20);

	// Centre drawing on mid end-end point
	vold = createVector(0,0);
	for (var bead_in = 0; bead_in < num_beads; bead_in++){
		vmove = beads[bead_in].copy();
		vcen = p5.Vector.add(vold,vmove.mult(step_size));
		vold = vcen;
	}
	vcen = vcen.mult(1/2);
	vold = createVector(windowWidth/2,windowHeight/2);
	vold = vold.sub(vcen);

	// Draw first bead
	fill(0, 250, 255);
	ellipse(vold.x, vold.y, bead_size);

	// Draw all other beads and connections
	for (var bead_in = 0; bead_in < num_beads; bead_in++){
		vmove = beads[bead_in].copy();
		vnew = p5.Vector.add(vold,vmove.mult(step_size));

		// Lines
		strokeWeight(0.8);
		line(vold.x, vold.y, vnew.x, vnew.y);

		// Beads
		strokeWeight(0.4);
		setBeadColour(bead_in);
		ellipse(vold.x, vold.y, bead_size);
		ellipse(vnew.x, vnew.y, bead_size);

		vold = vnew;
	}
}

function setBeadColour(index){
	if (colorSetting == 0) {
		colorMode(RGB);
		let rval = ((index/(num_beads/1200)) % 240);
		let gval = 60 + ((80 + (index/(num_beads/1200))) % 240);
		let bval = 60 + ((160 + (index/(num_beads/1200))) % 240);
		fill(rval, gval, bval);
	} else if (colorSetting == 1) {
		colorMode(HSB)
		let val = (floor(index / (num_beads/3)) % 3);
		hval = block_cols[val]
		fill(hval, 250, 245);
	} else if (colorSetting == 2) {
		colorMode(HSB);
		let hval = 255*((index+1)/(num_beads+1));
		fill(hval, 250, 245);
	} else if (colorSetting == 3) {
		colorMode(RGB);
		fill(30, 30, 30);
	} else if (colorSetting == 4) {
		colorMode(RGB);
		fill(255, 255, 255);
	}
}

function keyPressed() {
	if (keyCode === RIGHT_ARROW) {
	    colorSetting = (colorSetting + 1) % 5
	    drawPolymer();
	} else if (keyCode === LEFT_ARROW) {
	    colorSetting = (colorSetting - 1) % 5
	    if (colorSetting < 0) {
	    	colorSetting = 4;
		}
		drawPolymer();
	} else if (keyCode == 32) {
		genPolymer();
		drawPolymer();
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	genPolymer();
	drawPolymer();
}