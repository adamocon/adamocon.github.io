var canvas;
var vmove;
var vold;
var vstep;
var vnew;
var vcen;

var bead_size = 12;
var mult_steps = 200;
var mode_index;
var step_count = 0;

var num_circles = 8;
var circle_step = 28;

var jitter_size = 40;
var max_bar_height = 140;
var bar_border = 1;
var num_dots = [];
var density;
var bar_height = [];
var scaling = 0.02;
var area;

var fade;
var fadeslider;
var linethickness;
var lineslider;

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	// canvas.style('z-index', '2')
	background(240, 255);
	vold = createVector(windowWidth/2,windowHeight/2);
	vcen = createVector(windowWidth/2,windowHeight/2);
	// mode_index = floor(random(4));
	mode_index = 0;
	// frameRate(30);

	for (var c = 0; c < num_circles; c++){
		num_dots[c] = 0;
		bar_height[c] = 0;
	}

	max_bar_height = windowHeight/5*0.6;

	fadeslider = createSlider(180, 255, 200);
	fadeslider.position(10, 10);
	fadeslider.style('width', '120px');
	// fadeslider.hide()

	lineslider = createSlider(0.5, 20, 1);
	lineslider.position(10, 50);
	lineslider.style('width', '120px');
	// lineslider.hide()
}

function draw() {
	if (mode_index == 0){
		// Just nice solid touching circles (no FR cap)
		
		background(240, 0.9);

		strokeWeight(1);
		stroke(0);

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
		// ellipse(vold.x,vold.y,bead_size);
		// colorMode(RGB);

		vmove = p5.Vector.random2D();
		vnew = p5.Vector.add(vold,vmove.mult(bead_size));
		vold = vnew;

		ellipse(vold.x,vold.y,bead_size);
		colorMode(RGB);

		// noStroke();
		// textStyle(ITALIC);
		// textAlign(CENTER);
		// textSize(24);

		// fill(240);
		// text("'touching circles'", width/2, height*19/20);

		// fill(0,120);
		// text("'touching circles'", width/2, height*19/20);
	} else if (mode_index == 1){
		// Perrin style mult steps (can set FR to around 20)
		background(240, 2);
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
		// Perrin style spikey time (fading spikes)
		fade = fadeslider.value();
		linethickness = lineslider.value();

		background(240, 255-fade);
		stroke(50);
		strokeWeight(linethickness);
		vstep = createVector(0,0);
		for (var n = 0; n < mult_steps; n++){
			vmove = p5.Vector.random2D();
			vstep = p5.Vector.add(vstep,vmove.mult(bead_size/mult_steps));
		}
		vnew = p5.Vector.add(vold,vstep.mult(bead_size*14));
		line(vold.x, vold.y, vnew.x, vnew.y);
	} else if (mode_index == 3){
		// Perrin style dot displacements in circles
		vstep = createVector(0,0);
		for (var n = 0; n < mult_steps; n++){
			vmove = p5.Vector.random2D();
			vstep = p5.Vector.add(vstep,vmove.mult(bead_size/mult_steps));
		}
		vnew = p5.Vector.add(vold,vstep.mult(bead_size*8));
		fill(0);
		noStroke();
		ellipse(vnew.x,vnew.y,bead_size/3);

		// Draw circles
		fill(255,0);
		stroke(0);
		strokeWeight(1);
		for (var c = 0; c < num_circles; c++){
			ellipse(windowWidth/2,windowHeight/2,2*(c+1)*circle_step);
		}

		// Find and count displacement
		let vdiff = p5.Vector.sub(vnew, vcen);
		let jitter = random(jitter_size);
		circle_index = floor(vdiff.mag()/circle_step);
		num_dots[circle_index] = num_dots[circle_index] + 1;

		// Draw distribution of displacements (linear, not normalised)
		// for (var c = 0; c < num_circles; c++){
		// 	line(windowWidth/2 + (c+1)*circle_step,windowHeight*1/10,windowWidth/2 + (c+1)*circle_step,windowHeight*1/10 + jitter_size);
		// }
		// strokeWeight(0.5);
		// stroke(190);
		// line(windowWidth/2,windowHeight*1/10,windowWidth/2,windowHeight*1/10 + jitter_size);
		// fill(0,255);
		// noStroke();
		// ellipse(windowWidth/2 + vdiff.mag(),windowHeight*1/10 + jitter,1);

		// Draw distribution of displacements (bar graph, normalised by ring area)
		stroke(240,255);
		strokeWeight(1.2);
		fill(240,255);
		for (var c = 0; c < num_circles; c++){
			area = (c+1)**2 - (c)**2;
			density = num_dots[c] / area;
			bar_height[c] = density/scaling;
			rect(windowWidth/2 + (c)*circle_step + bar_border,windowHeight/5-bar_height[c],circle_step-2*bar_border,bar_height[c]);
		}

		if (max(bar_height) > max_bar_height){
			scaling = scaling * 1.3;
		}

		fill(0,20);
		noStroke();
		for (var c = 0; c < num_circles; c++){
			area = (c+1)**2 - (c)**2;
			density = num_dots[c] / area;
			bar_height[c] = density/scaling;
			rect(windowWidth/2 + (c)*circle_step + bar_border,windowHeight/5-bar_height[c],circle_step-2*bar_border,bar_height[c]);
		}
	}

	// sliders and text for spikey mode
	if (mode_index == 2){
		// Perrin style spikey time (fading spikes)
		fadeslider.show()
		lineslider.show()

		noStroke();
		fill(240);
		rect(134, 10, 140, 70);

		textStyle(ITALIC);
		textAlign(LEFT);
		textSize(24);

		fill(120);

		text("persistence", 140, 30);
		text("thickness", 140, 70);

	} else{
		fadeslider.hide()
		lineslider.hide()
	}


	step_count += 1;

	textStyle(ITALIC);
	textAlign(CENTER);
	textSize(24);
	noStroke();

	fill(240);
	text("← use the arrow keys to cycle through visualisations →", width/2, height*18/20);

	fill(0,120);
	text("← use the arrow keys to cycle through visualisations →", width/2, height*18/20);

	// // Perrin style spikey time (persistent spikes)
	// stroke(0,50);
	// strokeWeight(3);
	// vstep = createVector(0,0);
	// for (var n = 0; n < mult_steps; n++){
	// 	vmove = p5.Vector.random2D();
	// 	vstep = p5.Vector.add(vstep,vmove.mult(bead_size/mult_steps));
	// }
	// vnew = p5.Vector.add(vold,vstep.mult(bead_size*14));
	// line(vold.x, vold.y, vnew.x, vnew.y);
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
	step_count = 0

	vold = createVector(windowWidth/2,windowHeight/2);
	vcen = createVector(windowWidth/2,windowHeight/2);

	scaling = 0.02;
	for (var c = 0; c < num_circles; c++){
		num_dots[c] = 0;
		bar_height[c] = 0;
	}
	max_bar_height = windowHeight/5*0.6;
	background(240, 255);
}

function keyPressed() {
	if ((keyCode === LEFT_ARROW) || (keyCode === RIGHT_ARROW)) {
		step_count = 0
		background(240, 255);
		vold = createVector(windowWidth/2,windowHeight/2);
	}

	if (keyCode === RIGHT_ARROW) {
	    mode_index = (mode_index + 1) % 4
	} else if (keyCode === LEFT_ARROW) {
	    mode_index = (mode_index - 1) % 4
	    if (mode_index < 0) {
	    	mode_index = 3;
		} 
	}

	scaling = 0.02;
	for (var c = 0; c < num_circles; c++){
		num_dots[c] = 0;
		bar_height[c] = 0;
	}
	max_bar_height = windowHeight/5*0.6;
}
