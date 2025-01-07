import { Unit } from '../units/Unit';
import { Point } from '../types/Point';

export class Bullet {
    private position: { x: number; y: number };
    private velocity: { x: number; y: number };
    private damage: number;
    private speed: number;
    private target: Unit;
    private active: boolean = true;
    private sourceUnit: Unit;

    constructor(x: number, y: number, target: Unit, damage: number, sourceUnit: Unit, speed: number = 5) {
        this.position = { x, y };
        this.target = target;
        this.damage = damage;
        this.speed = speed;
        this.sourceUnit = sourceUnit;
        
        const targetPos = this.target.getPosition();
        const dx = targetPos.x - x;
        const dy = targetPos.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        this.velocity = {
            x: (dx / distance) * this.speed,
            y: (dy / distance) * this.speed
        };
    }

    update(): void {
        if (!this.active) return;

        // 투사체 이동
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // 타겟과의 충돌 체크
        const targetPos = this.target.getPosition();
        const targetSize = this.target.getSize();
        const dx = targetPos.x - this.position.x;
        const dy = targetPos.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 충돌 반경 계산 및 체크
        const targetRadius = targetSize.width / 2;  // width만 사용
        if (distance <= targetRadius) {
            this.target.takeDamage(this.damage);
            this.active = false;
        }

        // 화면 밖으로 나가면 비활성화
        if (this.isOutOfBounds()) {
            this.active = false;
        }
    }

    isActive(): boolean {
        return this.active;
    }

    private isOutOfBounds(): boolean {
        const screenWidth = 800;
        const screenHeight = 600;
        
        return (
            this.position.x < 0 ||
            this.position.x > screenWidth ||
            this.position.y < 0 ||
            this.position.y > screenHeight
        );
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.active) return;

        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
} 