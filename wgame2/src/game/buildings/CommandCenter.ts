import { Building } from './Building';
import { Game } from '../Game';
import { Team } from '../types';

export class CommandCenter extends Building {
    constructor(game: Game, x: number, y: number, team: Team) {
        super(game, x, y, team);
        this.size = { width: 100, height: 100 };  // 커맨드센터는 더 큰 크기
        this.health = 1000;
        this.maxHealth = 1000;
        this.constructionProgress = this.constructionTime;  // 처음부터 완성된 상태
    }

    draw(ctx: CanvasRenderingContext2D): void {
        // 커맨드센터 본체
        ctx.fillStyle = this.team.color;  // 팀 색상 사용
        ctx.fillRect(
            this.position.x - this.size.width/2,
            this.position.y - this.size.height/2,
            this.size.width,
            this.size.height
        );

        // 'M' 표시
        ctx.fillStyle = '#000000';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            'M',
            this.position.x,
            this.position.y + 8
        );

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
} 