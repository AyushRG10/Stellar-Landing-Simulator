export const MOON_CENTER = { x: 400, y: 1200 };
export const MOON_RADIUS = 800;

export const moonPoints = [];
const NUM_POINTS = 100;

for (let i = 0; i < NUM_POINTS; i++) {
  const angle = (i / NUM_POINTS) * Math.PI * 2;
  let variation = (Math.sin(i * 4) * 25) + (Math.cos(i * 8) * 15);
  if (i >= 72 && i <= 76) {
    variation = 0;
  }
  const r = MOON_RADIUS + variation;
  moonPoints.push({
    x: MOON_CENTER.x + Math.cos(angle) * r,
    y: MOON_CENTER.y + Math.sin(angle) * r
  })
}

/**
 * @param {CanvasRenderingContext2D}
 */

export function drawTerrain(ctx) {
  ctx.save();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#111118';

  ctx.beginPath();
  ctx.moveTo(moonPoints[0].x, moonPoints[0].y);
  for (let i = 1; i < moonPoints.length; i++) {
    ctx.lineTo(moonPoints[i].x, moonPoints[i].y);
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(moonPoints[72].x, moonPoints[72].y);
  ctx.lineTo(moonPoints[76].x, moonPoints[76].y);
  ctx.stroke();

  ctx.restore();
}
