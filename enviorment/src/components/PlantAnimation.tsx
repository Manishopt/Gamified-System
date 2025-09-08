import { useEffect, useRef } from 'react';

interface PlantAnimationProps {
  progress: number; // 0 to 1
  height?: number;
  width?: number;
}

export default function PlantAnimation({ progress, height = 300, width = 200 }: PlantAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const lastProgressRef = useRef(0);
  const targetProgressRef = useRef(0);

  useEffect(() => {
    targetProgressRef.current = progress;
    
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    const drawPlant = (currentProgress: number) => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw pot
      ctx.fillStyle = '#8B5A2B';
      ctx.beginPath();
      const potWidth = width * 0.6;
      const potHeight = height * 0.15;
      const potX = (width - potWidth) / 2;
      const potY = height - potHeight;
      const cornerRadius = 10;
      
      // Draw pot with rounded corners
      ctx.roundRect(potX, potY, potWidth, potHeight, [0, 0, cornerRadius, cornerRadius]);
      ctx.fill();
      
      // Draw soil
      ctx.fillStyle = '#5D4037';
      ctx.beginPath();
      ctx.roundRect(potX + 5, potY - 5, potWidth - 10, 10, [5, 5, 0, 0]);
      ctx.fill();
      
      // Calculate plant height based on progress
      const maxPlantHeight = height * 0.7 * currentProgress;
      const plantX = width / 2;
      const plantBaseY = potY - 5;
      
      // Draw stem
      ctx.strokeStyle = '#2E7D32';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(plantX, plantBaseY);
      
      // Add some curve to the stem
      const cp1x = plantX + (Math.sin(currentProgress * Math.PI) * 20);
      const cp1y = plantBaseY - (maxPlantHeight * 0.7);
      const cp2x = plantX - (Math.sin(currentProgress * Math.PI * 0.7) * 20);
      const cp2y = plantBaseY - (maxPlantHeight * 0.3);
      
      ctx.bezierCurveTo(
        cp1x, cp1y,
        cp2x, cp2y,
        plantX, plantBaseY - maxPlantHeight
      );
      
      ctx.stroke();
      
      // Draw leaves
      if (currentProgress > 0.2) {
        drawLeaf(ctx, plantX, plantBaseY - (maxPlantHeight * 0.3), 30, 15, -0.5, currentProgress);
      }
      
      if (currentProgress > 0.4) {
        drawLeaf(ctx, plantX, plantBaseY - (maxPlantHeight * 0.6), 35, 18, 0.3, currentProgress);
      }
      
      // Draw flower if progress is high
      if (currentProgress > 0.8) {
        const flowerY = plantBaseY - maxPlantHeight;
        drawFlower(ctx, plantX, flowerY, 15 + (10 * (currentProgress - 0.8) / 0.2));
      }
    };
    
    const drawLeaf = (ctx: CanvasRenderingContext2D, x: number, y: number, length: number, width: number, angle: number, progress: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      // Animate leaf growing
      const leafProgress = Math.min(1, progress * 2);
      const currentLength = length * leafProgress;
      const currentWidth = width * leafProgress;
      
      ctx.beginPath();
      ctx.ellipse(0, 0, currentWidth, currentLength / 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#4CAF50';
      ctx.fill();
      
      // Add leaf vein
      ctx.beginPath();
      ctx.moveTo(0, -currentLength / 2);
      ctx.lineTo(0, currentLength / 2);
      ctx.strokeStyle = '#2E7D32';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      ctx.restore();
    };
    
    const drawFlower = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      // Draw petals
      const petalCount = 5;
      const petalLength = size * 1.2;
      
      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        const petalX = x + Math.cos(angle) * size * 0.6;
        const petalY = y + Math.sin(angle) * size * 0.6;
        
        ctx.save();
        ctx.translate(petalX, petalY);
        ctx.rotate(angle);
        
        // Draw petal
        ctx.beginPath();
        ctx.ellipse(0, 0, petalLength * 0.4, petalLength, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#FF80AB';
        ctx.fill();
        
        // Add some petal details
        ctx.strokeStyle = '#F50057';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
      }
      
      // Draw center
      ctx.beginPath();
      ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD700';
      ctx.fill();
    };
    
    const animate = () => {
      const currentProgress = lastProgressRef.current;
      const targetProgress = targetProgressRef.current;
      
      // Smoothly animate to target progress
      const newProgress = currentProgress + (targetProgress - currentProgress) * 0.1;
      lastProgressRef.current = newProgress;
      
      drawPlant(newProgress);
      
      // Continue animation if not at target
      if (Math.abs(newProgress - targetProgress) > 0.001) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    
    // Start animation if not already running
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    };
  }, [progress, height, width]);
  
  return (
    <div className="flex flex-col items-center">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ maxWidth: '200px' }}
      />
      <div className="mt-2 text-sm text-gray-600">
        Plant Growth: {Math.round(progress * 100)}%
      </div>
    </div>
  );
}
