import { keys } from "./input.js";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let lander = {
  x: 400,
  y: 100,
  vx: 0,
  vy: 0,
  angle: 0,
}

function gameLoop() {
  // 1, Update physics
  if (keys.ArrowLeft) {
    lander.angle -= 0.05;
  }
  if (keys.ArrowRight) {
    lander.angle += 0.05;
  }
  if (keys.ArrowUp) {
    const thrust = 0.15;

    lander.vx += Math.sin(lander.angle) * thrust;
    lander.vy += -Math.cos(lander.angle) * thrust;
  }

  lander.vy += 0.04

  lander.x += lander.vx;
  lander.y += lander.vy;
  // 2, Clear screen and draw objects
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(lander.x, lander.y);
  ctx.rotate(lander.angle);

  ctx.fillStyle = 'white';
  ctx.fillRect(-50, -50, 100, 100);

  ctx.restore();
  // 3, Request next frame
  requestAnimationFrame(gameLoop);
}
gameLoop()
