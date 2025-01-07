import { Game } from '../Game';
import { GameObject } from '../GameObject';
import { Vector2D } from '../types';
import { Damageable } from '../types';
import { Team } from '../types';

export abstract class Building extends GameObject implements Damageable {
    protected health: number = 400;
    protected maxHealth: number = 400;
    protected constructionProgress: number = 0;
    protected constructionTime: number = 5000;  // 5초
    protected isSelected: boolean = false;

    constructor(game: Game, x: number, y: number, team?: Team) {
        super(game, x, y, team);
        this.constructionProgress = 0;
        this.constructionTime = 5000;  // 5초
        this.health = 400;
        this.maxHealth = 400;
    }

    public update(): void {
        if (!this.isConstructed()) {
            this.constructionProgress += 16.67;  // 약 60fps
            if (this.constructionProgress >= this.constructionTime) {
                this.constructionProgress = this.constructionTime;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        // 건물 본체
        ctx.fillStyle = this.isConstructed() ? '#666666' : '#444444';
        ctx.fillRect(
            this.position.x - this.size.width/2,
            this.position.y - this.size.height/2,
            this.size.width,
            this.size.height
        );

        // 건설 진행 상태
        if (!this.isConstructed()) {
            const progress = this.constructionProgress / this.constructionTime;
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(
                this.position.x - this.size.width/2,
                this.position.y - this.size.height/2 - 10,
                this.size.width * progress,
                5
            );
        }

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
            ctx.strokeRect(
                this.position.x - this.size.width/2 - 2,
                this.position.y - this.size.height/2 - 2,
                this.size.width + 4,
                this.size.height + 4
            );
        }
    }

    isConstructed(): boolean {
        return this.constructionProgress >= this.constructionTime;
    }

    setSelected(selected: boolean): void {
        this.isSelected = selected;
    }

    takeDamage(amount: number): void {
        this.health = Math.max(0, this.health - amount);
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
}
