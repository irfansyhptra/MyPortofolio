/**
 * Example usage of GlassPanel component
 * 
 * Demonstrates various configurations and use cases for the GlassPanel
 * glassmorphism component variant.
 */

'use client';

import { GlassPanel } from './GlassPanel';
import { ResponsiveProvider } from '@/app/lib/responsive-manager';

export function GlassPanelExamples() {
  return (
    <ResponsiveProvider>
      <div style={{ padding: '40px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
        <h1 style={{ color: 'white', marginBottom: '32px' }}>GlassPanel Examples</h1>
        
        {/* Example 1: Default GlassPanel */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '12px' }}>Default GlassPanel</h2>
          <GlassPanel style={{ padding: '24px' }}>
            <h3 style={{ margin: 0, marginBottom: '8px', color: 'white' }}>Default Configuration</h3>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)' }}>
              Medium blur (16px), opacity 0.15 with fade-in animation (0.6s)
            </p>
          </GlassPanel>
        </div>

        {/* Example 2: Blur Strength Presets */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '12px' }}>Blur Strength Presets</h2>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <GlassPanel blurStrength="low" style={{ padding: '20px', flex: '1 1 200px' }}>
              <h4 style={{ margin: 0, marginBottom: '8px', color: 'white' }}>Low Blur</h4>
              <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>8px</p>
            </GlassPanel>
            
            <GlassPanel blurStrength="medium" style={{ padding: '20px', flex: '1 1 200px' }}>
              <h4 style={{ margin: 0, marginBottom: '8px', color: 'white' }}>Medium Blur</h4>
              <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>16px</p>
            </GlassPanel>
            
            <GlassPanel blurStrength="high" style={{ padding: '20px', flex: '1 1 200px' }}>
              <h4 style={{ margin: 0, marginBottom: '8px', color: 'white' }}>High Blur</h4>
              <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>24px</p>
            </GlassPanel>
          </div>
        </div>

        {/* Example 3: Opacity Variations */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '12px' }}>Opacity Variations</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <GlassPanel opacity={0.05} style={{ padding: '16px' }}>
              <p style={{ margin: 0, color: 'white', fontSize: '14px', textAlign: 'center' }}>
                <strong>0.05</strong><br />Very Subtle
              </p>
            </GlassPanel>
            
            <GlassPanel opacity={0.15} style={{ padding: '16px' }}>
              <p style={{ margin: 0, color: 'white', fontSize: '14px', textAlign: 'center' }}>
                <strong>0.15</strong><br />Default
              </p>
            </GlassPanel>
            
            <GlassPanel opacity={0.25} style={{ padding: '16px' }}>
              <p style={{ margin: 0, color: 'white', fontSize: '14px', textAlign: 'center' }}>
                <strong>0.25</strong><br />Prominent
              </p>
            </GlassPanel>
            
            <GlassPanel opacity={0.3} style={{ padding: '16px' }}>
              <p style={{ margin: 0, color: 'white', fontSize: '14px', textAlign: 'center' }}>
                <strong>0.3</strong><br />Maximum
              </p>
            </GlassPanel>
          </div>
        </div>

        {/* Example 4: Staggered Animation */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '12px' }}>Staggered Animation</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[0, 0.1, 0.2, 0.3].map((delay, index) => (
              <GlassPanel 
                key={index}
                delay={delay}
                style={{ padding: '16px' }}
              >
                <p style={{ margin: 0, color: 'white' }}>
                  Panel {index + 1} - Delayed by {delay}s
                </p>
              </GlassPanel>
            ))}
          </div>
        </div>

        {/* Example 5: Content Panel */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '12px' }}>Content Panel</h2>
          <GlassPanel 
            blurStrength="high"
            opacity={0.2}
            style={{ padding: '32px', maxWidth: '600px', margin: '0 auto' }}
          >
            <h3 style={{ margin: 0, marginBottom: '16px', color: 'white' }}>
              Welcome to Glassmorphism
            </h3>
            <p style={{ margin: 0, marginBottom: '16px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.6' }}>
              GlassPanel provides a simpler alternative to GlassCard with preset blur configurations
              and elegant fade-in animations. Perfect for content overlays, modal dialogs, and
              information panels.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{
                padding: '10px 20px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer'
              }}>
                Learn More
              </button>
              <button style={{
                padding: '10px 20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer'
              }}>
                Get Started
              </button>
            </div>
          </GlassPanel>
        </div>

        {/* Example 6: No Animation */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '12px' }}>Static Panel</h2>
          <GlassPanel noAnimation style={{ padding: '24px' }}>
            <h3 style={{ margin: 0, marginBottom: '8px', color: 'white' }}>No Animation</h3>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)' }}>
              This panel has no entrance animation (noAnimation prop)
            </p>
          </GlassPanel>
        </div>

        {/* Example 7: Info Cards */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '12px' }}>Info Cards</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            {[
              { title: 'Performance', value: '60 FPS', icon: '⚡' },
              { title: 'Accessibility', value: 'WCAG 2.1', icon: '♿' },
              { title: 'Responsive', value: 'Mobile-First', icon: '📱' },
            ].map((card, index) => (
              <GlassPanel 
                key={card.title}
                blurStrength="medium"
                opacity={0.18}
                delay={index * 0.1}
                style={{ padding: '24px', textAlign: 'center' }}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>{card.icon}</div>
                <h4 style={{ margin: 0, marginBottom: '8px', color: 'white' }}>{card.title}</h4>
                <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                  {card.value}
                </p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </div>
    </ResponsiveProvider>
  );
}

export default GlassPanelExamples;
