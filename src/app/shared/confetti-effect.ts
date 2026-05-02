export class ConfettiEffect {
  static triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const colors = ['#667eea', '#764ba2', '#00c6ff', '#00ff99', '#FFD700'];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        speedX: Math.random() * 3 - 1.5,
        speedY: Math.random() * 5 + 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
      });
    }

    let animationId: number;

    function animate() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let activeParticles = 0;

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y < canvas.height + 100) {
          activeParticles++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (activeParticles > 0) {
        animationId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animationId);
        const canvasElem = document.getElementById('confetti-canvas');
        if (canvasElem) {
          canvasElem.style.display = 'none';
        }
      }
    }

    canvas.style.display = 'block';
    animate();

    setTimeout(() => {
      cancelAnimationFrame(animationId);
      canvas.style.display = 'none';
    }, 3000);
  }
}
