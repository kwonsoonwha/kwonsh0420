import { GameObject } from '../GameObject';
import { Game } from '../Game';

export class MineralField extends GameObject {
    private minerals: number;

    constructor(game: Game, x: number, y: number) {
        super(game, x, y);
        this.minerals = 1500;
        this.size = { width: 40, height: 40 };
    }

    update(): void {
        // 미네랄 필드는 업데이트할 내용이 없음
    }

    draw(ctx: CanvasRenderingContext2D): void {
        // 미네랄 필드 그리기
        ctx.fillStyle = '#3366CC';
        ctx.fillRect(
            this.position.x - this.size.width/2,
            this.position.y - this.size.height/2,
            this.size.width,
            this.size.height
        );

        // 남은 미네랄 양 표시
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            this.minerals.toString(),
            this.position.x,
            this.position.y + this.size.height/2 + 15
        );
    }

    mine(amount: number): number {
        if (this.minerals <= 0) return 0;
        
        const minedAmount = Math.min(amount, this.minerals);
        this.minerals -= minedAmount;
        return minedAmount;
    }

    getMinerals(): number {
        return this.minerals;
    }

    isEmpty(): boolean {
        return this.minerals <= 0;
    }
} 