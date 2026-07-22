import { keys } from "./input.js";
import { drawShip } from "./render.js";
import { checkTerrainCollision, drawTerrain, MOON_CENTER, MOON_RADIUS } from "./terrain.js";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Keep canvas resized to full screen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let lander;
let gameState = 'PLAYING'; // 'PLAYING' | 'LANDED' | 'CRASHED'

const MAX_LANDING_SPEED = 2;
const MAX_LANDING_ANGLE = 0.25;

function resetGame() {
  lander = {
    x: MOON_CENTER.x,
    y: MOON_CENTER.y - MOON_RADIUS - 150,
    angle: 0,
    vx: 0,
    vy: 0,
    thrust: 0.15,
  };
  gameState = 'PLAYING';
}

resetGame();

// Restart on 'R' or 'Space' key
window.addEventListener('keydown', (e) => {
  if ((e.key.toLowerCase() === 'r' || e.code === 'Space') && gameState !== 'PLAYING') {
    resetGame();
  }
});

function gameLoop() {
  // 1. Physics & Logic Update
  if (gameState === 'PLAYING') {
    if (keys.ArrowLeft)  lander.angle -= 0.02;
    if (keys.ArrowRight) lander.angle += 0.02;
    if (keys.ArrowUp) {
      lander.vx -= lander.thrust * Math.cos(lander.angle + Math.PI / 2);
      lander.vy -= lander.thrust * Math.sin(lander.angle + Math.PI / 2);
    }

    const dx = MOON_CENTER.x - lander.x;
    const dy = MOON_CENTER.y - lander.y;
    const distance = Math.hypot(dx, dy);
    const GRAVITY_CONSTANT = 60000;
    const angleToMoon = Math.atan2(dy, dx);
    const GRAVITY_STRENGTH = GRAVITY_CONSTANT / (distance * distance);
    lander.vx += GRAVITY_STRENGTH * Math.cos(angleToMoon);
    lander.vy += GRAVITY_STRENGTH * Math.sin(angleToMoon);

    lander.x += lander.vx;
    lander.y += lander.vy;

    // Collision Check
    const collision = checkTerrainCollision(lander.x, lander.y);

    if (collision.collided) {
      const speed = Math.hypot(lander.vx, lander.vy);
      const normalizedAngle = Math.atan2(Math.sin(lander.angle), Math.cos(lander.angle));

      if (collision.isLandingPad && speed <= MAX_LANDING_SPEED && Math.abs(normalizedAngle) <= MAX_LANDING_ANGLE) {
        gameState = 'LANDED';
      } else {
        gameState = 'CRASHED';
      }

      lander.vx = 0;
      lander.vy = 0;
    }
  }

  // 2. Render Scene (Runs once per frame regardless of gameState)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(canvas.width / 2 - lander.x, canvas.height / 2 - lander.y);

  drawTerrain(ctx);

  ctx.save();
  ctx.translate(lander.x, lander.y);
  drawShip(ctx, lander, keys);
  ctx.restore();

  ctx.restore();

  // 3. Render UI Overlay
  drawUI();

  // 4. Request NEXT frame ONLY ONCE
  requestAnimationFrame(gameLoop);
}

function drawUI() {
  const speed = Math.hypot(lander.vx, lander.vy).toFixed(2);
  ctx.fillStyle = '#ffffff';
  ctx.font = '16px monospace';
  ctx.fillText(`Speed: ${speed}`, 20, 30);

  if (gameState === 'LANDED') {
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SUCCESSFUL LANDING!', canvas.width / 2, 100);
    ctx.font = '18px monospace';
    ctx.fillText('Press R or Space to Restart', canvas.width / 2, 140);
  } else if (gameState === 'CRASHED') {
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CRASHED!', canvas.width / 2, 100);
    ctx.font = '18px monospace';
    ctx.fillText('Press R or Space to Restart', canvas.width / 2, 140);
  }
}

// Start the loop
requestAnimationFrame(gameLoop);
