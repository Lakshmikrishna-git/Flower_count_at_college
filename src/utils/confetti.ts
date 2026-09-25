// Procedural flower petal confetti animation
export function firePetalConfetti() {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const petalColors = [
    '#f43f5e', // hibiscus rose
    '#fb7185', // soft petal pink
    '#f59e0b', // marigold orange
    '#fbbf24', // yellow stamen
    '#ec4899', // bougainvillea magenta
    '#34d399', // fresh leaf green
    '#fff1f2', // jasmine cream
  ];

  interface Petal {
    x: number;
    y: number;
    size: number;
    color: string;
    speedX: number;
    speedY: number;
    rotation: number;
    rotationSpeed: number;
    tilt: number;
    tiltSpeed: number;
    opacity: number;
  }

  const petals: Petal[] = [];
  const petalCount = 65;

  for (let i = 0; i < petalCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: -30 - Math.random() * 120,
      size: 9 + Math.random() * 12,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      speedX: -2 + Math.random() * 4,
      speedY: 2.2 + Math.random() * 3.5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: -0.04 + Math.random() * 0.08,
      tilt: Math.random() * Math.PI,
      tiltSpeed: 0.03 + Math.random() * 0.05,
      opacity: 0.95,
    });
  }

  let animationFrameId: number;
  const startTime = Date.now();
  const maxDuration = 3600; // 3.6 seconds

  function draw() {
    const elapsed = Date.now() - startTime;
    if (elapsed > maxDuration) {
      cancelAnimationFrame(animationFrameId);
      canvas.remove();
      return;
    }

    ctx?.clearRect(0, 0, width, height);

    let activePetals = 0;
    for (const p of petals) {
      p.x += p.speedX + Math.sin(p.tilt) * 1.2;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;
      p.tilt += p.tiltSpeed;

      if (p.y < height + 40) {
        activePetals++;
      }

      ctx?.save();
      ctx?.translate(p.x, p.y);
      ctx?.rotate(p.rotation);
      ctx?.scale(Math.cos(p.tilt), 1);

      if (ctx) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        // Draw organic teardrop flower petal
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.quadraticCurveTo(p.size * 0.7, -p.size * 0.4, p.size * 0.5, p.size * 0.5);
        ctx.quadraticCurveTo(0, p.size, -p.size * 0.5, p.size * 0.5);
        ctx.quadraticCurveTo(-p.size * 0.7, -p.size * 0.4, 0, -p.size);
        ctx.fill();
      }

      ctx?.restore();
    }

    if (activePetals > 0) {
      animationFrameId = requestAnimationFrame(draw);
    } else {
      canvas.remove();
    }
  }

  animationFrameId = requestAnimationFrame(draw);
}
