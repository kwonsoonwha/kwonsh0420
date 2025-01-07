import { BaseEffect } from './Effect';

export class BloodSplatter extends BaseEffect {
    private particles: Array<{ x: number; y: number; vx: number; vy: number; size: number }> = [];
    private readonly particleCount = 10;

    constructor(x: number, y: number) {
        super(x, y, 20);  // 20 프레임 동안 지속
        
        // 파티클 초기화
        for (let i = 0; i < this.particleCount; i++) {
            const angle = (Math.PI * 2 * i) / this.particleCount;
            const speed = 1 + Math.random() * 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 1 + Math.random() * 2
            });
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.active) return;

        const alpha = 1 - (this.currentTime / this.duration);
        ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;

        this.particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            // 파티클 이동
            particle.x += particle.vx;
            particle.y += particle.vy;
        });
    }
} 