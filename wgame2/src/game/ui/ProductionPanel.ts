import { Game } from '../Game';
import { Barracks } from '../buildings/Barracks';

export class ProductionPanel {
    private position = { x: 10, y: 100 };
    private size = { width: 110, height: 50 };
    private game: Game;
    private isVisible: boolean = false;
    private selectedBarracks: Barracks | null = null;

    constructor(game: Game) {
        this.game = game;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.isVisible) return;

        // 패널 배경
        ctx.fillStyle = '#444444';
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height
        );

        // 마린 생산 버튼
        ctx.fillStyle = '#666666';
        ctx.fillRect(
            this.position.x + 5,
            this.position.y + 5,
            40,
            40
        );

        // 마린 아이콘
        ctx.fillStyle = '#4444ff';
        ctx.beginPath();
        ctx.arc(
            this.position.x + 25,
            this.position.y + 25,
            15,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // 마린 생산 비용
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            '50',
            this.position.x + 25,
            this.position.y + 45
        );

        // 탱크 생산 버튼
        ctx.fillStyle = '#666666';
        ctx.fillRect(
            this.position.x + 55,
            this.position.y + 5,
            40,
            40
        );

        // 탱크 아이콘
        ctx.fillStyle = '#888888';
        ctx.fillRect(
            this.position.x + 65,
            this.position.y + 15,
            20,
            20
        );

        // 탱크 생산 비용
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            '150',
            this.position.x + 75,
            this.position.y + 45
        );
    }

    isPointInside(x: number, y: number): boolean {
        return this.isVisible &&
               x >= this.position.x &&
               x <= this.position.x + this.size.width &&
               y >= this.position.y &&
               y <= this.position.y + this.size.height;
    }

    handleClick(x: number, y: number): void {
        if (!this.isVisible || !this.selectedBarracks) return;

        // 마린 버튼 클릭
        if (x >= this.position.x + 5 && x <= this.position.x + 45 &&
            y >= this.position.y + 5 && y <= this.position.y + 45) {
            this.selectedBarracks.startMarineProduction();
        }
        // 탱크 버튼 클릭
        else if (x >= this.position.x + 55 && x <= this.position.x + 95 &&
                 y >= this.position.y + 5 && y <= this.position.y + 45) {
            this.selectedBarracks.startTankProduction();
        }
    }

    show(barracks: Barracks): void {
        this.isVisible = true;
        this.selectedBarracks = barracks;
    }

    hide(): void {
        this.isVisible = false;
        this.selectedBarracks = null;
    }
} 