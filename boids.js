var boids = new Array(AMOUNT_CUBES);
var cubes = new Array(AMOUNT_CUBES);
var neighbourRadius = 50.0;
var observDegree = 120.0;
var minDistance = 20.0;
var weightNeighbourDistance = 0.1;
var weightNeighbourDistance = 0.15;
var weightMinimalDistance = 0.15;
var weightPerturbation = 0.1;
var maxVelocity = 4.0;
const width = 600;
const height = 400;

function modify_speed_and_direction() {
	var dist = 0.0;
	var deg = 0.0;

	// For each BOID, calculate distances and interacts
	// with BOIDS within the visual field
	for (i = 0; i < boids.length; i++) {
		boids[i].mean_vx = boids[i].vx;
		boids[i].mean_vy = boids[i].vy;

		// Mean DISTANCE to all neighbours
		boids[i].mean_d = 0;

		boids[i].num = 1;
		// Interacting with each other one
		for (j = 0; j < boids.length; j++) {
			// Skip interaction with myself
			if (j == i) continue;
			// Now, I'm sure, I will interact

			// Calculate distance
			dist = Math.sqrt(Math.pow(boids[i].x - boids[j].x, 2) + Math.pow(boids[i].y - boids[j].y, 2));

			// This seems to be the viewing angle.
			deg = Math.acos(
				boids[i].vx / Math.sqrt(boids[i].vx * boids[i].vx + boids[i].vy * boids[i].vy) * ((boids[j].x - boids[i].x) / dist) +
				boids[i].vy / Math.sqrt(boids[i].vx * boids[i].vx + boids[i].vy * boids[i].vy) * ((boids[j].y - boids[i].y) / dist));
			// To degrees
			deg = Math.abs((180 * deg) / Math.PI);

			// if this neighbor is close enough and I see him...
			if (dist < neighbourRadius && deg < observDegree) {
				// My speed depends on the speed of the neighbours
				boids[i].mean_vx += boids[j].vx;
				boids[i].mean_vy += boids[j].vy;
				// Simple distance
				boids[i].mean_d += dist;
				// Used to calculate the mean values
				boids[i].num++;
			}
		}
	}

	for (i = 0; i < boids.length; i++) {
		// Adjust speed to neighbours speed
		boids[i].vx += (weightNeighbourDistance * ((boids[i].mean_vx / boids[i].num) - boids[i].vx));
		boids[i].vy += (weightNeighbourDistance * ((boids[i].mean_vy / boids[i].num) - boids[i].vy));

		// Add some perturbation
		boids[i].vx += (weightPerturbation * ((Math.random() - 0.5) * maxVelocity));
		boids[i].vy += (weightPerturbation * ((Math.random() - 0.5) * maxVelocity));

		// mean distance is calculated
		if (boids[i].num > 1) boids[i].mean_d /= (boids[i].num - 1);

		// Again, interaction with all
		for (j = 0; j < boids.length; j++) {
			if (j == i) continue;

			// Distance calculation: identical
			dist = Math.sqrt(Math.pow(boids[i].x - boids[j].x, 2) + Math.pow(boids[i].y - boids[j].y, 2));
			// Angle calculation: identical.
			deg = Math.acos(
				boids[i].vx / Math.sqrt(boids[i].vx * boids[i].vx + boids[i].vy * boids[i].vy) * ((boids[j].x - boids[i].x) / dist) +
				boids[i].vy / Math.sqrt(boids[i].vx * boids[i].vx + boids[i].vy * boids[i].vy) * ((boids[j].y - boids[i].y) / dist));
			deg = Math.abs((180 * deg) / Math.PI);

			// Same thing
			// if this neighbor is close enough and I see him...
			if (dist < neighbourRadius && deg < observDegree) {
				// My speed is corrected
				if (Math.abs(boids[j].x - boids[i].x) > minDistance) {
					boids[i].vx += (weightNeighbourDistance / boids[i].num) * (((boids[j].x - boids[i].x) * (dist - boids[i].mean_d)) / dist);
					boids[i].vy += (weightNeighbourDistance / boids[i].num) * (((boids[j].y - boids[i].y) * (dist - boids[i].mean_d)) / dist);
				// Neigbours are too close
				} else {
					boids[i].vx -= (weightMinimalDistance / boids[i].num) * ((((boids[j].x - boids[i].x) * (minDistance)) / dist) - (boids[j].x - boids[i].x));
					boids[i].vy -= (weightMinimalDistance / boids[i].num) * ((((boids[j].y - boids[i].y) * (minDistance)) / dist) - (boids[j].y - boids[i].y));
				}
			}
		}

		//check speed is not too high; if so, reduce 25% ???
		while (Math.sqrt(boids[i].vx * boids[i].vx + boids[i].vy * boids[i].vy) > maxVelocity) {
			boids[i].vx *= 0.75;
			boids[i].vy *= 0.75;
		}
	}
}

// MAIN FUNCTION !!! ENTRY POINT !!!
// Move and display boids
function move_and_display() {
	// First modify speed and direction
	modify_speed_and_direction();

	for (i = 0; i < boids.length; i++) {
		//move boid by adding X and Y speed components to each boid
		boids[i].x += boids[i].vx;
		boids[i].y += boids[i].vy;

		//check if outside window
		if      (boids[i].x >  width) boids[i].x-=width;
		else if (boids[i].x <      0) boids[i].x+=width;
		if      (boids[i].y > height) boids[i].y-=height;
		else if (boids[i].y <      0) boids[i].y+=height;

		// This variables are not used
		//if (boids[i].vx < 0) boids[i].rotate = 90.0 + Math.atan(boids[i].vy / boids[i].vx) * 180.0 / Math.PI;
		//else boids[i].rotate =-90.0 + Math.atan(boids[i].vy / boids[i].vx) * 180.0 / Math.PI;
	}

	setCubesPosition(boids);

	window.requestAnimationFrame(move_and_display);
}

// BOIDS are the moving ideal objects,
// CUBES are the drawn objects
// CUBE[0..n].position = BOIDS[n]
const setCubesPosition = (boids) => {
	for (let i = 0; i < cubes.length; i++) {
		cubes[i].position.x = boids[i].x;
		cubes[i].position.z = boids[i].y;
	}
}

// Initialize position & speed
// boids[i].vx, vy, x, y
const init = () => {
	for (i = 0; i < AMOUNT_CUBES; i++) {
		boids[i] = {
			x: Math.floor(Math.random() * width),
			y: Math.floor(Math.random() * height),
			vx: Math.random() * 4.0 - 2.0,
			vy: Math.random() * 4.0 - 2.0
		};
	}
}
function start() { init(); window.requestAnimationFrame(move_and_display); }
