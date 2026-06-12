/**
 * Example usage of GlassCard component
 * 
 * Demonstrates various configurations and use cases for the GlassCard
 * glassmorphism component.
 */

'use client';

import { GlassCard } from './GlassCard';
import { ResponsiveProvider } from '@/app/lib/responsive-manager';

export function GlassCardExamples() {
  return (
    <ResponsiveProvider>
      <div style={{ padding: '40px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <h1 style={{ color: 'white', marginBottom: '32px' }}>GlassCard Examples</h1>
        
        {/* Example 1: Default GlassCard */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '12px' }}>Default GlassCard</h2>
          <GlassCard style={{ padding: '24px' }}>
            <h3 style={{ margin: 0, marginBottom: '8px', color: 'white' }}>Default Configuration</h3>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)' }}>
              Medium blur (16px), z-index 10, opacity 0.1 with dynamic adjustment
            </p>
          </GlassCard>
        </div>

        {/* Example 2: Low Blur */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '12px' }}>Low Blur Strength</h2>
          <GlassCard blurStrength="low" style={{ padding: '24px' }}>
            <h3 style={{ margin: 0, marginBottom: '8px', color: 'white' }}>Subtle Effect</h3>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)' }}>
              Low blur (8px) for more subtle glassmorphism effect
            </p>
          </GlassCard>
        </div>

        {/* Example 3: High Blur */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '12px' }}>High Blur Strength</h2>
          <GlassCard blurStrength="high" opacity={0.2} style={{ padding: '24px' }}>
            <h3 style={{ margin: 0, marginBottom: '8px', color: 'white' }}>Strong Effect</h3>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)' }}>
              High blur (24px) with increased opacity for prominent glassmorphism
            </p>
          </GlassCard>
        </div>

        {/* Example 4: Layered Cards */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '12px' }}>Layered Cards</h2>
          <GlassCard zIndex={10} style={{ padding: '24px', position: 'relative' }}>
            <h3 style={{ margin: 0, marginBottom: '8px', color: 'white' }}>Back Layer (z-index: 10)</h3>
            <GlassCard 
              zIndex={20} 
              blurStrength="high"
              opacity={0.15}
              style={{ padding: '16px', marginTop: '16px' }}
            >
              <h4 style={{ margin: 0, marginBottom: '8px', color: 'white' }}>Middle Layer (z-index: 20)</h4>
              <GlassCard 
                zIndex={30}
                blurStrength="low"
                opacity={0.25}
                style={{ padding: '12px', marginTop: '12px' }}
              >
                <p style={{ margin: 0, color: 'white', fontSize: '14px' }}>
                  Front Layer (z-index: 30)
                </p>
              </GlassCard>
            </GlassCard>
          </GlassCard>
        </div>

        {/* Example 5: Custom Styling */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '12px' }}>Custom Styling</h2>
          <GlassCard 
            className="custom-glass-card"
            style={{ 
              padding: '32px', 
              maxWidth: '500px',
              margin: '0 auto'
            }}
          >
            <h3 style={{ margin: 0, marginBottom: '16px', color: 'white', textAlign: 'center' }}>
              Card with Custom Styles
            </h3>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', textAlign: 'center' }}>
              You can add custom styles and className to extend the component
            </p>
          </GlassCard>
        </div>

        {/* Example 6: No Animation */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '12px' }}>Without Animation</h2>
          <GlassCard noAnimation style={{ padding: '24px' }}>
            <h3 style={{ margin: 0, marginBottom: '8px', color: 'white' }}>Static Card</h3>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)' }}>
              Animation disabled with noAnimation prop
            </p>
          </GlassCard>
        </div>

        {/* Example 7: Card Grid */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '12px' }}>Card Grid</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {['Card 1', 'Card 2', 'Card 3'].map((title, index) => (
              <GlassCard 
                key={title}
                blurStrength={['low', 'medium', 'high'][index] as 'low' | 'medium' | 'high'}
                style={{ padding: '20px' }}
              >
                <h4 style={{ margin: 0, marginBottom: '8px', color: 'white' }}>{title}</h4>
                <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                  Blur: {['8px', '16px', '24px'][index]}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </ResponsiveProvider>
  );
}

export default GlassCardExamples;
