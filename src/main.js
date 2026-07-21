import { keys } from "./input.js";
import { drawShip } from "./render.js";
import { drawTerrain, MOON_CENTER, MOON_RADIUS } from "./terrain.js";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let lander = {
  x: MOON_CENTER.x,
  y: MOON_CENTER.y - MOON_RADIUS - 150,
  angle: 0,
  vx: 0,
  vy: 0,
  thrust: 0.15,
};

function gameLoop() {
  //Physics
  if (keys.ArrowLeft)  lander.angle -= 0.02;
  if (keys.ArrowRight) lander.angle += 0.02;
  if (keys.ArrowUp) {
    lander.vx -= lander.thrust * Math.cos(lander.angle + Math.PI/2);
    lander.vy -= lander.thrust * Math.sin(lander.angle + Math.PI/2);
  }

  lander.vy += 0.04; // Gravity
  lander.x += lander.vx;
  lander.y += lander.vy;

  //Draw
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(canvas.width / 2 - lander.x, canvas.height / 2 - lander.y);
  drawTerrain(ctx);
  ctx.save();
  ctx.translate(lander.x, lander.y);
  drawShip(ctx, lander, keys);
  ctx.restore();
  ctx.restore();

  requestAnimationFrame(gameLoop);
}

gameLoop();
