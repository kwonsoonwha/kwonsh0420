import { Vector2D, ProjectileType } from './types';
import { Unit } from './units/Unit';

export class Projectile {
    private position: Vector2D;
    private target: Unit;
    private type: ProjectileType;
    private speed: number;
    private damage: number;
    private destroyed: boolean = false;

    constructor(startPos: Vector2D, target: Unit, type: ProjectileType, damage: number) {
        this.position = { ...startPos };
        this.target = target;
        this.type = type;
        this.damage = damage;
        
        // 발사체 타입에 따른 속도 설정
        this.speed = type === ProjectileType.BULLET ? 8 : 5;
    }

    update(): void {
        if (this.destroyed) return;

        const targetPos = this.target.getPosition();
        const dx = targetPos.x - this.position.x;
        const dy = targetPos.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= this.speed) {
            this.target.takeDamage(this.damage);
            this.destroyed = true;
        } else {
            this.position.x += (dx / distance) * this.speed;
            this.position.y += (dy / distance) * this.speed;
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.destroyed) return;

        if (this.type === ProjectileType.BULLET) {
            // 총알
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // 포탄
            ctx.fillStyle = '#ff4400';
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    isDestroyed(): boolean {
        return this.destroyed;
    }
} 