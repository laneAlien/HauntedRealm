import { useEffect, useState } from "react";

interface Particle {
  id: number;
  left: number;
  animationDelay: number;
  animationDuration: number;
}

export default function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Initial particles
    const initialParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 8,
      animationDuration: Math.random() * 6 + 8,
    }));
    setParticles(initialParticles);

    // Add new particles periodically
    const interval = setInterval(() => {
      setParticles(prev => {
        // Remove old particles and add new one
        const filtered = prev.filter(p => Date.now() - p.id < 20000);
        const newParticle: Particle = {
          id: Date.now(),
          left: Math.random() * 100,
          animationDelay: 0,
          animationDuration: Math.random() * 6 + 8,
        };
        return [...filtered, newParticle];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="floating-particles fixed inset-0 z-0 pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle absolute w-1 h-1 bg-moonlight-300/40 rounded-full animate-float"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
          }}
        />
      ))}
      
      {/* Additional ambient particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`ambient-${i}`}
          className="absolute w-0.5 h-0.5 bg-lavender-400/30 rounded-full animate-pulse"
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + Math.sin(i) * 30}%`,
            animationDelay: `${i * 2}s`,
            animationDuration: `${4 + i}s`,
          }}
        />
      ))}
    </div>
  );
}
