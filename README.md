# Stellar-Landing-Simulator

> Built for **NASA Stardance Challenge**
> High-performance, 2D lunar landing simultor with radial gravity, terrain generation, and realistic physics simulation built with HTML5 Canvas and Vanilla JavaScript

## Overview

This project is lightweight, web-native 2D space flight simulator that models soft landings on a celestial body. Instead of relying on a commercial game engine, all physics, rendering, vector calculations, and collision detections were written from scratch. using pure JavaScript and HTML5 Canvas.

### Key Features
* **Custom Radial Gravity Engine:** Simulates true gravitational pull toward the center of the celestial body regardless of your position in orbit.
* **Procedural Circular Terrain:** Generates mountain ridges and flat landing pads using multi-frequency trignometric functions.
* **Precise Raycast Collision System:** Detects impact points on line segments using Cramer's Rule for linear equations.
* **Real-time Vector Thrusting:** Translates rotation and thruster input into true polar-to-Cartesian acceleration vectors.
* **Zero-Dependency Web Build:** Loads instantly in any browser without compile steps or server configuration.

## How to Play

* **Target:** Touch down cleanly on the green landing pad.
* **Impact Speed:** Maintain a velocity that is less than 1.8 px/frame
* **Tilt Angle:** Land at an angle that is nearly upright with a range of pi/2 +- 0.25 radians

## Physics

### 1. Vector Acceleration & Kinematics (Euler Integration) Position and velocity update every frame using Explicit Euler Integration:
$$\vec{v}_{t+1} = \vec{v}_t + \vec{a} \cdot \Delta t$$
$$\vec{p}_{t+1} = \vec{p}_t + \vec{v}_{t+1} \cdot \Delta t$$

Thrust accleration is computed by applying polar-to-Cartesian vector transformation based on the lander's angle $\theseta$:
$$a_x = -T \cdot \cos\left(\theta + \frac{\pi}{2}\right)$$
$$a_y = -T \cdot \sin\left(\theta + \frac{\pi}{2}\right)$$

### 2. Radial Gravity
Instead of static downward vertical gravity, radial gravity pulls the ship toward the moon's center $(x_{\text{moon}}, y_{\text{moon}})$:
$$\theta_{\text{gravity}} = \operatorname{atan2}(y_{\text{moon}} - y_{\text{ship}}, x_{\text{moon}} - x_{\text{ship}})$$
$$a_x = g \cdot \cos(\theta_{\text{gravity}}), \quad a_y = g \cdot \sin(\theta_{\text{gravity}})$$

### Surface & Collision Detection
The planetary terrain uses 2D polar-to-Cartesian coordinate transformations distoreted by trignometric sine/cosine noise:
$$r_i = R_{\text{base}} + 25\sin(4i) + 15\cos(8i)$$

Collisions between the ship's landing gear and surface line segments are checked using **Cramer's Rule** to find the linear segment intersections:
$$D = (x_b) - (x_a)(y_d - y_c) - (y_b - y_a)(x_d - x_c)$$

## Built With

* **Language:** JavaScript (ES6+ Modules)
* **Rendering:** Native HTML5 Canvas API
* **Styling:** CSS3
* **Developement Tools:** Zed, Python Live Server
* **Hosting:** GitHub Pages

## How to Run Locally

Since this project has zero external dependencies or node packages, setting it up is instant:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AyushRG10/Stellar-Landing-Simulator.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd Stellar-Landing-Simulator
   ```
3. **Start Python Live Server:**
   ```bash
   python3 -m http.server 8000
   ``` 
4. **Open the `index.html` file in your browser:**
   ```bash
   open http://localhost:8000
   ```
