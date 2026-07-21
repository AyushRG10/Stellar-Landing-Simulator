/**
 *  @param {CanvasRenderingContext2D} ctx
 *  @param {Object} keys
 *  @param {Object} lander
 */

export function drawShip(ctx, lander, keys) {
  ctx.save();
  ctx.rotate(lander.angle);

  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#05050a';

  ctx.beginPath();
  ctx.moveTo(-15, -40);
  ctx.lineTo(0, -60);
  ctx.lineTo(15, -40);
  ctx.lineTo(20, 20);
  ctx.lineTo(-20, 20);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#4ade80';
  ctx.beginPath();
  ctx.arc(0, -25, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath()
  ctx.moveTo(-20, 10);
  ctx.lineTo(-20, 10);
  ctx.lineTo(-35, 35);
  ctx.lineTo(-25, 35);
  ctx.lineTo(-35, 35);
  ctx.stroke();

  ctx.beginPath()
  ctx.moveTo(20, 10);
  ctx.lineTo(35, 35);
  ctx.lineTo(25, 35);
  ctx.lineTo(25, 35);
  ctx.lineTo(35, 35);
  ctx.stroke();

  if (keys.ArrowUp) {
    const flameLength = 25 + Math.random() * 15;

    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(-6, 28);
    ctx.lineTo(0, 28 + flameLength);
    ctx.lineTo(6, 28);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(-3, 28);
    ctx.lineTo(0, 28 + (flameLength * 0.6));
    ctx.lineTo(3, 28);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}
