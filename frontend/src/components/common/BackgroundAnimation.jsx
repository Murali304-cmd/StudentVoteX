import React, { useEffect, useRef } from 'react';
import { subscribeBackgroundEvent, BG_EVENTS } from '../../services/eventBus';

/**
 * StudentVoiceX Next-Generation Multi-Mode Animated Background System
 * 
 * Features:
 * - 3 Adaptive FX Modes:
 *   1. 'cyber': 6-Stage Democratic Blockchain Pipeline + Neural Particle Constellations + Traveling Tokens
 *   2. 'aurora': Fluid undulating chromatic Aurora Borealis plasma waves with radiant cosmic orbs
 *   3. 'matrix': 3D Perspective Holographic Cyber Grid with scanning laser lines & floating cryptographic glyphs
 * - Light Mode / Dark Mode dynamic palette auto-adaptation
 * - Responsive particle density scaling (Mobile, Tablet, Desktop)
 * - Real-time backend event shockwaves, traveling packets, and floating badges
 * - Pointer interaction: dampening attraction, swirl physics, and hover highlights
 * - Zero React re-renders during 60FPS animation loop
 * - Tab visibility detection for CPU/GPU power efficiency
 */

const PIPELINE_STAGES = [
  { id: 'STUDENT', label: 'STUDENT', sub: 'Auth & Identity', color: '#38bdf8', icon: '👤' },
  { id: 'VERIFY', label: 'VERIFICATION', sub: 'ZKP / OCR Gate', color: '#06b6d4', icon: '🛡️' },
  { id: 'VOTE', label: 'VOTE', sub: 'Encrypted Ballot', color: '#818cf8', icon: '🗳️' },
  { id: 'TX', label: 'TRANSACTION', sub: 'Signed Mempool', color: '#a855f7', icon: '⚡' },
  { id: 'BLOCKCHAIN', label: 'BLOCKCHAIN', sub: 'BFT Consensus', color: '#6366f1', icon: '⛓️' },
  { id: 'VALIDATION', label: 'VALIDATION', sub: 'Merkle Ledger', color: '#10b981', icon: '✓' }
];

const CRYPTO_GLYPHS = ['SHA-256', '0x9E4F', 'MERKLE', 'BFT-CONSENSUS', 'ZK-PROOF', 'SEALED', '0x1A2B', 'VOTE_AES', 'BLOCK#42', 'NODE_SYNC'];

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

    // Current Mode & Theme State
    let currentMode = localStorage.getItem('votechain_bg_mode') || 'cyber';
    let isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    let densityPref = localStorage.getItem('votechain_particle_density') || 'normal';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse Physics State
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      isHovering: false,
      radius: 170
    };

    // Particles & Visual FX Collections
    const particles = [];
    const shockwaves = [];
    const travelingPackets = [];
    const floatingBadges = [];
    const matrixGlyphs = [];
    const matrixColumns = [];

    const MATRIX_CHARS = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜXYZΨΩλΣ⬡◈⚡🔒⛓️01';

    function initMatrixColumns() {
      matrixColumns.length = 0;
      const fontSize = window.innerWidth < 768 ? 13 : 15;
      const colCount = Math.max(16, Math.floor(width / fontSize));
      for (let i = 0; i < colCount; i++) {
        const length = Math.floor(12 + Math.random() * 24);
        const chars = [];
        for (let c = 0; c < length; c++) {
          chars.push(MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]);
        }
        matrixColumns.push({
          x: i * fontSize + 4,
          y: (Math.random() * -height) * 0.9,
          speed: 1.3 + Math.random() * 2.7,
          length,
          fontSize,
          chars,
          nextMutation: Math.random() * 8
        });
      }
    }

    function getParticleCount() {
      const base = window.innerWidth < 768 ? 26 : 56;
      if (densityPref === 'low') return Math.floor(base * 0.6);
      if (densityPref === 'high') return Math.floor(base * 1.5);
      return base;
    }

    // Initialize Canvas Dimensions
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
      initMatrixGlyphs();
      initMatrixColumns();
    }

    // Initialize Constellation Particles
    function initParticles() {
      particles.length = 0;
      const count = getParticleCount();
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 2 + 1.2,
          alpha: Math.random() * 0.5 + 0.2,
          baseAlpha: Math.random() * 0.4 + 0.25,
          color: ['#38bdf8', '#818cf8', '#06b6d4', '#a855f7', '#60a5fa', '#34d399'][Math.floor(Math.random() * 6)],
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.02
        });
      }
    }

    // Initialize Matrix Glyphs
    function initMatrixGlyphs() {
      matrixGlyphs.length = 0;
      const glyphCount = window.innerWidth < 768 ? 10 : 22;
      for (let i = 0; i < glyphCount; i++) {
        matrixGlyphs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          text: CRYPTO_GLYPHS[Math.floor(Math.random() * CRYPTO_GLYPHS.length)],
          vy: -(0.3 + Math.random() * 0.5),
          alpha: Math.random() * 0.4 + 0.15,
          size: Math.floor(Math.random() * 3) + 9,
          color: Math.random() > 0.4 ? '#38bdf8' : '#34d399'
        });
      }
    }

    // 6 Pipeline Node Coordinates
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

    // Pointer Listeners
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

    // Mode / Density / Theme Change Listeners
    const onModeChange = (e) => {
      if (e.detail?.mode) {
        currentMode = e.detail.mode;
        if (currentMode === 'matrix' && matrixColumns.length === 0) {
          initMatrixColumns();
        }
      }
    };

    const onDensityChange = (e) => {
      if (e.detail?.density) {
        densityPref = e.detail.density;
        initParticles();
      }
    };

    const themeObserver = new MutationObserver(() => {
      isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave, { passive: true });
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('votechain:bg-mode-changed', onModeChange);
    window.addEventListener('votechain:density-changed', onDensityChange);

    // Event Bus Subscription for real-time visual reactions
    const unsubscribeEvents = subscribeBackgroundEvent((event) => {
      const nodes = getPipelineNodePositions();
      const nodeX = (idx) => nodes[idx]?.x || width * 0.5;
      const nodeY = (idx) => nodes[idx]?.y || height * 0.88;

      switch (event.type) {
        case BG_EVENTS.LOGIN_SUCCESS: {
          shockwaves.push({
            x: nodeX(0),
            y: nodeY(0),
            radius: 12,
            maxRadius: 180,
            color: '#38bdf8',
            alpha: 0.9,
            speed: 4.8
          });
          if (nodes[0] && nodes[1]) {
            travelingPackets.push({
              fromNode: nodes[0],
              toNode: nodes[1],
              progress: 0,
              speed: 0.026,
              color: '#38bdf8',
              size: 5.5,
              label: 'Voter Token'
            });
          }
          floatingBadges.push({
            x: nodeX(0),
            y: nodeY(0) - 36,
            text: 'Auth Verified ✓',
            color: '#38bdf8',
            alpha: 1,
            vy: -0.6
          });
          break;
        }

        case BG_EVENTS.ID_VERIFIED: {
          shockwaves.push({
            x: nodeX(1),
            y: nodeY(1),
            radius: 12,
            maxRadius: 190,
            color: '#06b6d4',
            alpha: 0.9,
            speed: 4.8
          });
          floatingBadges.push({
            x: nodeX(1),
            y: nodeY(1) - 36,
            text: 'ID Verified ✓',
            color: '#06b6d4',
            alpha: 1,
            vy: -0.6
          });
          break;
        }

        case BG_EVENTS.VOTE_CAST: {
          const pathSteps = [0, 1, 2, 3];
          pathSteps.forEach((stepIdx, i) => {
            setTimeout(() => {
              if (nodes[stepIdx] && nodes[stepIdx + 1]) {
                travelingPackets.push({
                  fromNode: nodes[stepIdx],
                  toNode: nodes[stepIdx + 1],
                  progress: 0,
                  speed: 0.038,
                  color: '#818cf8',
                  size: 6,
                  label: 'Encrypted Vote'
                });
                shockwaves.push({
                  x: nodes[stepIdx].x,
                  y: nodes[stepIdx].y,
                  radius: 8,
                  maxRadius: 140,
                  color: '#818cf8',
                  alpha: 0.85,
                  speed: 4.2
                });
              }
            }, i * 260);
          });

          floatingBadges.push({
            x: nodeX(2),
            y: nodeY(2) - 40,
            text: 'Vote Cast 🗳️',
            color: '#818cf8',
            alpha: 1,
            vy: -0.7
          });
          break;
        }

        case BG_EVENTS.BLOCK_MINED: {
          shockwaves.push({
            x: nodeX(4),
            y: nodeY(4),
            radius: 15,
            maxRadius: 320,
            color: '#a855f7',
            alpha: 0.95,
            speed: 5.5
          });
          floatingBadges.push({
            x: nodeX(4),
            y: nodeY(4) - 45,
            text: `Block Mined #${event.blockIndex || '✓'}`,
            color: '#c084fc',
            alpha: 1,
            vy: -0.6
          });
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
          shockwaves.push({
            x: nodeX(3),
            y: nodeY(3),
            radius: 10,
            maxRadius: 170,
            color: '#a855f7',
            alpha: 0.85,
            speed: 4.2
          });
          floatingBadges.push({
            x: nodeX(3),
            y: nodeY(3) - 35,
            text: 'Tx Sealed ⚡',
            color: '#a855f7',
            alpha: 1,
            vy: -0.6
          });
          break;
        }

        case BG_EVENTS.MERKLE_VERIFY:
        case BG_EVENTS.CHAIN_VALIDATED: {
          shockwaves.push({
            x: nodeX(5),
            y: nodeY(5),
            radius: 10,
            maxRadius: 280,
            color: '#10b981',
            alpha: 0.9,
            speed: 5
          });
          floatingBadges.push({
            x: nodeX(5),
            y: nodeY(5) - 40,
            text: 'Ledger Validated ✓',
            color: '#10b981',
            alpha: 1,
            vy: -0.6
          });
          break;
        }

        default:
          break;
      }
    });

    let lastAmbientPulse = Date.now();
    resizeCanvas();

    // Main 60FPS Render Loop
    function render(currentTime) {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const time = currentTime * 0.001;

      // Smooth mouse coordinates dampening
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // -------------------------------------------------------------
      // 1. BASE CANVAS BACKGROUND (Dynamic by Light / Dark Theme)
      // -------------------------------------------------------------
      if (isDarkTheme) {
        ctx.fillStyle = currentMode === 'matrix' ? '#020906' : '#070d1e';
      } else {
        ctx.fillStyle = '#f8fafc';
      }
      ctx.fillRect(0, 0, width, height);

      // -------------------------------------------------------------
      // 2. RENDER SELECTED VISUAL MODE
      // -------------------------------------------------------------
      if (currentMode === 'aurora') {
        renderAuroraMode(time);
      } else if (currentMode === 'matrix') {
        renderMatrixMode(time);
      } else {
        // Default 'cyber' mode
        renderCyberNebulas(time);
      }

      // Constellation network particles (shared across cyber & aurora modes)
      if (currentMode !== 'matrix') {
        renderParticleMesh(time);
      }

      // Render 6-Stage Democratic Pipeline in cyber mode
      if (currentMode === 'cyber') {
        renderBlockchainPipeline(time);
        renderTravelingPackets();
      }

      // Render Shockwaves & Floating Badges
      renderShockwaves();
      renderFloatingBadges();

      animationFrameId = requestAnimationFrame(render);
    }

    // --- CYBER NEBULAS ---
    function renderCyberNebulas(time) {
      const grad1X = width * 0.25 + Math.sin(time * 0.35) * 140;
      const grad1Y = height * 0.35 + Math.cos(time * 0.3) * 100;
      const g1 = ctx.createRadialGradient(grad1X, grad1Y, 0, grad1X, grad1Y, width * 0.6);
      if (isDarkTheme) {
        g1.addColorStop(0, 'rgba(2, 132, 199, 0.20)');
        g1.addColorStop(0.4, 'rgba(30, 58, 138, 0.14)');
        g1.addColorStop(0.8, 'rgba(15, 23, 42, 0.05)');
        g1.addColorStop(1, 'rgba(7, 13, 30, 0)');
      } else {
        g1.addColorStop(0, 'rgba(56, 189, 248, 0.18)');
        g1.addColorStop(0.4, 'rgba(147, 197, 253, 0.12)');
        g1.addColorStop(0.8, 'rgba(241, 245, 249, 0.04)');
        g1.addColorStop(1, 'rgba(248, 250, 252, 0)');
      }
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const grad2X = width * 0.75 + Math.cos(time * 0.28) * 120;
      const grad2Y = height * 0.65 + Math.sin(time * 0.4) * 110;
      const g2 = ctx.createRadialGradient(grad2X, grad2Y, 0, grad2X, grad2Y, width * 0.55);
      if (isDarkTheme) {
        g2.addColorStop(0, 'rgba(124, 58, 237, 0.18)');
        g2.addColorStop(0.5, 'rgba(67, 56, 202, 0.09)');
        g2.addColorStop(1, 'rgba(7, 13, 30, 0)');
      } else {
        g2.addColorStop(0, 'rgba(129, 140, 248, 0.16)');
        g2.addColorStop(0.5, 'rgba(199, 210, 254, 0.08)');
        g2.addColorStop(1, 'rgba(248, 250, 252, 0)');
      }
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);
    }

    // --- AURORA BOREALIS MODE ---
    function renderAuroraMode(time) {
      const waves = [
        { color1: isDarkTheme ? 'rgba(6, 182, 212, 0.22)' : 'rgba(6, 182, 212, 0.18)', color2: 'rgba(56, 189, 248, 0)', speed: 0.4, amp: 70, freq: 0.003, yOffset: height * 0.35 },
        { color1: isDarkTheme ? 'rgba(124, 58, 237, 0.20)' : 'rgba(129, 140, 248, 0.16)', color2: 'rgba(168, 85, 247, 0)', speed: 0.3, amp: 85, freq: 0.0025, yOffset: height * 0.55 },
        { color1: isDarkTheme ? 'rgba(16, 185, 129, 0.18)' : 'rgba(52, 211, 153, 0.14)', color2: 'rgba(5, 150, 105, 0)', speed: 0.35, amp: 60, freq: 0.0035, yOffset: height * 0.72 }
      ];

      waves.forEach((w) => {
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 15) {
          const y = w.yOffset + Math.sin(x * w.freq + time * w.speed) * w.amp + Math.cos(x * w.freq * 0.6 + time * 0.2) * 30;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, w.yOffset - w.amp, 0, height);
        grad.addColorStop(0, w.color1);
        grad.addColorStop(0.6, w.color2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
    }

    // --- UNIQUE 3D CRYPTOGRAPHIC GYROSCOPE & QUANTUM MATRIX NEXUS ---
    function renderMatrixMode(time) {
      ctx.save();

      const cx = width * 0.5;
      const cy = height * 0.44;
      const focal = 620;

      // Mouse parallax tilt
      const mouseTiltX = ((mouse.x - cx) / Math.max(1, width)) * 0.42;
      const mouseTiltY = ((mouse.y - cy) / Math.max(1, height)) * 0.42;

      // 1. Central Quantum Aura & Ambient Glow
      const coreAura = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.min(width, height) * 0.6);
      coreAura.addColorStop(0, 'rgba(0, 255, 136, 0.12)');
      coreAura.addColorStop(0.35, 'rgba(6, 182, 212, 0.06)');
      coreAura.addColorStop(0.7, 'rgba(7, 20, 15, 0.02)');
      coreAura.addColorStop(1, 'rgba(2, 6, 4, 0)');
      ctx.fillStyle = coreAura;
      ctx.fillRect(0, 0, width, height);

      // 2. 3D Holographic Gyroscope Cryptographic Rings
      const rings = [
        {
          radius: Math.min(width * 0.34, 290),
          rotX: time * 0.32 + mouseTiltY,
          rotY: time * 0.46 + mouseTiltX,
          rotZ: time * 0.14,
          color: '#00ff88',
          subColor: 'rgba(0, 255, 136, 0.35)',
          segments: 48,
          hasLabels: true
        },
        {
          radius: Math.min(width * 0.25, 210),
          rotX: -time * 0.42 + mouseTiltY * 0.8,
          rotY: -time * 0.28 + mouseTiltX * 0.8,
          rotZ: time * 0.38,
          color: '#38bdf8',
          subColor: 'rgba(56, 189, 248, 0.35)',
          segments: 36,
          hasLabels: false
        },
        {
          radius: Math.min(width * 0.16, 130),
          rotX: time * 0.62 - mouseTiltY,
          rotY: -time * 0.62 - mouseTiltX,
          rotZ: -time * 0.48,
          color: '#a78bfa',
          subColor: 'rgba(167, 139, 250, 0.4)',
          segments: 24,
          hasLabels: true
        }
      ];

      // Draw 3D Orbiting Rings with Perspective
      rings.forEach((ring, rIdx) => {
        const points = [];
        const step = (Math.PI * 2) / ring.segments;

        for (let i = 0; i <= ring.segments; i++) {
          const theta = i * step;
          let px = ring.radius * Math.cos(theta);
          let py = ring.radius * Math.sin(theta);
          let pz = 0;

          // X rotation
          let y1 = py * Math.cos(ring.rotX) - pz * Math.sin(ring.rotX);
          let z1 = py * Math.sin(ring.rotX) + pz * Math.cos(ring.rotX);

          // Y rotation
          let x2 = px * Math.cos(ring.rotY) + z1 * Math.sin(ring.rotY);
          let z2 = -px * Math.sin(ring.rotY) + z1 * Math.cos(ring.rotY);

          // Z rotation
          let x3 = x2 * Math.cos(ring.rotZ) - y1 * Math.sin(ring.rotZ);
          let y3 = x2 * Math.sin(ring.rotZ) + y1 * Math.cos(ring.rotZ);

          // Perspective Projection
          const scale = focal / (focal + z2 + 220);
          const screenX = cx + x3 * scale;
          const screenY = cy + y3 * scale;
          const depthAlpha = Math.max(0.15, Math.min(1, (z2 + ring.radius) / (ring.radius * 2)));

          points.push({ screenX, screenY, depthAlpha, z: z2, theta, scale });
        }

        // Draw Ring Perimeter with Depth Luminosity
        for (let i = 0; i < points.length - 1; i++) {
          const pA = points[i];
          const pB = points[i + 1];

          ctx.beginPath();
          ctx.moveTo(pA.screenX, pA.screenY);
          ctx.lineTo(pB.screenX, pB.screenY);
          ctx.strokeStyle = ring.color;
          ctx.globalAlpha = pA.depthAlpha * 0.72;
          ctx.lineWidth = Math.max(1, pA.scale * 1.8);
          ctx.stroke();

          // Render glowing tick nodes
          if (i % 4 === 0) {
            ctx.beginPath();
            ctx.arc(pA.screenX, pA.screenY, Math.max(1.5, pA.scale * 2.8), 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = ring.color;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }

        // Cryptographic Hash Badges
        if (ring.hasLabels && rIdx === 0) {
          const labels = ['0x9E4F // SHA-256', 'MERKLE_PROOF: VALID', 'BFT_CONSENSUS_4/4', 'GENESIS#001'];
          labels.forEach((lbl, lIdx) => {
            const ptIdx = Math.floor((points.length / labels.length) * lIdx);
            const pt = points[ptIdx];
            if (pt && pt.depthAlpha > 0.45) {
              ctx.font = '700 9px "JetBrains Mono", monospace';
              ctx.fillStyle = ring.color;
              ctx.globalAlpha = pt.depthAlpha * 0.9;
              ctx.fillText(lbl, pt.screenX + 8, pt.screenY - 4);
            }
          });
        }
      });

      // 3. Central Glowing Merkle Quantum Hex Core
      const corePulse = Math.sin(time * 3) * 4;
      const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 28 + corePulse);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.2, '#00ff88');
      coreGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.4)');
      coreGrad.addColorStop(1, 'rgba(0, 255, 136, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 28 + corePulse, 0, Math.PI * 2);
      ctx.fill();

      // Core Hexagon Wireframe
      ctx.beginPath();
      for (let h = 0; h < 6; h++) {
        const hAngle = (h * Math.PI) / 3 + time * 0.8;
        const hx = cx + Math.cos(hAngle) * (14 + corePulse * 0.5);
        const hy = cy + Math.sin(hAngle) * (14 + corePulse * 0.5);
        if (h === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 4. Undulating 3D Cyber Mesh Floor
      const floorHorizon = height * 0.62;
      const gridCols = 22;
      const gridRows = 10;
      ctx.lineWidth = 1;

      // Perspective Rays
      for (let c = 0; c <= gridCols; c++) {
        const u = c / gridCols;
        const bottomX = (u - 0.5) * (width * 1.5) + cx;
        ctx.beginPath();
        ctx.moveTo(cx, floorHorizon);
        ctx.lineTo(bottomX, height);
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.12)';
        ctx.stroke();
      }

      // Undulating Horizontal Rungs
      for (let r = 1; r <= gridRows; r++) {
        const rowNorm = r / gridRows;
        const depth = Math.pow(rowNorm, 2.4);
        const rungY = floorHorizon + depth * (height - floorHorizon);

        ctx.beginPath();
        for (let x = 0; x <= width; x += 30) {
          const wave = Math.sin(x * 0.008 + time * 2 + r * 0.8) * (8 * depth);
          const py = rungY + wave;
          if (x === 0) ctx.moveTo(x, py);
          else ctx.lineTo(x, py);
        }
        ctx.strokeStyle = `rgba(0, 255, 136, ${0.08 + depth * 0.22})`;
        ctx.stroke();
      }

      // 5. Floating Cryptographic Glyph Particles & Quantum Nodes
      if (matrixGlyphs.length === 0) {
        initMatrixGlyphs();
      }
      ctx.font = '600 11px "JetBrains Mono", monospace';
      matrixGlyphs.forEach((g) => {
        g.y += g.vy * 1.2;
        if (g.y < -20) {
          g.y = height + 20;
          g.x = Math.random() * width;
        }
        const dx = mouse.x - g.x;
        const dy = mouse.y - g.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140 && mouse.isHovering) {
          const push = (1 - dist / 140) * 2;
          g.x -= (dx / dist) * push;
          g.y -= (dy / dist) * push;
        }

        ctx.fillStyle = g.color || '#00ff88';
        ctx.globalAlpha = g.alpha * (0.6 + Math.sin(time * 3 + g.x) * 0.3);
        ctx.fillText(g.text, g.x, g.y);
      });

      // 6. Interactive Mouse Energy Ring
      if (mouse.isHovering && mouse.x > 0) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 35, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#00ff88';
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = 1;
      ctx.restore();
    }

    // --- PARTICLE CONSTELLATION MESH ---
    function renderParticleMesh(time) {
      const maxDistance = 145;
      const strokeBase = isDarkTheme ? '56, 189, 248' : '2, 132, 199';

      // Distance Interconnect Lines
      ctx.lineWidth = 0.85;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * (isDarkTheme ? 0.28 : 0.20);
            ctx.strokeStyle = `rgba(${strokeBase}, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Mouse Repulsion & Swirl
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

        p.pulsePhase += p.pulseSpeed;
        const currentAlpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.15;

        // Halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${strokeBase}, ${Math.max(0, currentAlpha * 0.22)})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDarkTheme ? p.color : (i % 2 === 0 ? '#0284c7' : '#4f46e5');
        ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha));
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // --- 6-STAGE BLOCKCHAIN PIPELINE ---
    function renderBlockchainPipeline(time) {
      const pipelineNodes = getPipelineNodePositions();
      if (pipelineNodes.length < 2) return;

      // Track line
      ctx.beginPath();
      ctx.moveTo(pipelineNodes[0].x, pipelineNodes[0].y);
      for (let i = 1; i < pipelineNodes.length; i++) {
        ctx.lineTo(pipelineNodes[i].x, pipelineNodes[i].y);
      }
      ctx.strokeStyle = isDarkTheme ? 'rgba(56, 189, 248, 0.20)' : 'rgba(2, 132, 199, 0.18)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Flow gradient line
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

      // Nodes
      pipelineNodes.forEach((node) => {
        const mdx = node.x - mouse.x;
        const mdy = node.y - mouse.y;
        const isNearMouse = Math.sqrt(mdx * mdx + mdy * mdy) < 70;

        const pulse = Math.sin(time * 2 + node.index * 0.8) * 3;
        const nodeRadius = node.radius + (isNearMouse ? 3 : 0);

        // Halo
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius + 9 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}18`;
        ctx.fill();

        // Border
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius + 3, 0, Math.PI * 2);
        ctx.strokeStyle = isNearMouse ? node.color : `${node.color}77`;
        ctx.lineWidth = isNearMouse ? 2 : 1.2;
        ctx.stroke();

        // Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = isDarkTheme ? '#0f172a' : '#ffffff';
        ctx.fill();

        // Center dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Labels
        if (width >= 640) {
          ctx.font = '600 9px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillStyle = isDarkTheme
            ? (isNearMouse ? '#ffffff' : 'rgba(203, 213, 225, 0.75)')
            : (isNearMouse ? '#0f172a' : '#475569');
          ctx.fillText(node.label, node.x, node.y + nodeRadius + 14);

          ctx.font = '400 8px "Inter", sans-serif';
          ctx.fillStyle = isDarkTheme ? 'rgba(148, 163, 184, 0.6)' : 'rgba(100, 116, 139, 0.75)';
          ctx.fillText(node.sub, node.x, node.y + nodeRadius + 24);
        }
      });
    }

    // --- TRAVELING DATA TOKENS ---
    function renderTravelingPackets() {
      const now = Date.now();
      const pipelineNodes = getPipelineNodePositions();

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

      for (let i = travelingPackets.length - 1; i >= 0; i--) {
        const packet = travelingPackets[i];
        packet.progress += packet.speed;

        if (packet.progress >= 1) {
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

        ctx.beginPath();
        ctx.arc(currX, currY, packet.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `${packet.color}44`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(currX, currY, packet.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        if (packet.label && width > 640) {
          ctx.font = '500 8px "JetBrains Mono", monospace';
          ctx.fillStyle = packet.color;
          ctx.textAlign = 'center';
          ctx.fillText(packet.label, currX, currY - 10);
        }
      }
    }

    // --- SHOCKWAVES ---
    function renderShockwaves() {
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
    }

    // --- FLOATING BADGES ---
    function renderFloatingBadges() {
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

        const textWidth = ctx.measureText(badge.text).width;
        ctx.fillStyle = isDarkTheme ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.92)';
        ctx.strokeStyle = badge.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(badge.x - textWidth / 2 - 10, badge.y - 14, textWidth + 20, 20, [10]);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = badge.color;
        ctx.fillText(badge.text, badge.x, badge.y);
        ctx.restore();
      }
    }

    // Start Animation
    animationFrameId = requestAnimationFrame(render);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('votechain:bg-mode-changed', onModeChange);
      window.removeEventListener('votechain:density-changed', onDensityChange);
      themeObserver.disconnect();
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
