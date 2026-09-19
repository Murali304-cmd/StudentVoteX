import React, { useEffect, useRef } from 'react';
import { subscribeBackgroundEvent, BG_EVENTS } from '../../services/eventBus';

/**
 * StudentVoiceX Premium Animated Background System
 * 
 * High-performance, full-screen 2D Canvas background rendering:
 * - Fluid undulating cyber nebulas (deep navy, royal blue, cyan, subtle violet)
 * - Dynamic constellation particle mesh with neural distance interconnects
 * - 6-Stage Democratic Blockchain Lifecycle Pipeline (Student -> Verification -> Vote -> Transaction -> Blockchain -> Validation)
 * - Gentle dampened cursor attraction & repulsion physics
 * - Real-time backend event visual shockwaves, laser beams, and traveling hash motes
 * - Zero React re-renders, visibility tab pausing, and prefers-reduced-motion detection
 * - Strict layout immunity: position: fixed, pointer-events: none, z-index: 0
 */

// Pipeline stage definitions
const PIPELINE_STAGES = [
  { id: 'STUDENT', label: 'STUDENT', sub: 'Auth & Identity', color: '#38bdf8', icon: '👤' },
  { id: 'VERIFY', label: 'VERIFICATION', sub: 'ZKP / OCR Gate', color: '#06b6d4', icon: '🛡️' },
  { id: 'VOTE', label: 'VOTE', sub: 'Encrypted Ballot', color: '#818cf8', icon: '🗳️' },
  { id: 'TX', label: 'TRANSACTION', sub: 'Signed Mempool', color: '#a855f7', icon: '⚡' },
  { id: 'BLOCKCHAIN', label: 'BLOCKCHAIN', sub: 'BFT Consensus', color: '#6366f1', icon: '⛓️' },
  { id: 'VALIDATION', label: 'VALIDATION', sub: 'Merkle Ledger', color: '#10b981', icon: '✓' }
];

export function BackgroundAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse state with smooth dampening lerp
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      isHovering: false,
      radius: 160
    };

    // Ambient floating particles
    const particles = [];
    const PARTICLE_COUNT = window.innerWidth < 768 ? 28 : 55;

    // Active visual FX collections (shockwaves, traveling packets, floating text tags)
    const shockwaves = [];
    const travelingPackets = [];
    const floatingBadges = [];

    // Resize and initialize canvas
    function resizeCanvas() {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initParticles();
    }

    // Initialize particle pool
    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseX: 0,
          baseY: 0,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 2 + 1.2,
          alpha: Math.random() * 0.5 + 0.2,
          baseAlpha: Math.random() * 0.4 + 0.2,
          color: ['#38bdf8', '#818cf8', '#06b6d4', '#a855f7', '#60a5fa'][Math.floor(Math.random() * 5)],
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.02
        });
      }
    }

    // Calculate dynamic coordinates of the 6 pipeline nodes
    function getPipelineNodePositions() {
      const isMobile = width < 768;
      const startX = isMobile ? width * 0.1 : width * 0.12;
      const endX = isMobile ? width * 0.9 : width * 0.88;
      const y = isMobile ? height * 0.92 : height * 0.88;
      const spacing = (endX - startX) / (PIPELINE_STAGES.length - 1);

      return PIPELINE_STAGES.map((stage, idx) => ({
        ...stage,
        index: idx,
        x: startX + idx * spacing,
        y: y,
        radius: isMobile ? 14 : 18
      }));
    }

    // Pointer move listener
    const onPointerMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isHovering = true;
    };

    const onPointerLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.isHovering = false;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave, { passive: true });
    window.addEventListener('resize', resizeCanvas);

    // Subscribe to real backend & system events
    const unsubscribeEvents = subscribeBackgroundEvent((event) => {
      const nodes = getPipelineNodePositions();
      const now = Date.now();

      switch (event.type) {
        case BG_EVENTS.LOGIN_SUCCESS: {
          // Radiant shockwave at Student & Verification node
          if (nodes[0]) {
            shockwaves.push({
              x: nodes[0].x,
              y: nodes[0].y,
              radius: 10,
              maxRadius: 180,
              color: '#38bdf8',
              alpha: 0.85,
              speed: 4.5
            });
          }
          // Launch traveling packet Student -> Verification
          if (nodes[0] && nodes[1]) {
            travelingPackets.push({
              fromNode: nodes[0],
              toNode: nodes[1],
              progress: 0,
              speed: 0.025,
              color: '#38bdf8',
              size: 5,
              label: 'Voter Token'
            });
          }
          floatingBadges.push({
            x: nodes[0]?.x || width * 0.2,
            y: (nodes[0]?.y || height * 0.85) - 35,
            text: 'Auth Verified ✓',
            color: '#38bdf8',
            alpha: 1,
            vy: -0.6
          });
          break;
        }

        case BG_EVENTS.ID_VERIFIED: {
          // Pulse at Verification node
          if (nodes[1]) {
            shockwaves.push({
              x: nodes[1].x,
              y: nodes[1].y,
              radius: 12,
              maxRadius: 190,
              color: '#06b6d4',
              alpha: 0.9,
              speed: 4.8
            });
            floatingBadges.push({
              x: nodes[1].x,
              y: nodes[1].y - 35,
              text: 'ID Verified ✓',
              color: '#06b6d4',
              alpha: 1,
              vy: -0.6
            });
          }
          break;
        }

        case BG_EVENTS.VOTE_CAST: {
          // Encrypted ballot travels across: Student -> Verify -> Vote -> Tx
          const pathSteps = [0, 1, 2, 3];
          pathSteps.forEach((stepIdx, i) => {
            setTimeout(() => {
              if (nodes[stepIdx] && nodes[stepIdx + 1]) {
                travelingPackets.push({
                  fromNode: nodes[stepIdx],
                  toNode: nodes[stepIdx + 1],
                  progress: 0,
                  speed: 0.035,
                  color: '#818cf8',
                  size: 6,
                  label: 'Encrypted Vote'
                });
                shockwaves.push({
                  x: nodes[stepIdx].x,
                  y: nodes[stepIdx].y,
                  radius: 8,
                  maxRadius: 130,
                  color: '#818cf8',
                  alpha: 0.8,
                  speed: 4
                });
              }
            }, i * 280);
          });

          floatingBadges.push({
            x: nodes[2]?.x || width * 0.45,
            y: (nodes[2]?.y || height * 0.85) - 40,
            text: 'Vote Cast 🗳️',
            color: '#818cf8',
            alpha: 1,
            vy: -0.7
          });
          break;
        }

        case BG_EVENTS.BLOCK_MINED: {
          // Massive golden/violet shockwave from Blockchain node
          if (nodes[4]) {
            shockwaves.push({
              x: nodes[4].x,
              y: nodes[4].y,
              radius: 15,
              maxRadius: 300,
              color: '#a855f7',
              alpha: 0.95,
              speed: 5.5
            });
            shockwaves.push({
              x: nodes[4].x,
              y: nodes[4].y,
              radius: 5,
              maxRadius: 220,
              color: '#38bdf8',
              alpha: 0.7,
              speed: 3.8
            });
            floatingBadges.push({
              x: nodes[4].x,
              y: nodes[4].y - 45,
              text: `Block Mined #${event.blockIndex || '✓'}`,
              color: '#c084fc',
              alpha: 1,
              vy: -0.6
            });
          }
          // Travel to validation
          if (nodes[4] && nodes[5]) {
            travelingPackets.push({
              fromNode: nodes[4],
              toNode: nodes[5],
              progress: 0,
              speed: 0.03,
              color: '#10b981',
              size: 5,
              label: 'Merkle Root'
            });
          }
          break;
        }

        case BG_EVENTS.TX_CONFIRMED: {
          if (nodes[3]) {
            shockwaves.push({
              x: nodes[3].x,
              y: nodes[3].y,
              radius: 10,
              maxRadius: 160,
              color: '#a855f7',
              alpha: 0.85,
              speed: 4.2
            });
            floatingBadges.push({
              x: nodes[3].x,
              y: nodes[3].y - 35,
              text: 'Tx Sealed ⚡',
              color: '#a855f7',
              alpha: 1,
              vy: -0.6
            });
          }
          break;
        }

        case BG_EVENTS.MERKLE_VERIFY:
        case BG_EVENTS.CHAIN_VALIDATED: {
          // Concentric verification resonance rings
          if (nodes[5]) {
            shockwaves.push({
              x: nodes[5].x,
              y: nodes[5].y,
              radius: 10,
              maxRadius: 280,
              color: '#10b981',
              alpha: 0.9,
              speed: 5
            });
            floatingBadges.push({
              x: nodes[5].x,
              y: nodes[5].y - 40,
              text: 'Ledger Validated ✓',
              color: '#10b981',
              alpha: 1,
              vy: -0.6
            });
          }
          break;
        }

        default:
          break;
      }
    });

    // Auto-pulse subtle ambient packets across pipeline periodically (every 7 seconds)
    let lastAmbientPulse = Date.now();

    // Initial setup
    resizeCanvas();

    // Main animation render loop
    let lastTime = performance.now();

    function render(currentTime) {
      if (document.hidden) {
        // Skip rendering when tab is inactive to save CPU/GPU cycles
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      const time = currentTime * 0.001;

      // Smooth mouse coordinates dampening
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // Clear Canvas and paint rich deep dark space cyber base
      ctx.fillStyle = '#070d1e';
      ctx.fillRect(0, 0, width, height);

      // -------------------------------------------------------------
      // 1. SOFT UNDULATING NEBULA GRADIENT WAVES (Deep Navy + Blue + Cyan + Violet)
      // -------------------------------------------------------------
      const grad1X = width * 0.25 + Math.sin(time * 0.35) * 140;
      const grad1Y = height * 0.35 + Math.cos(time * 0.3) * 100;
      const g1 = ctx.createRadialGradient(grad1X, grad1Y, 0, grad1X, grad1Y, width * 0.6);
      g1.addColorStop(0, 'rgba(2, 132, 199, 0.18)');
      g1.addColorStop(0.4, 'rgba(30, 58, 138, 0.12)');
      g1.addColorStop(0.8, 'rgba(15, 23, 42, 0.05)');
      g1.addColorStop(1, 'rgba(7, 13, 30, 0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const grad2X = width * 0.75 + Math.cos(time * 0.28) * 120;
      const grad2Y = height * 0.65 + Math.sin(time * 0.4) * 110;
      const g2 = ctx.createRadialGradient(grad2X, grad2Y, 0, grad2X, grad2Y, width * 0.55);
      g2.addColorStop(0, 'rgba(124, 58, 237, 0.16)');
      g2.addColorStop(0.5, 'rgba(67, 56, 202, 0.08)');
      g2.addColorStop(1, 'rgba(7, 13, 30, 0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      // Subtle cyan beacon center aura
      const grad3X = width * 0.5 + Math.sin(time * 0.2) * 80;
      const grad3Y = height * 0.5 + Math.cos(time * 0.25) * 60;
      const g3 = ctx.createRadialGradient(grad3X, grad3Y, 0, grad3X, grad3Y, width * 0.45);
      g3.addColorStop(0, 'rgba(6, 182, 212, 0.09)');
      g3.addColorStop(1, 'rgba(7, 13, 30, 0)');
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, width, height);

      // -------------------------------------------------------------
      // 2. CONSTELLATION NETWORK MESH WITH DISTANCE INTERCONNECTS
      // -------------------------------------------------------------
      const maxDistance = 145;

      // Update and draw network lines between particles
      ctx.lineWidth = 0.9;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.28;
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw floating particles with gentle mouse repulsion
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          // Natural drift
          p.x += p.vx;
          p.y += p.vy;

          // Boundary bouncing / wrap
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Gentle mouse interaction (smooth repulsion + swirl)
          if (mouse.x > 0 && mouse.y > 0) {
            const mdx = p.x - mouse.x;
            const mdy = p.y - mouse.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

            if (mdist < mouse.radius && mdist > 0) {
              const force = (1 - mdist / mouse.radius) * 1.8;
              const angle = Math.atan2(mdy, mdx);
              p.x += Math.cos(angle) * force;
              p.y += Math.sin(angle) * force;
            }
          }
        }

        // Particle pulse
        p.pulsePhase += p.pulseSpeed;
        const currentAlpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.15;

        // Draw particle halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${Math.max(0, currentAlpha * 0.25)})`;
        ctx.fill();

        // Draw particle core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha));
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // -------------------------------------------------------------
      // 3. 6-STAGE DEMOCRATIC BLOCKCHAIN LIFECYCLE PIPELINE
      // -------------------------------------------------------------
      const pipelineNodes = getPipelineNodePositions();

      // Draw connecting pipeline background track
      if (pipelineNodes.length > 1) {
        ctx.beginPath();
        ctx.moveTo(pipelineNodes[0].x, pipelineNodes[0].y);
        for (let i = 1; i < pipelineNodes.length; i++) {
          ctx.lineTo(pipelineNodes[i].x, pipelineNodes[i].y);
        }
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash

        // Subtle glowing flow along the pipeline
        const gradientLine = ctx.createLinearGradient(
          pipelineNodes[0].x, pipelineNodes[0].y,
          pipelineNodes[pipelineNodes.length - 1].x, pipelineNodes[pipelineNodes.length - 1].y
        );
        gradientLine.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
        gradientLine.addColorStop(0.3, 'rgba(6, 182, 212, 0.35)');
        gradientLine.addColorStop(0.6, 'rgba(168, 85, 247, 0.35)');
        gradientLine.addColorStop(1, 'rgba(16, 185, 129, 0.35)');

        ctx.strokeStyle = gradientLine;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Draw each pipeline node
      pipelineNodes.forEach((node) => {
        // Distance to mouse for hover attraction glow
        const mdx = node.x - mouse.x;
        const mdy = node.y - mouse.y;
        const isNearMouse = Math.sqrt(mdx * mdx + mdy * mdy) < 70;

        // Breathing pulse
        const pulse = Math.sin(time * 2 + node.index * 0.8) * 3;
        const nodeRadius = node.radius + (isNearMouse ? 3 : 0);

        // Outer pulsing beacon halo
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius + 9 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}18`;
        ctx.fill();

        // Inner glowing border ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius + 3, 0, Math.PI * 2);
        ctx.strokeStyle = isNearMouse ? node.color : `${node.color}66`;
        ctx.lineWidth = isNearMouse ? 2 : 1.2;
        ctx.stroke();

        // Node dark core
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();

        // Node center dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Micro label
        if (width >= 640) {
          ctx.font = '600 9px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillStyle = isNearMouse ? '#ffffff' : 'rgba(203, 213, 225, 0.75)';
          ctx.fillText(node.label, node.x, node.y + nodeRadius + 14);

          ctx.font = '400 8px "Inter", sans-serif';
          ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
          ctx.fillText(node.sub, node.x, node.y + nodeRadius + 24);
        }
      });

      // -------------------------------------------------------------
      // 4. PERIODIC AMBIENT DATA PARTICLES ALONG PIPELINE
      // -------------------------------------------------------------
      const now = Date.now();
      if (now - lastAmbientPulse > 4500 && !prefersReducedMotion) {
        lastAmbientPulse = now;
        const randomStage = Math.floor(Math.random() * (pipelineNodes.length - 1));
        if (pipelineNodes[randomStage] && pipelineNodes[randomStage + 1]) {
          travelingPackets.push({
            fromNode: pipelineNodes[randomStage],
            toNode: pipelineNodes[randomStage + 1],
            progress: 0,
            speed: 0.018 + Math.random() * 0.012,
            color: pipelineNodes[randomStage].color,
            size: 3.5,
            label: null
          });
        }
      }

      // -------------------------------------------------------------
      // 5. TRAVELING DATA PACKETS & TRANSACTION BEAMS
      // -------------------------------------------------------------
      for (let i = travelingPackets.length - 1; i >= 0; i--) {
        const packet = travelingPackets[i];
        packet.progress += packet.speed;

        if (packet.progress >= 1) {
          // Reached destination -> create mini shockwave at target
          shockwaves.push({
            x: packet.toNode.x,
            y: packet.toNode.y,
            radius: 6,
            maxRadius: 55,
            color: packet.color,
            alpha: 0.75,
            speed: 3
          });
          travelingPackets.splice(i, 1);
          continue;
        }

        const currX = packet.fromNode.x + (packet.toNode.x - packet.fromNode.x) * packet.progress;
        const currY = packet.fromNode.y + (packet.toNode.y - packet.fromNode.y) * packet.progress;

        // Glowing particle head
        ctx.beginPath();
        ctx.arc(currX, currY, packet.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `${packet.color}44`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(currX, currY, packet.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Optional micro packet label
        if (packet.label && width > 640) {
          ctx.font = '500 8px "JetBrains Mono", monospace';
          ctx.fillStyle = packet.color;
          ctx.textAlign = 'center';
          ctx.fillText(packet.label, currX, currY - 10);
        }
      }

      // -------------------------------------------------------------
      // 6. REAL-TIME SHOCKWAVE EXPANSIONS
      // -------------------------------------------------------------
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += sw.speed;
        sw.alpha -= sw.speed / sw.maxRadius;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = Math.max(1, (1 - sw.radius / sw.maxRadius) * 3);
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // -------------------------------------------------------------
      // 7. FLOATING TRANSIENT SYSTEM BADGES
      // -------------------------------------------------------------
      for (let i = floatingBadges.length - 1; i >= 0; i--) {
        const badge = floatingBadges[i];
        badge.y += badge.vy;
        badge.alpha -= 0.012;

        if (badge.alpha <= 0) {
          floatingBadges.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, badge.alpha);
        ctx.font = '700 11px "Outfit", var(--font-sans)';
        ctx.textAlign = 'center';

        // Badge pill background
        const textWidth = ctx.measureText(badge.text).width;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = badge.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(badge.x - textWidth / 2 - 10, badge.y - 14, textWidth + 20, 20, [10]);
        ctx.fill();
        ctx.stroke();

        // Badge text
        ctx.fillStyle = badge.color;
        ctx.fillText(badge.text, badge.x, badge.y);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    }

    // Start animation loop
    animationFrameId = requestAnimationFrame(render);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('resize', resizeCanvas);
      unsubscribeEvents();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}

export default BackgroundAnimation;
