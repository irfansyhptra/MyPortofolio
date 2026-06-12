/**
 * NeumorphicButton Examples
 * 
 * Example usage of the NeumorphicButton component demonstrating various
 * configurations, states, and responsive behaviors.
 */

'use client';

import { NeumorphicButton } from './NeumorphicButton';

export function NeumorphicButtonExamples() {
  return (
    <div className="p-8 space-y-8 bg-gray-900">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Variants</h2>
        <div className="flex gap-4 flex-wrap">
          <NeumorphicButton variant="raised">
            Raised Button
          </NeumorphicButton>
          <NeumorphicButton variant="pressed">
            Pressed Button
          </NeumorphicButton>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Sizes</h2>
        <div className="flex gap-4 items-center flex-wrap">
          <NeumorphicButton size="sm">
            Small
          </NeumorphicButton>
          <NeumorphicButton size="md">
            Medium
          </NeumorphicButton>
          <NeumorphicButton size="lg">
            Large
          </NeumorphicButton>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">States</h2>
        <div className="flex gap-4 flex-wrap">
          <NeumorphicButton>
            Normal
          </NeumorphicButton>
          <NeumorphicButton disabled>
            Disabled
          </NeumorphicButton>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Full Width</h2>
        <NeumorphicButton fullWidth>
          Full Width Button
        </NeumorphicButton>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Interactive Demo</h2>
        <p className="text-gray-400 text-sm">
          Hover and click the buttons to see the spring physics animations
          (stiffness 300, damping 20)
        </p>
        <div className="flex gap-4 flex-wrap">
          <NeumorphicButton onClick={() => alert('Button clicked!')}>
            Click Me
          </NeumorphicButton>
          <NeumorphicButton variant="raised" size="lg">
            Large Raised
          </NeumorphicButton>
        </div>
      </section>
    </div>
  );
}
