export class GameMap {
    private tileSize: number = 32;
    private width: number;
    private height: number;
    private tiles: number[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.tiles = Array(height).fill(0).map(() => Array(width).fill(0));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        // 맵 그리드 그리기
        ctx.strokeStyle = '#666';
        
        // 수직선
        for (let x = 0; x <= this.width; x++) {
            ctx.beginPath();
            ctx.moveTo(x * this.tileSize, 0);
            ctx.lineTo(x * this.tileSize, this.height * this.tileSize);
            ctx.stroke();
        }
        
        // 수평선
        for (let y = 0; y <= this.height; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * this.tileSize);
            ctx.lineTo(this.width * this.tileSize, y * this.tileSize);
            ctx.stroke();
        }
    }
} 