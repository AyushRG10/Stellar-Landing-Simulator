import { keys } from "./input.js";
import { drawShip } from "./render.js";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let lander = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  angle: 0,
  vx: 0,
  vy: 0,
  thrust: 0.15,
};

function gameLoop() {
  // 1. Update physics (unchanged)
  if (keys.ArrowLeft)  lander.angle -= 0.02;
  if (keys.ArrowRight) lander.angle += 0.02;
  if (keys.ArrowUp) {
    lander.vx -= lander.thrust * Math.cos(lander.angle + Math.PI/2);
    lander.vy -= lander.thrust * Math.sin(lander.angle + Math.PI/2);
  }
  lander.x += lander.vx;
  lander.y += lander.vy;

  lander.vy += 0.04; // Gravity
  lander.x += lander.vx;
  lander.y += lander.vy;

  // 2. Clear screen and draw objects
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Simply hand the rendering engine the context, the data, and the controls!
  drawShip(ctx, lander, keys);

  // 3. Request next frame
  requestAnimationFrame(gameLoop);
}

gameLoop();
