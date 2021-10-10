var canvas;
var vmove;
var vold;
var vstep;
var vnew;
var bead_size = 12;
var mult_steps = 200;
var mode_index;
var step_count = 0;

function setup() {
	canvas = createCanvas(windowWidth, windowHeight-36);
	// canvas.style('z-index', '2')
	background(238, 255);
	vold = createVector(windowWidth/2,windowHeight/2);
	// mode_index = floor(random(4));
	mode_index = 0;
	// ellipse(vold.x,vold.y,bead_size);
	// frameRate(16);
}

function draw() {
	if (mode_index == 0){
		// Just nice solid touching circles (no FR cap)
		colorMode(RGB);
		background(238, 0.9);

		// strokeWeight(1.4);
		// stroke(0);
		// let rval = step_count % 240;
		// let gval = (80 + step_count*1.3) % (80 + 240);
		// let bval = (160 + step_count) % (160 + 240);

		// let rval = 60 + (step_count % 240);
		// let gval = 60 + ((80 + step_count) % 240);
		// let bval = 60 + ((160 + step_count) % 240);		
		// fill(rval, gval, bval);

		colorMode(HSB);
		let hval = ((step_count/2) % 255);
		// let gval = 60 + ((80 + step_count) % 240);
		// let bval = 60 + ((160 + step_count) % 240);
		fill(hval, 250, 255);

		// fill(240);
		vmove = p5.Vector.random2D();
		vnew = p5.Vector.add(vold,vmove.mult(bead_size));
		ellipse(vnew.x,vnew.y,bead_size);
		vold = vnew;
	} else if (mode_index == 1){
		// Perrin style mult steps (can set FR to around 20)
		background(238, 2);
		fill(0);
		stroke(0);
		strokeWeight(1);
		ellipse(vold.x,vold.y,bead_size/6);
		vstep = createVector(0,0);
		for (var n = 0; n < mult_steps; n++){
			vmove = p5.Vector.random2D();
			vstep = p5.Vector.add(vstep,vmove.mult(bead_size/mult_steps));
		}
		vnew = p5.Vector.add(vold,vstep.mult(bead_size*2));
		ellipse(vnew.x,vnew.y,bead_size/6);
		line(vold.x, vold.y, vnew.x, vnew.y);
		vold = vnew;
	} else if (mode_index == 2){
		// Perrin style spikey time (persistent spikes)
		background(238, 0);
		stroke(200);
		strokeWeight(3);
		vstep = createVector(0,0);
		for (var n = 0; n < mult_steps; n++){
			vmove = p5.Vector.random2D();
			vstep = p5.Vector.add(vstep,vmove.mult(bead_size/mult_steps));
		}
		vnew = p5.Vector.add(vold,vstep.mult(bead_size*8));
		line(vold.x, vold.y, vnew.x, vnew.y);
	} else {
		// Perrin style spikey time (fading spikes)
		background(238, 15);
		stroke(100);
		strokeWeight(0.4);
		vstep = createVector(0,0);
		for (var n = 0; n < mult_steps; n++){
			vmove = p5.Vector.random2D();
			vstep = p5.Vector.add(vstep,vmove.mult(bead_size/mult_steps));
		}
		vnew = p5.Vector.add(vold,vstep.mult(bead_size*16));
		line(vold.x, vold.y, vnew.x, vnew.y);
	} 

	step_count += 1;

	// Perrin style single step RW (can set FR to around 20)
	// background(238, 2);
	// fill(0);
	// stroke(0);
	// strokeWeight(1);
	// ellipse(vold.x,vold.y,bead_size/3);
	// vmove = p5.Vector.random2D();
	// vnew = p5.Vector.add(vold,vmove.mult(bead_size*1));
	// ellipse(vnew.x,vnew.y,bead_size/3);
	// line(vold.x, vold.y, vnew.x, vnew.y);
	// vold = vnew;
}

function windowResized(){
	colorMode(RGB);
	resizeCanvas(windowWidth, windowHeight-6);
	background('#eee');
	vold = createVector(windowWidth/2,windowHeight/2);
	vcen = createVector(windowWidth/2,windowHeight/2);
}