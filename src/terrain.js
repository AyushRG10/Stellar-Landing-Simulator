export const terrainPoints = [
  { x: -1000, y: 800 },
  { x: -500, y: 700 },
  { x: 0, y: 650 },
  { x: 300, y: 600 },
  { x: 450, y: 600 },
  { x: 550, y: 600 },
  { x: 700, y: 650 },
  { x: 1000, y: 500 },
  { x: 1500, y: 750 },
  { x: 2000, y: 800 }
];

/**
 * @param {CanvasRenderingContext2D} ctx
 */

export function drawTerrain(ctx) {
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.fillStyle = '111118';

  ctx.beginPath()
  ctx.moveTo(terrainPoints[0].x, terrainPoints[0].y)
  for (let i = 1; i < terrainPoints.length; i++) {
    ctx.lineTo(terrainPoints[i].x, terrainPoints[i].y)
  }

  const lastPoint = terrainPoints[terrainPoints.length - 1]
  ctx.lineTo(lastPoint.x, lastPoint.y + 1000)
  ctx.lineTo(terrainPoints[0].x, terrainPoints[0].y)
  ctx.closePath

  ctx.stroke()
  ctx.fill()

  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 4;
  ctx.beginPath()
  ctx.moveTo(450, 600);
  ctx.lineTo(550, 600);
  ctx.stroke();

  ctx.restore();
}
