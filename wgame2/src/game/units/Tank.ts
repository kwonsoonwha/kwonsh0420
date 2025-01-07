import { Unit } from './Unit';
import { Game } from '../Game';
import { Team } from '../types';
import { Projectile } from '../Projectile';
import { ProjectileType } from '../types';

export class Tank extends Unit {
    private static readonly ATTACK_RANGE = 450;
    private static readonly ATTACK_DAMAGE = 20;
    private static readonly ATTACK_COOLDOWN = 2000;  // 2초
    private lastAttackTime: number = 0;

    constructor(game: Game, x: number, y: number, team?: Team) {
        super(game, x, y, team);
        this.health = 150;
        this.maxHealth = 150;
        this.speed = 2;  // 마린보다 느림
        this.size = { width: 40, height: 40 };  // 마린보다 큼
    }

    update(): void {
        super.update();
        this.updateAttack();
    }

    private updateAttack(): void {
        if (this.targetUnit && !this.targetUnit.isDestroyed()) {
            const currentTime = Date.now();
            const targetPos = this.targetUnit.getPosition();
            const dx = targetPos.x - this.position.x;
            const dy = targetPos.y - this.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= Tank.ATTACK_RANGE && 
                currentTime - this.lastAttackTime >= Tank.ATTACK_COOLDOWN) {
                // 포탄 발사
                const projectile = new Projectile(
                    { ...this.position },
                    this.targetUnit,
                    ProjectileType.CANNON,
                    Tank.ATTACK_DAMAGE
                );
                this.game.addProjectile(projectile);
                this.lastAttackTime = currentTime;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        // 탱크 본체
        ctx.fillStyle = this.team.color;  // 팀 색상 사용
        ctx.fillRect(
            this.position.x - this.size.width/2,
            this.position.y - this.size.height/2,
            this.size.width,
            this.size.height
        );

        // 포신
        if (this.targetUnit) {
            const targetPos = this.targetUnit.getPosition();
            const angle = Math.atan2(
                targetPos.y - this.position.y,
                targetPos.x - this.position.x
            );
            
            ctx.strokeStyle = '#444444';
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(this.position.x, this.position.y);
            ctx.lineTo(
                this.position.x + Math.cos(angle) * 45,
                this.position.y + Math.sin(angle) * 45
            );
            ctx.stroke();
        }

        // 선택 표시
        if (this.isSelected) {
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                this.position.x - this.size.width/2 - 2,
                this.position.y - this.size.height/2 - 2,
                this.size.width + 4,
                this.size.height + 4
            );
        }

        // 체력바
        this.drawHealthBar(ctx);
    }
} 