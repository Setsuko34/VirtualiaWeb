import { useEffect, useRef, useState } from 'react';

interface MinecraftSkin3DProps {
  username: string;
  width?: number;
  height?: number;
  className?: string;
}

export function MinecraftSkin3D({ username, width = 200, height = 250, className = '' }: MinecraftSkin3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    let animationFrameId: number;

    const loadSkinViewer = async () => {
      if (!canvasRef.current) return;

      try {
        // Import skinview3d dynamically
        const { SkinViewer, WalkingAnimation } = await import('skinview3d');
        
        if (!mounted) return;

        // Suppress WebGL shader warnings
        const originalWarn = console.warn;
        console.warn = (...args) => {
          const msg = args[0]?.toString() || '';
          if (msg.includes('WebGLProgram') || msg.includes('gradient instruction') || msg.includes('potentially uninitialized')) {
            return;
          }
          originalWarn.apply(console, args);
        };

        // Create the skin viewer with optimized settings
        const viewer = new SkinViewer({
          canvas: canvasRef.current,
          width: width,
          height: height,
          skin: `https://mc-heads.net/skin/${username}`,
          preserveDrawingBuffer: true,
        });

        // Restore original console.warn
        console.warn = originalWarn;

        // Configure the viewer
        viewer.zoom = 0.7;
        viewer.animation = new WalkingAnimation();
        viewer.animation.speed = 0.5;
        
        // Disable FXAA to avoid shader warnings
        if (viewer.renderer) {
          viewer.renderer.antialias = true;
        }
        
        // Auto-rotate
        let rotate = 0;
        const animation = () => {
          if (!mounted) return;
          rotate += 0.005;
          viewer.playerObject.rotation.y = rotate;
          animationFrameId = requestAnimationFrame(animation);
        };
        animation();

        viewerRef.current = viewer;
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading skin viewer:', error);
        setIsLoading(false);
      }
    };

    loadSkinViewer();

    return () => {
      mounted = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (viewerRef.current) {
        viewerRef.current.dispose?.();
      }
    };
  }, [username, width, height]);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-purple-900/20 rounded-lg"
          style={{ width, height }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-lg"
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </div>
  );
}
