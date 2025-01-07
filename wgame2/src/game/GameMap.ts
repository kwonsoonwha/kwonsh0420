export class GameMap {
    private width: number;
    private height: number;
    private gridSize: number = 30;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        // 그리드 그리기
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.5;

        // 수직선
        for (let x = 0; x <= this.width; x += this.gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }

        // 수평선
        for (let y = 0; y <= this.height; y += this.gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }
    }
} 