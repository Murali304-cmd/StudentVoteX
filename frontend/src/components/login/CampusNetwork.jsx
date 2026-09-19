import React, { useEffect, useRef, useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Activity,
  Cpu,
  Sparkles,
  Zap,
  Radio,
  Blocks,
  KeyRound,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { BlockchainLedgerStream } from './BlockchainLedgerStream';

/**
 * CampusNetwork - Advanced Interactive Blockchain Voting Constellation
 * Features:
 * - 8 Institutional Validator Nodes (CS Dept, Election Commission, Dean Senate, EVM Station, etc.)
 * - Zero shaking on mouse drag: rock-solid harmonic physics
 * - Realtime cryptographic data packet routing (ZKP Proofs, Voter Tokens, Consensus Signatures)
 * - Orbiting SHA-256 / Merkle hexadecimal stream
 * - Interactive 1-Click "Broadcast ZKP Ballot / Mine Block" simulator
 * - Integrated Live Chained Blockchain Ledger Ribbon
 */
export function CampusNetwork() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Live blockchain telemetry states
  const [liveBlock, setLiveBlock] = useState(1048);
  const [verifiedCount, setVerifiedCount] = useState(312);
  const [tpsRate, setTpsRate] = useState(148);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isMining, setIsMining] = useState(false);
  const [broadcastTxEffect, setBroadcastTxEffect] = useState(null);

  // Auto-mining heartbeat every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveBlock((b) => b + 1);
      setVerifiedCount((c) => c + Math.floor(Math.random() * 2) + 1);
      setTpsRate((t) => 140 + Math.floor(Math.random() * 24));
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Handler for Interactive ZKP Ballot Broadcast
  const handleSimulateVote = () => {
    if (isMining) return;
    setIsMining(true);
    const txId = 'ZKP-0x' + Math.random().toString(16).substring(2, 8).toUpperCase();
    setBroadcastTxEffect(txId);

    // Increment metrics and simulate block sealing
    setTimeout(() => {
      setVerifiedCount((c) => c + 1);
      setTpsRate((t) => t + 35);
      setLiveBlock((b) => b + 1);

      setTimeout(() => {
        setIsMining(false);
        setBroadcastTxEffect(null);
      }, 1000);
    }, 1200);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    // 8 Institutional Validator Nodes for ABC Institution Blockchain
    const campusNodesConfig = [
      {
        id: 'hub',
        name: 'ABC Genesis Hub',
        code: 'CORE-GENESIS-00',
        role: 'Consensus Coordinator',
        type: 'core',
        color: '#0284c7',
        icon: '🏛️',
        ping: '1.0ms',
        quorum: '100% Core'
      },
      {
        id: 'cs',
        name: 'Computer Science Validator',
        code: 'VAL-DEPT-CS01',
        role: 'ZK-SNARK Verifier',
        type: 'dept',
        color: '#0284c7',
        icon: '💻',
        ping: '2.1ms',
        quorum: '14.2% Weight'
      },
      {
        id: 'ee',
        name: 'Electrical Sciences Node',
        code: 'VAL-DEPT-EE02',
        role: 'Ledger Node',
        type: 'dept',
        color: '#4f46e5',
        icon: '⚡',
        ping: '1.9ms',
        quorum: '12.5% Weight'
      },
      {
        id: 'senate',
        name: 'Student Senate Node',
        code: 'VAL-SC-SENATE',
        role: 'Ballot Overseer',
        type: 'senate',
        color: '#7c3aed',
        icon: '⚖️',
        ping: '1.5ms',
        quorum: '16.0% Weight'
      },
      {
        id: 'lib',
        name: 'Digital Archive Archive',
        code: 'ARCHIVE-LIB-01',
        role: 'State Storage',
        type: 'dept',
        color: '#0284c7',
        icon: '📚',
        ping: '2.8ms',
        quorum: '10.0% Weight'
      },
      {
        id: 'evm1',
        name: 'EVM Terminal Node #01',
        code: 'KIOSK-EVM-TERM',
        role: 'Physical Kiosk',
        type: 'kiosk',
        color: '#059669',
        icon: '🗳️',
        ping: '0.8ms',
        quorum: '15.0% Weight'
      },
      {
        id: 'admin',
        name: 'Election Commission Authority',
        code: 'AUTH-ELEC-COMM',
        role: 'Master Validator',
        type: 'admin',
        color: '#e11d48',
        icon: '🛡️',
        ping: '1.1ms',
        quorum: '20.0% Weight'
      },
      {
        id: 'dean',
        name: 'Dean Executive Seal Node',
        code: 'EXEC-DEAN-HALL',
        role: 'Finality Witness',
        type: 'exec',
        color: '#d97706',
        icon: '🎓',
        ping: '1.3ms',
        quorum: '12.3% Weight'
      }
    ];

    let nodes = [];
    let packets = [];
    let shockwaves = [];

    // Orbiting Blockchain Hashes Text Tokens
    const hexTokens = [
      'SHA-256',
      '0x9F4B',
      'ZKP-PROOF',
      'MERKLE',
      '0x7A1C',
      'ED25519',
      'IMMUTABLE',
      '0x8E3D',
      'BLOCK#1048'
    ];

    const initNodes = () => {
      nodes = [];
      const centerX = width / 2;
      const centerY = height / 2 - 35; // Slight upward offset to leave room for Blockchain Ledger Ribbon

      // 1. Central Core Genesis Hub
      nodes.push({
        ...campusNodesConfig[0],
        x: centerX,
        y: centerY,
        baseX: centerX,
        baseY: centerY,
        orbitRadius: 0,
        orbitSpeed: 0,
        baseAngle: 0,
        radius: 7,
        pulse: 0
      });

      // 2. Orbital Department Nodes
      const orbitNodes = campusNodesConfig.slice(1);
      const totalOrbit = orbitNodes.length;

      orbitNodes.forEach((cfg, idx) => {
        const angle = (idx / totalOrbit) * Math.PI * 2 - Math.PI / 2;
        const orbitRadius = 110 + (idx % 2 === 0 ? 25 : -15) + (idx % 3) * 12;
        const x = centerX + Math.cos(angle) * orbitRadius;
        const y = centerY + Math.sin(angle) * (orbitRadius * 0.84);

        nodes.push({
          ...cfg,
          x,
          y,
          baseX: x,
          baseY: y,
          orbitRadius,
          orbitSpeed: 0.0006 * (idx % 2 === 0 ? 1 : -1),
          baseAngle: angle,
          radius: cfg.type === 'admin' || cfg.type === 'kiosk' ? 5.5 : 4.5,
          pulse: (idx / totalOrbit) * Math.PI * 2
        });
      });
    };

    initNodes();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      initNodes();
    };

    window.addEventListener('resize', handleResize);

    // Spawns traveling data packets across blockchain channels
    const spawnPacket = () => {
      if (nodes.length < 2) return;
      const fromIdx = Math.floor(Math.random() * nodes.length);
      let toIdx = Math.floor(Math.random() * nodes.length);
      while (toIdx === fromIdx) {
        toIdx = Math.floor(Math.random() * nodes.length);
      }

      const p1 = nodes[fromIdx];
      const p2 = nodes[toIdx];
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

      if (dist < 220) {
        // Types: ZKP Ballot (Azure), Consensus Signature (Indigo), Block Seal (Emerald)
        const colors = ['#0284c7', '#4f46e5', '#10b981', '#7c3aed'];
        const selectedColor = colors[Math.floor(Math.random() * colors.length)];

        packets.push({
          from: fromIdx,
          to: toIdx,
          progress: 0,
          speed: 0.014 + Math.random() * 0.008,
          color: selectedColor,
          size: 2.6
        });
      }
    };

    // Canvas Mouse Click -> Emits expanding ripple wave
    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      shockwaves.push({
        x: clickX,
        y: clickY,
        radius: 6,
        maxRadius: 175,
        alpha: 0.75,
        color: '#0284c7'
      });

      // Find nearest node and emit packet burst
      let nearestIdx = 0;
      let minD = Infinity;
      nodes.forEach((n, idx) => {
        const d = Math.hypot(n.x - clickX, n.y - clickY);
        if (d < minD) {
          minD = d;
          nearestIdx = idx;
        }
      });

      nodes.forEach((n, idx) => {
        if (idx !== nearestIdx) {
          packets.push({
            from: nearestIdx,
            to: idx,
            progress: 0,
            speed: 0.022 + Math.random() * 0.01,
            color: '#0284c7',
            size: 3
          });
        }
      });
    };

    canvas.addEventListener('click', handleCanvasClick);

    // Canvas Mouse Move for Tooltip Detection
    const handleCanvasMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const curX = e.clientX - rect.left;
      const curY = e.clientY - rect.top;

      let found = null;
      for (const node of nodes) {
        const dist = Math.hypot(node.x - curX, node.y - curY);
        if (dist < 24) {
          found = node;
          setTooltipPos({ x: curX, y: curY });
          break;
        }
      }
      setHoveredNode(found);
    };

    canvas.addEventListener('mousemove', handleCanvasMouseMove);

    // Main Render Loop (Pure, Stable 60fps)
    let time = 0;
    const render = () => {
      time += 0.014;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2 - 35;

      // 1. Concentric Merkle Tree / Cryptographic Orbit Rings
      ctx.save();
      ctx.strokeStyle = 'rgba(2, 132, 199, 0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);

      // Inner ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
      ctx.stroke();

      // Middle ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, 145, 0, Math.PI * 2);
      ctx.stroke();

      // Outer radar ring
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 210, 0, Math.PI * 2);
      ctx.stroke();

      // Rotating Cryptographic Radar Sweep Line
      const sweepAngle = time * 0.45;
      ctx.setLineDash([]);
      const sweepGrad = ctx.createLinearGradient(
        centerX,
        centerY,
        centerX + Math.cos(sweepAngle) * 210,
        centerY + Math.sin(sweepAngle) * 210
      );
      sweepGrad.addColorStop(0, 'rgba(2, 132, 199, 0.25)');
      sweepGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
      ctx.strokeStyle = sweepGrad;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(sweepAngle) * 210,
        centerY + Math.sin(sweepAngle) * 210
      );
      ctx.stroke();
      ctx.restore();

      // 2. Orbiting Hex Stream / Cryptographic Tokens around Central Ring
      ctx.save();
      ctx.font = '600 8.5px "Courier New", monospace';
      ctx.fillStyle = 'rgba(2, 132, 199, 0.45)';
      ctx.textAlign = 'center';

      hexTokens.forEach((token, idx) => {
        const tokenAngle = (idx / hexTokens.length) * Math.PI * 2 + time * 0.18;
        const orbitR = 80;
        const tx = centerX + Math.cos(tokenAngle) * orbitR;
        const ty = centerY + Math.sin(tokenAngle) * (orbitR * 0.95);
        ctx.fillText(token, tx, ty);
      });
      ctx.restore();

      // 3. Shockwaves from clicks or broadcasts
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += 3.2;
        sw.alpha -= 0.016;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(s, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(2, 132, 199, ${sw.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      // 4. Smooth Harmonic Node Position Update
      nodes.forEach((node) => {
        if (node.type !== 'core') {
          const currentAngle = node.baseAngle + time * node.orbitSpeed * 8;
          node.x = centerX + Math.cos(currentAngle) * node.orbitRadius;
          node.y = centerY + Math.sin(currentAngle) * (node.orbitRadius * 0.84);
        }
        node.pulse += 0.03;
      });

      // 5. Draw Connecting Peer-to-Peer Consensus Lines
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);

          if (dist < 185) {
            const alpha = (1 - dist / 185) * 0.28;
            const isHoverLinked =
              hoveredNode && (hoveredNode.id === n1.id || hoveredNode.id === n2.id);

            const grad = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
            grad.addColorStop(
              0,
              isHoverLinked
                ? `rgba(2, 132, 199, ${Math.min(alpha * 2.8, 0.85)})`
                : `rgba(2, 132, 199, ${alpha})`
            );
            grad.addColorStop(
              1,
              isHoverLinked
                ? `rgba(79, 70, 229, ${Math.min(alpha * 2.8, 0.85)})`
                : `rgba(79, 70, 229, ${alpha * 0.85})`
            );

            ctx.strokeStyle = grad;
            ctx.lineWidth = isHoverLinked ? 1.8 : 0.9;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // 6. Update & Draw Data Packets
      if (Math.random() < 0.14 && packets.length < 24) {
        spawnPacket();
      }

      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.progress += p.speed;

        if (p.progress >= 1) {
          packets.splice(i, 1);
          continue;
        }

        const n1 = nodes[p.from];
        const n2 = nodes[p.to];
        if (!n1 || !n2) continue;

        const curX = n1.x + (n2.x - n1.x) * p.progress;
        const curY = n1.y + (n2.y - n1.y) * p.progress;

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(curX, curY, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 7. Draw Glowing Consensus Nodes
      nodes.forEach((node) => {
        const isHovered = hoveredNode && hoveredNode.id === node.id;
        const pulseScale = 1 + Math.sin(node.pulse) * (isHovered ? 0.4 : 0.18);
        const currentRadius = isHovered ? node.radius * 1.3 : node.radius;

        // Outer Glow Halo
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius * 2.8 * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = isHovered
          ? 'rgba(2, 132, 199, 0.22)'
          : node.type === 'core'
          ? 'rgba(2, 132, 199, 0.12)'
          : 'rgba(99, 102, 241, 0.08)';
        ctx.fill();

        // Node Solid Core
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Clean white border for light mode contrast
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        // High-contrast Node Label
        if (node.type === 'core' || isHovered) {
          ctx.save();
          ctx.font = '700 9.5px "Inter", sans-serif';
          ctx.fillStyle = '#0f172a';
          ctx.textAlign = 'center';
          ctx.fillText(node.name, node.x, node.y + currentRadius + 13);
          ctx.restore();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handleCanvasClick);
      canvas.removeEventListener('mousemove', handleCanvasMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '410px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        paddingBottom: '8px'
      }}
    >
      {/* Top Action Bar: Broadcast Simulated ZKP Ballot */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10,
          padding: '0 4px',
          marginTop: '2px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 6px #10b981'
            }}
          />
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}
          >
            Decentralized Consensus Mesh
          </span>
        </div>

        {/* Interactive "Simulate ZKP Vote" Button */}
        <button
          type="button"
          onClick={handleSimulateVote}
          disabled={isMining}
          style={{
            padding: '5px 12px',
            borderRadius: '20px',
            background: isMining ? '#e0f2fe' : 'rgba(255, 255, 255, 0.95)',
            border: isMining ? '1px solid #0284c7' : '1px solid #cbd5e1',
            color: '#0284c7',
            fontSize: '0.7rem',
            fontWeight: 800,
            cursor: isMining ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            transition: 'all 0.2s ease'
          }}
          title="Click to broadcast an anonymous ZKP voter payload to consensus validators"
        >
          {isMining ? (
            <>
              <RefreshCw size={11} className="spin" />
              <span>Validating Block...</span>
            </>
          ) : (
            <>
              <Zap size={12} color="#0284c7" />
              <span>Simulate ZKP Vote</span>
            </>
          )}
        </button>
      </div>

      {/* Broadcast Pulse Banner if Active */}
      {broadcastTxEffect && (
        <div
          style={{
            position: 'absolute',
            top: '36px',
            zIndex: 25,
            background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
            color: '#ffffff',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '0.72rem',
            fontWeight: 800,
            boxShadow: '0 4px 15px rgba(2, 132, 199, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <Sparkles size={12} />
          <span>Broadcasted {broadcastTxEffect} • Quorum Reached</span>
        </div>
      )}

      {/* HTML5 Canvas Mesh */}
      <div style={{ flex: 1, width: '100%', position: 'relative', minHeight: '260px' }}>
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            cursor: hoveredNode ? 'pointer' : 'default'
          }}
        />

        {/* Central Landmark Emblem */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, calc(-50% - 35px))',
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
              border: '2px solid rgba(2, 132, 199, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow:
                '0 12px 28px rgba(2, 132, 199, 0.16), 0 0 1px 1px rgba(255, 255, 255, 0.9) inset',
              color: '#0284c7',
              position: 'relative'
            }}
          >
            <GraduationCap size={32} strokeWidth={2.3} />

            {/* Glowing Shield Check Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-4px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                border: '2px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)'
              }}
            >
              <ShieldCheck size={12} strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Holographic Tooltip on Node Hover */}
        {hoveredNode && (
          <div
            style={{
              position: 'absolute',
              left: `${tooltipPos.x + 12}px`,
              top: `${tooltipPos.y - 50}px`,
              zIndex: 20,
              pointerEvents: 'none',
              background: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(16px)',
              border: '1.5px solid #cbd5e1',
              borderRadius: '12px',
              padding: '8px 12px',
              boxShadow: '0 10px 25px rgba(15, 23, 42, 0.12)',
              fontSize: '0.74rem',
              color: '#0f172a',
              animation: 'fadeIn 0.15s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}>
              <span>{hoveredNode.icon}</span>
              <span style={{ color: '#0284c7' }}>{hoveredNode.name}</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '3px',
                fontSize: '0.67rem',
                color: '#64748b'
              }}
            >
              <span>{hoveredNode.role}</span>
              <span>•</span>
              <span style={{ color: '#059669', fontWeight: 700 }}>{hoveredNode.quorum}</span>
            </div>
          </div>
        )}
      </div>

      {/* Integrated Chained Blockchain Ledger Ribbon (Bottom) */}
      <div style={{ width: '100%', zIndex: 10, marginTop: '4px' }}>
        <BlockchainLedgerStream latestBlockNumber={liveBlock} isMining={isMining} />
      </div>
    </div>
  );
}

export default CampusNetwork;
