"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

interface MemoryNode {
  id: string;
  label: string;
  type: 'vector' | 'graph' | 'episodic';
  position: [number, number, number];
  importance: number; // Node weight/importance (1 to 5) for dynamic sizing
  glowing: boolean;
}

interface MemoryLink {
  source: string;
  target: string;
  strength: number; // Relationship weight (1 to 3) for edge thickness
}

// Global Custom Target Camera Controller for Smooth RAG Dive Animations
const SpatialCameraController = ({ targetPos }: { targetPos: [number, number, number] | null }) => {
  const { camera } = useThree();
  useFrame(() => {
    if (targetPos) {
      // Dynamic vector interpolation (Lerp) for cinematic camera target zoom
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetPos[0], 0.08);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetPos[1], 0.08);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetPos[2] + 2.2, 0.08);
    }
  });
  return null;
};

// Advanced Spatial Neon Node Component
const NeonNodeItem = ({ node, onDive }: { node: MemoryNode; onDive: (n: MemoryNode) => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      const time = state.clock.getElapsedTime();
      
      if (node.glowing || hovered) {
        material.color.setHSL(0.33, 1, 0.5 + Math.sin(time * 12) * 0.15);
      } else {
        if (node.type === 'vector') material.color.set('#06b6d4');   // Neon Cyan
        if (node.type === 'graph') material.color.set('#d946ef');    // Neon Magenta
        if (node.type === 'episodic') material.color.set('#f43f5e'); // Neon Rose
      }
    }
  });

  // Calculate dynamic radius based on structural system importance weight
  const nodeRadius = 0.12 + (node.importance * 0.06);

  return (
    <group position={node.position}>
      <Sphere
        args={[nodeRadius, 32, 32]}
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        onClick={(e) => { e.stopPropagation(); onDive(node); }}
      >
        <meshBasicMaterial wireframe={hovered} />
      </Sphere>
      
      {/* Heads-Up Display Text Overlay Elements */}
      {(hovered || node.glowing) && (
        <Html distanceFactor={4}>
          <div className="bg-slate-950/95 text-[9px] text-cyan-400 font-mono px-2 py-1 rounded border border-cyan-500/30 whitespace-nowrap shadow-[0_0_15px_rgba(6,182,212,0.2)] select-none">
            <span className="font-bold uppercase">[{node.type}]</span> {node.label}
          </div>
        </Html>
      )}
    </group>
  );
};

export default function MemoryVisualizer() {
  const [nodes, setNodes] = useState<MemoryNode[]>([]);
  const [links, setLinks] = useState<MemoryLink[]>([]);
  const [diveTarget, setDiveTarget] = useState<[number, number, number] | null>(null);
  const [activeDivedNode, setActiveDivedNode] = useState<MemoryNode | null>(null);

  useEffect(() => {
    // Inject base mock dataset with importance profiles explicitly
    setNodes([
      { id: '1', label: 'Ecosystem Root', type: 'graph', position: [0, 0, 0], importance: 5, glowing: false },
      { id: '2', label: 'Gemini Context Context', type: 'vector', position: [2.2, 1.2, -1.5], importance: 3, glowing: false },
      { id: '3', label: 'Swarm Room Protocol', type: 'episodic', position: [-2.0, -1.4, 1.2], importance: 4, glowing: false },
    ]);
    setLinks([
      { source: '1', target: '2', strength: 3 },
      { source: '1', target: '3', strength: 2 },
    ]);
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/kernel");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "new_node") {
        const incomingNode: MemoryNode = {
          id: data.node.id,
          label: data.node.label,
          type: data.node.type,
          position: data.node.position,
          importance: Math.floor(Math.random() * 4) + 1, // Randomized target importance assignment
          glowing: true
        };

        setNodes((prev) => {
          if (prev.some(n => n.id === incomingNode.id)) return prev;
          const parentNode = prev[Math.floor(Math.random() * prev.length)];
          setLinks((prevLinks) => [...prevLinks, { source: parentNode.id, target: incomingNode.id, strength: Math.floor(Math.random() * 3) + 1 }]);
          return [...prev, incomingNode];
        });

        setTimeout(() => {
          setNodes((prev) => prev.map(n => n.id === incomingNode.id ? { ...n, glowing: false } : n));
        }, 2000);
      }
    };
    return () => ws.close();
  }, []);

  const handleNodeDive = (node: MemoryNode) => {
    console.log(`✨ [RAG Search Loop] Diving deep into context cluster: ${node.id}`);
    setDiveTarget(node.position);
    setActiveDivedNode(node);
  };

  const handleResetView = () => {
    setDiveTarget([0, 0, 5]); // Resets camera back to default root viewpoint coordinates
    setActiveDivedNode(null);
  };

  return (
    <div className="w-full h-full relative bg-slate-950/20">
      
      {/* HUD Floating Navigation Metrics Interface Card */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 border border-slate-800/80 p-3 rounded-lg backdrop-blur-md font-mono pointer-events-auto">
        <h2 className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">Spatial Memory Explorer</h2>
        <p className="text-[8px] text-slate-500 mt-0.5">Scale: Importance Weight | Edges: Matrix Strength</p>
        
        {activeDivedNode && (
          <div className="mt-2 pt-2 border-t border-slate-800 animate-fade-in">
            <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">✨ RAG Context Retrieved</p>
            <p className="text-[10px] text-slate-200 mt-1 max-w-[200px] truncate">Prompt: {activeDivedNode.label}</p>
            <button
              onClick={handleResetView}
              className="mt-2 bg-slate-950 border border-cyan-500/30 text-cyan-400 font-bold px-2 py-1 rounded text-[8px] uppercase tracking-widest hover:bg-cyan-950/30 transition-colors"
            >
              Orbit System Reset
            </button>
          </div>
        )}
      </div>

      {/* 3D Core Rendering Space */}
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        
        <SpatialCameraController targetPos={diveTarget} />

        {/* Rendering Variable Strength Line Vector Links */}
        {links.map((link, idx) => {
          const sourceNode = nodes.find(n => n.id === link.source);
          const targetNode = nodes.find(n => n.id === link.target);
          if (!sourceNode || !targetNode) return null;

          // Render multiple overlay arrays to simulate variable link thickness/strength properties
          return (
            <group key={idx}>
              <Line
                points={[sourceNode.position, targetNode.position]}
                color={link.strength === 3 ? "#bc6ff1" : link.strength === 2 ? "#4f46e5" : "#334155"}
                lineWidth={link.strength * 1.5}
                opacity={0.5}
                transparent
              />
            </group>
          );
        })}

        {/* Rendering Geometric Custom Neon Nodes */}
        {nodes.map(node => (
          <NeonNodeItem key={node.id} node={node} onDive={handleNodeDive} />
        ))}

        <OrbitControls enableZoom={true} maxDistance={15} minDistance={1.5} />
      </Canvas>
    </div>
  );
}
