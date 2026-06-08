"use client";

import { useState, useEffect } from 'react';

export interface StreamNode {
  id: string;
  label: string;
  type: 'vector' | 'graph' | 'episodic';
  position: [number, number, number];
  glowing: boolean;
}

export function useMemorySync() {
  const [activeNodes, setActiveNodes] = useState<StreamNode[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Synchronize framework data fetch requests from backend container engine
  const fetchLiveKernelState = async () => {
    try {
      const response = await fetch('http://localhost:8000/');
      if (response.ok) {
        setIsConnected(true);
      }
    } catch (error) {
      console.error("[-] Backend Connection Core Offline. Retrying...", error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    // Initial health tracking parameters check
    fetchLiveKernelState();
    
    // Automatic system network polling block interval every 5 seconds
    const interval = setInterval(fetchLiveKernelState, 5000);
    return () => clearInterval(interval);
  }, []);

  return { activeNodes, isConnected, setActiveNodes };
}
