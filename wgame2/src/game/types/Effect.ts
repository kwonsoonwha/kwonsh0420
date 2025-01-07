export interface Effect {
    update(): boolean;
    draw(ctx: CanvasRenderingContext2D): void;
} 