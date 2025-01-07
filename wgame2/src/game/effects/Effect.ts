export interface Effect {
    update(): void;
    draw(ctx: CanvasRenderingContext2D): void;
    isActive(): boolean;
    deactivate(): void;
}

export abstract class BaseEffect implements Effect {
    protected position: { x: number; y: number };
    protected duration: number;
    protected currentTime: number = 0;
    protected active: boolean = true;

    constructor(x: number, y: number, duration: number) {
        this.position = { x, y };
        this.duration = duration;
    }

    update(): void {
        if (!this.active) return;
        this.currentTime++;
        if (this.currentTime >= this.duration) {
            this.active = false;
        }
    }

    isActive(): boolean {
        return this.active;
    }

    deactivate(): void {
        this.active = false;
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;
} 