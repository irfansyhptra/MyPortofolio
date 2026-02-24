"use client";

import FloatingLines from './FloatingLines';

export default function FixedBackground() {
  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw', 
        height: '100vh', 
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <FloatingLines 
        enabledWaves={["top", "middle", "bottom"]}
        lineCount={5}
        lineDistance={5}
        bendRadius={5}
        bendStrength={-0.5}
        interactive={false}
        parallax={true}
      />
    </div>
  );
}
