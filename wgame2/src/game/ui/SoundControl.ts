import { Game } from '../Game';
import { SoundManager } from '../managers/SoundManager';

export class SoundControl {
    private position = { x: 10, y: 60 };
    private size = { width: 30, height: 30 };
    private isMuted = false;

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = '#666666';
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height
        );

        // 음소거 아이콘 그리기
        ctx.fillStyle = this.isMuted ? '#ff0000' : '#00ff00';
        ctx.beginPath();
        ctx.moveTo(this.position.x + 8, this.position.y + 15);
        ctx.lineTo(this.position.x + 15, this.position.y + 8);
        ctx.lineTo(this.position.x + 15, this.position.y + 22);
        ctx.closePath();
        ctx.fill();
    }

    isPointInside(x: number, y: number): boolean {
        return x >= this.position.x &&
               x <= this.position.x + this.size.width &&
               y >= this.position.y &&
               y <= this.position.y + this.size.height;
    }

    handleMouseDown(x: number, y: number): void {
        if (this.isPointInside(x, y)) {
            this.isMuted = !this.isMuted;
            console.log('Sound ' + (this.isMuted ? 'muted' : 'unmuted'));
        }
    }

    isSoundMuted(): boolean {
        return this.isMuted;
    }
} 