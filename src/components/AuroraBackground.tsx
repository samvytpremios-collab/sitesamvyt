import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface AuroraBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

// CSS-only fallback aurora effect
const CSSFallback = ({ className, children }: AuroraBackgroundProps) => (
  <div className={cn('relative overflow-hidden', className)}>
    <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-cyan-500/10" />
    <div className="absolute inset-0 opacity-30">
      <div 
        className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 animate-pulse"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(var(--primary) / 0.15) 0%, transparent 60%)',
          animation: 'aurora-pulse 8s ease-in-out infinite alternate',
        }}
      />
    </div>
    <style>{`
      @keyframes aurora-pulse {
        0% { transform: translate(0%, 0%) scale(1); opacity: 0.3; }
        50% { transform: translate(5%, 5%) scale(1.1); opacity: 0.5; }
        100% { transform: translate(-5%, -5%) scale(1); opacity: 0.3; }
      }
    `}</style>
    <div className="relative">
      {children}
    </div>
  </div>
);

const AuroraBackground = ({ className = '', children }: AuroraBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || webglFailed) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let frameId: number;

    try {
      // Check WebGL support first
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglFailed(true);
        return;
      }

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: 'low-power',
        failIfMajorPerformanceCaveat: true 
      });
      
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const material = new THREE.ShaderMaterial({
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) }
        },
        vertexShader: `
          void main() {
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float iTime;
          uniform vec2 iResolution;

          #define NUM_OCTAVES 3

          float rand(vec2 n) {
            return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
          }

          float noise(vec2 p) {
            vec2 ip = floor(p);
            vec2 u = fract(p);
            u = u*u*(3.0-2.0*u);

            float res = mix(
              mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
              mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
            return res * res;
          }

          float fbm(vec2 x) {
            float v = 0.0;
            float a = 0.3;
            vec2 shift = vec2(100);
            mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
            for (int i = 0; i < NUM_OCTAVES; ++i) {
              v += a * noise(x);
              x = rot * x * 2.0 + shift;
              a *= 0.4;
            }
            return v;
          }

          void main() {
            vec2 shake = vec2(sin(iTime * 1.2) * 0.005, cos(iTime * 2.1) * 0.005);
            vec2 p = ((gl_FragCoord.xy + shake * iResolution.xy) - iResolution.xy * 0.5) / iResolution.y * mat2(6.0, -4.0, 4.0, 6.0);
            vec2 v;
            vec4 o = vec4(0.0);

            float f = 2.0 + fbm(p + vec2(iTime * 5.0, 0.0)) * 0.5;

            for (float i = 0.0; i < 35.0; i++) {
              v = p + cos(i * i + (iTime + p.x * 0.08) * 0.025 + i * vec2(13.0, 11.0)) * 3.5 + vec2(sin(iTime * 3.0 + i) * 0.003, cos(iTime * 3.5 - i) * 0.003);
              float tailNoise = fbm(v + vec2(iTime * 0.5, i)) * 0.3 * (1.0 - (i / 35.0));
              vec4 auroraColors = vec4(
                0.0 + 0.2 * sin(i * 0.2 + iTime * 0.4),
                0.4 + 0.5 * cos(i * 0.3 + iTime * 0.5),
                0.9 + 0.1 * sin(i * 0.4 + iTime * 0.3),
                1.0
              );
              vec4 currentContribution = auroraColors * exp(sin(i * i + iTime * 0.8)) / length(max(v, vec2(v.x * f * 0.015, v.y * 1.5)));
              float thinnessFactor = smoothstep(0.0, 1.0, i / 35.0) * 0.6;
              o += currentContribution * (1.0 + tailNoise * 0.8) * thinnessFactor;
            }

            o = tanh(pow(o / 100.0, vec4(1.6)));
            gl_FragColor = o * 1.5;
          }
        `
      });

      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const animate = () => {
        if (!renderer) return;
        material.uniforms.iTime.value += 0.016;
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };
      animate();

      const handleResize = () => {
        if (!container || !renderer) return;
        renderer.setSize(container.clientWidth, container.clientHeight);
        material.uniforms.iResolution.value.set(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener('resize', handleResize);
        if (renderer && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        geometry.dispose();
        material.dispose();
        renderer?.dispose();
      };
    } catch (error) {
      console.warn('WebGL initialization failed, using CSS fallback:', error);
      setWebglFailed(true);
      return;
    }
  }, [webglFailed]);

  // Use CSS fallback if WebGL failed
  if (webglFailed) {
    return <CSSFallback className={className}>{children}</CSSFallback>;
  }

  return (
    <div ref={containerRef} className={cn('relative overflow-hidden', className)}>
      <div className="relative">
        {children}
      </div>
    </div>
  );
};

export default AuroraBackground;
