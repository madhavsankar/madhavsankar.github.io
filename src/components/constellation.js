import React, { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@hooks';

const Constellation = () => {
  const canvasRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    const context = canvas?.getContext('2d');

    if (!canvas || !hero || !context) {
      return undefined;
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = { x: null, y: null };
    let width = 0;
    let height = 0;
    let particles = [];
    let frame = 0;
    let visible = true;

    const resizeCanvas = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = hero.clientWidth;
      height = hero.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.min(115, Math.max(50, Math.floor((width * height) / 11000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        radius: Math.random() * 1.3 + 0.6,
        opacity: Math.random() * 0.4 + 0.25,
      }));

      if (motionQuery.matches) draw();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const connectionDistance = 135;
      const connectionDistanceSquared = connectionDistance * connectionDistance;

      particles.forEach((particle, index) => {
        if (!motionQuery.matches) {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < 0 || particle.x > width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > height) particle.vy *= -1;

          if (pointer.x !== null && pointer.y !== null) {
            const dx = particle.x - pointer.x;
            const dy = particle.y - pointer.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 145 && distance > 1) {
              const force = (145 - distance) / 145;
              particle.x += (dx / distance) * force * 0.8;
              particle.y += (dy / distance) * force * 0.8;
            }
          }
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(255,255,255,${particle.opacity.toFixed(2)})`;
        context.fill();

        for (let next = index + 1; next < particles.length; next += 1) {
          const other = particles[next];
          const offsetX = particle.x - other.x;
          const offsetY = particle.y - other.y;
          const distanceSquared = offsetX * offsetX + offsetY * offsetY;
          if (distanceSquared < connectionDistanceSquared) {
            const alpha = (1 - distanceSquared / connectionDistanceSquared) * 0.2;
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
            context.lineWidth = 0.75;
            context.stroke();
          }
        }
      });

      frame = 0;
      if (visible && !motionQuery.matches) {
        frame = window.requestAnimationFrame(draw);
      }
    };

    const scheduleDraw = () => {
      if (visible && !motionQuery.matches && !frame) {
        frame = window.requestAnimationFrame(draw);
      }
    };

    const updatePointer = event => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
    };

    const clearPointer = () => {
      pointer.x = null;
      pointer.y = null;
    };

    const updateVisibility = entries => {
      visible = entries[0].isIntersecting;
      if (visible) {
        scheduleDraw();
      } else if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const updateMotion = () => {
      if (motionQuery.matches && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
        draw();
      } else {
        scheduleDraw();
      }
    };

    resizeCanvas();
    if (motionQuery.matches) {
      draw();
    } else {
      scheduleDraw();
    }
    window.addEventListener('resize', resizeCanvas);
    hero.addEventListener('pointermove', updatePointer);
    hero.addEventListener('pointerleave', clearPointer);
    motionQuery.addEventListener('change', updateMotion);
    const visibilityObserver =
      'IntersectionObserver' in window
        ? new IntersectionObserver(updateVisibility, { threshold: 0.05 })
        : null;
    visibilityObserver?.observe(hero);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      hero.removeEventListener('pointermove', updatePointer);
      hero.removeEventListener('pointerleave', clearPointer);
      motionQuery.removeEventListener('change', updateMotion);
      visibilityObserver?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  return <canvas ref={canvasRef} className="constellation" aria-hidden="true" />;
};

export default Constellation;
