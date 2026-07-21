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

function lineIntersect(a, b, c, d) {
  const det = (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x);
  if (det === 0) return false;
  const lambda = ((d.y - c.y) * (d.x - a.x) + (c.x - d.x) * (d.y - a.y)) / det;
  const gamma = ((a.y - b.y) * (d.x - a.x) + (b.x - a.x) * (d.y - a.y)) / det;
  return (0 <= lambda && lambda <= 1) && (0 <= gamma && gamma <= 1);
}

export function checkTerrainCollision(shipX, shipY, landerRadius = 20) {
  const distToMoonCenter = Math.hypot(shipX - MOON_CENTER.x, shipY - MOON_CENTER.y);

  // Early exit: skip if lander is high above the moon surface
  if (distToMoonCenter > MOON_RADIUS + 100) {
    return { collided: false, isLandingPad: false };
  }

  // Cast a short ray from ship center down to its landing feet (approx 25px towards moon center)
  const angleToCenter = Math.atan2(MOON_CENTER.y - shipY, MOON_CENTER.x - shipX);
  const p1 = { x: shipX, y: shipY };
  const p2 = {
    x: shipX + Math.cos(angleToCenter) * 25,
    y: shipY + Math.sin(angleToCenter) * 25
  };

  for (let i = 0; i < moonPoints.length; i++) {
    const nextIdx = (i + 1) % moonPoints.length;
    const a = moonPoints[i];
    const b = moonPoints[nextIdx];

    if (lineIntersect(p1, p2, a, b)) {
      // Line segments 72, 73, 74, 75 form the landing pad
      const isLandingPad = (i >= 72 && i <= 75);

      return {
        collided: true,
        isLandingPad: isLandingPad,
        index: i
      };
    }
  }

  return { collided: false, isLandingPad: false };
}
