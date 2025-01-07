import { BaseEffect } from './Effect';

export class MuzzleFlash extends BaseEffect {
    private direction: number;
    private readonly size = 10;

    constructor(x: number, y: number, direction: number) {
        super(x, y, 5);  // 5 프레임 동안 지속
        this.direction = direction;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.active) return;

        const alpha = 1 - (this.currentTime / this.duration);
        ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
        
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.direction);
        
        // 총구 화염 그리기
        ctx.beginPath();
        ctx.moveTo(0, -this.size/2);
        ctx.lineTo(this.size, 0);
        ctx.lineTo(0, this.size/2);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
} 