import { GameObject } from '../GameObject';
import { Game } from '../Game';
import { Vector2D, Team } from '../types';

export abstract class Unit extends GameObject {
    protected health: number = 100;
    protected maxHealth: number = 100;
    protected speed: number = 2;
    protected isSelected: boolean = false;
    protected targetPosition: Vector2D | null = null;
    protected targetUnit: Unit | null = null;

    constructor(game: Game, x: number, y: number, team?: Team) {
        super(game, x, y, team);
        this.targetPosition = null;
        this.targetUnit = null;
        this.isSelected = false;
    }

    update(): void {
        if (this.targetPosition) {
            const dx = this.targetPosition.x - this.position.x;
            const dy = this.targetPosition.y - this.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > this.speed) {
                const ratio = this.speed / distance;
                this.position.x += dx * ratio;
                this.position.y += dy * ratio;
            } else {
                this.position.x = this.targetPosition.x;
                this.position.y = this.targetPosition.y;
                this.targetPosition = null;
            }
        }
    }

    private calculateAvoidanceForce(): Vector2D {
        const force = { x: 0, y: 0 };
        const avoidanceRadius = 40;     // 회피 반경 증가
        const maxForce = 3;            // 최대 회피 힘 증가
        const minDistance = 20;        // 최소 거리 설정

        for (const otherUnit of this.game.getUnits()) {
            if (otherUnit === this) continue;

            const otherPos = otherUnit.getPosition();
            const dx = this.position.x - otherPos.x;
            const dy = this.position.y - otherPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < avoidanceRadius) {
                // 최소 거리보다 가까우면 더 강한 회피력 적용
                const strength = distance < minDistance ? 
                    maxForce : 
                    maxForce * (avoidanceRadius - distance) / avoidanceRadius;
                
                if (distance > 0) {
                    force.x += (dx / distance) * strength;
                    force.y += (dy / distance) * strength;
                } else {
                    // 완전히 같은 위치에 있을 경우 랜덤 방향으로 밀어냄
                    const randomAngle = Math.random() * Math.PI * 2;
                    force.x += Math.cos(randomAngle) * maxForce;
                    force.y += Math.sin(randomAngle) * maxForce;
                }
            }
        }

        // 힘의 크기 제한
        const forceMagnitude = Math.sqrt(force.x * force.x + force.y * force.y);
        if (forceMagnitude > maxForce) {
            force.x = (force.x / forceMagnitude) * maxForce;
            force.y = (force.y / forceMagnitude) * maxForce;
        }

        return force;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        // 유닛 본체
        ctx.fillStyle = '#4444ff';
        ctx.beginPath();
        ctx.arc(
            this.position.x,
            this.position.y,
            this.size.width / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // 체력바
        const healthBarWidth = this.size.width;
        const healthBarHeight = 5;
        const healthPercentage = this.health / this.maxHealth;

        ctx.fillStyle = '#ff0000';
        ctx.fillRect(
            this.position.x - healthBarWidth/2,
            this.position.y - this.size.height/2 - 10,
            healthBarWidth,
            healthBarHeight
        );

        ctx.fillStyle = '#00ff00';
        ctx.fillRect(
            this.position.x - healthBarWidth/2,
            this.position.y - this.size.height/2 - 10,
            healthBarWidth * healthPercentage,
            healthBarHeight
        );

        // 선택 표시
        if (this.isSelected) {
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(
                this.position.x,
                this.position.y,
                this.size.width / 2 + 5,
                0,
                Math.PI * 2
            );
            ctx.stroke();
        }
    }

    moveTo(x: number | Vector2D, y?: number): void {
        if (typeof x === 'object') {
            // Vector2D 객체로 전달된 경우
            this.targetPosition = { x: x.x, y: x.y };
        } else if (typeof x === 'number' && typeof y === 'number') {
            // x, y 좌표로 전달된 경우
            this.targetPosition = { x, y };
        }
        this.targetUnit = null;  // 이동 명령이 들어오면 공격 타겟 취소
    }

    attackTarget(target: Unit): void {
        this.targetUnit = target;
        this.targetPosition = target.getPosition();
    }

    takeDamage(amount: number): void {
        this.health = Math.max(0, this.health - amount);
    }

    setSelected(selected: boolean): void {
        this.isSelected = selected;
    }

    isDestroyed(): boolean {
        return this.health <= 0;
    }

    getHealth(): number {
        return this.health;
    }

    getMaxHealth(): number {
        return this.maxHealth;
    }

    protected drawHealthBar(ctx: CanvasRenderingContext2D): void {
        const healthBarWidth = this.size.width;
        const healthBarHeight = 4;
        const healthPercentage = this.health / this.maxHealth;

        // 빨간색 배경 (총 체력)
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(
            this.position.x - healthBarWidth/2,
            this.position.y - this.size.height/2 - 10,
            healthBarWidth,
            healthBarHeight
        );

        // 녹색 체력바 (현재 체력)
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(
            this.position.x - healthBarWidth/2,
            this.position.y - this.size.height/2 - 10,
            healthBarWidth * healthPercentage,
            healthBarHeight
        );
    }

    getTeam(): Team {
        return this.team;
    }

    hasTarget(): boolean {
        return this.targetUnit !== null;
    }

    setTarget(target: GameObject): void {
        if (target instanceof Unit) {
            this.targetUnit = target;
        }
    }
}
