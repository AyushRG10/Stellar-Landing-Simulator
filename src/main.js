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
  const dx = lander.x - MOON_CENTER.x;
  const dy = lander.y - MOON_CENTER.y;
  const distance = Math.hypot(dx, dy);

  const altitude = Math.max(0, distance - MOON_RADIUS).toFixed(1);
  const totalSpeed = Math.hypot(lander.vx, lander.vy);
  const normalizedAngle = Math.atan2(Math.sin(lander.angle), Math.cos(lander.angle));
  const pitchDegrees = (normalizedAngle * (180 / Math.PI)).toFixed(1);

  const isSpeedSafe = totalSpeed <= MAX_LANDING_SPEED;
  const isAngleSafe = Math.abs(normalizedAngle) <= MAX_LANDING_ANGLE;

  ctx.save();

  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.fillRect(15, 15, 220, 150);
  ctx.strokeRect(15, 15, 220, 150);

  ctx.font = '12px monospace';
  ctx.fillStyle = '#94a4b8';
  ctx.fillText('FLIGHT TELEMETRY', 25, 33);

  ctx.font = '14px monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`ALTITUDE ${altitude} m`, 25, 50);
  ctx.fillText(`LAT VEL: ${lander.vx.toFixed(2)} m/s`, 25, 78);
  ctx.fillText(`VERT VEL: ${lander.vy.toFixed(2)} m/s`, 25, 98);

  ctx.fillStyle = isSpeedSafe ? '#4ade80' : '#f87171';
  ctx.fillText(`SPEED: ${totalSpeed.toFixed(2) / MAX_LANDING_SPEED} m/s`, 25, 118);

  ctx.fillStyle = isAngleSafe ? '#4ade80' : '#f87171';
  ctx.fillText(`PITCH: ${pitchDegrees}°`, 25, 138);

  const minimapSize = 160;
  const minimapX = canvas.width - minimapSize - 20;
  const minimapY = 20;
  const minimapRadius = minimapSize / 2;
  const minimapCenter = { x: minimapX + minimapRadius, y: minimapY + minimapRadius };

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(minimapX, minimapY, minimapSize, minimapSize);
  ctx.strokeStyle = '#38bdf8';
  ctx.strokeRect(minimapX, minimapY, minimapSize, minimapSize);

  const minimapScale = (minimapRadius - 10) / (MOON_RADIUS * 2.5);

  ctx.save();
  ctx.beginPath();
  ctx.rect(minimapX, minimapY, minimapSize, minimapSize);
  ctx.clip();

  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.arc(minimapCenter.x, minimapCenter.y, MOON_RADIUS * minimapScale, 0, 2 * Math.PI);
  ctx.fill();

  const mapLanderX = minimapCenter.x + (lander.x - MOON_CENTER.x) * minimapScale;
  const mapLanderY = minimapCenter.y + (lander.y - MOON_CENTER.y) * minimapScale;

  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(mapLanderX, mapLanderY, 3, 0, 2 * Math.PI);
  ctx.fill();

  ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  ctx.moveTo(minimapCenter.x, minimapCenter.y);
  ctx.lineTo(mapLanderX, mapLanderY);
  ctx.stroke();

  ctx.restore();

  ctx.fillStyle = '#38bdf8';
  ctx.font = '10px monospace';
  ctx.fillText('RADAR', minimapX + 8, minimapY + 15);

  if (gameState === 'LANDED') {
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('TOUCHDOWN SUCCESSFUL', canvas.width / 2, 100);
    ctx.font = '18px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Press R or Space to Restart', canvas.width / 2, 140);
  } else if (gameState === 'CRASHED') {
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CRASHED', canvas.width / 2, 100);
    ctx.font = '18px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Press R or Space to Restart', canvas.width / 2, 140);
  }

  ctx.restore();
}

// Start the loop
requestAnimationFrame(gameLoop);
