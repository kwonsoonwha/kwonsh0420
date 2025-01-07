import { Game } from './Game';
import { Vector2D, Size2D, Team } from './types';

export abstract class GameObject {
    protected game: Game;
    protected position: Vector2D;
    protected size: Size2D;
    protected team: Team;

    constructor(game: Game, x: number, y: number, team?: Team, width: number = 40, height: number = 40) {
        this.game = game;
        this.position = { x, y };
        this.size = { width, height };
        this.team = team || game.getCurrentTeam();
    }

    abstract update(): void;
    abstract draw(ctx: CanvasRenderingContext2D): void;

    getPosition(): Vector2D {
        return { ...this.position };
    }

    getSize(): Size2D {
        return { ...this.size };
    }

    isPointInside(x: number, y: number): boolean {
        return x >= this.position.x - this.size.width/2 &&
               x <= this.position.x + this.size.width/2 &&
               y >= this.position.y - this.size.height/2 &&
               y <= this.position.y + this.size.height/2;
    }

    setPosition(x: number, y: number): void {
        this.position.x = x;
        this.position.y = y;
    }

    moveTo(x: number, y: number): void {
        this.setPosition(x, y);
    }

    getTeam(): Team {
        return this.team;
    }
} 