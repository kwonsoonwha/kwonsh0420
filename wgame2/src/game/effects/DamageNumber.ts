import { BaseEffect } from './Effect';

export class DamageNumber extends BaseEffect {
    private damage: number;
    private readonly floatSpeed = 1;

    constructor(x: number, y: number, damage: number) {
        super(x, y, 40);  // 40 프레임 동안 지속
        this.damage = damage;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.active) return;

        const alpha = 1 - (this.currentTime / this.duration);
        ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            this.damage.toString(),
            this.position.x,
            this.position.y - (this.currentTime * this.floatSpeed)
        );
    }
} 