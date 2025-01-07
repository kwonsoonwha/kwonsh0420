export class MoveCommand {
    private position: { x: number; y: number };
    private lifetime: number;
    private maxLifetime: number = 30; // 프레임 단위

    constructor(x: number, y: number) {
        this.position = { x, y };
        this.lifetime = this.maxLifetime;
    }

    update(): boolean {
        this.lifetime--;
        return this.lifetime > 0;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const alpha = this.lifetime / this.maxLifetime;
        ctx.strokeStyle = `rgba(46, 204, 113, ${alpha})`;
        ctx.lineWidth = 2;

        // 십자가 모양 그리기
        const size = 10;
        ctx.beginPath();
        // 가로선
        ctx.moveTo(this.position.x - size, this.position.y);
        ctx.lineTo(this.position.x + size, this.position.y);
        // 세로선
        ctx.moveTo(this.position.x, this.position.y - size);
        ctx.lineTo(this.position.x, this.position.y + size);
        ctx.stroke();

        // 원 그리기
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, size * 0.7, 0, Math.PI * 2);
        ctx.stroke();
    }
} 