import { Game } from '../Game';
import { Building } from './Building';
import { ProductionQueue } from '../ProductionQueue';
import { Marine } from '../units/Marine';
import { Tank } from '../units/Tank';
import { Team } from '../types';

export class Barracks extends Building {
    private static readonly MARINE_PRODUCTION_TIME = 2000;  // 2초
    private static readonly TANK_PRODUCTION_TIME = 4000;    // 4초
    private static readonly MARINE_COST = 50;
    private static readonly TANK_COST = 150;
    private productionQueue: ProductionQueue;

    constructor(game: Game, x: number, y: number, team: Team) {
        super(game, x, y, team);
        this.productionQueue = new ProductionQueue();
        this.size = { width: 60, height: 60 };
    }

    update(): void {
        super.update();
        
        if (this.isConstructed()) {
            const completedUnit = this.productionQueue.update();
            if (completedUnit === 'Marine') {
                this.spawnMarine();
            } else if (completedUnit === 'Tank') {
                this.spawnTank();
            }
        }
    }

    startMarineProduction(): void {
        if (this.isConstructed() && !this.productionQueue.isFull()) {
            if (this.game.spendMinerals(Barracks.MARINE_COST, this.team)) {
                console.log('Starting Marine production');
                this.productionQueue.addToQueue('Marine', Barracks.MARINE_PRODUCTION_TIME);
            } else {
                console.log('Not enough minerals for Marine');
            }
        }
    }

    startTankProduction(): void {
        if (this.isConstructed() && !this.productionQueue.isFull()) {
            if (this.game.spendMinerals(Barracks.TANK_COST, this.team)) {
                console.log('Starting Tank production');
                this.productionQueue.addToQueue('Tank', Barracks.TANK_PRODUCTION_TIME);
            } else {
                console.log('Not enough minerals for Tank');
            }
        }
    }

    private spawnTank(): void {
        const spawnRadius = 80;
        const attempts = 16;
        
        // 원형으로 생성 위치 시도
        for (let i = 0; i < attempts; i++) {
            const angle = (i * 2 * Math.PI) / attempts;
            const spawnPos = {
                x: this.position.x + Math.cos(angle) * spawnRadius,
                y: this.position.y + Math.sin(angle) * spawnRadius
            };

            if (!this.game.isPositionOccupied(spawnPos)) {
                const tank = new Tank(this.game, spawnPos.x, spawnPos.y);
                this.game.addUnit(tank);
                return;
            }
        }

        // 더 넓은 반경으로 재시도
        const extendedRadius = spawnRadius * 1.5;
        for (let i = 0; i < attempts; i++) {
            const angle = (i * 2 * Math.PI) / attempts;
            const spawnPos = {
                x: this.position.x + Math.cos(angle) * extendedRadius,
                y: this.position.y + Math.sin(angle) * extendedRadius
            };

            if (!this.game.isPositionOccupied(spawnPos)) {
                const tank = new Tank(this.game, spawnPos.x, spawnPos.y);
                this.game.addUnit(tank);
                return;
            }
        }
    }

    private spawnMarine(): void {
        const spawnRadius = 80;  // 생성 반경
        const attempts = 16;     // 시도 횟수
        
        // 원형으로 생성 위치 시도
        for (let i = 0; i < attempts; i++) {
            const angle = (i * 2 * Math.PI) / attempts;
            const spawnPos = {
                x: this.position.x + Math.cos(angle) * spawnRadius,
                y: this.position.y + Math.sin(angle) * spawnRadius
            };

            if (!this.game.isPositionOccupied(spawnPos)) {
                const marine = new Marine(this.game, spawnPos.x, spawnPos.y);
                this.game.addUnit(marine);
                return;
            }
        }

        // 모 넓은 반경으로 재시도
        const extendedRadius = spawnRadius * 1.5;
        for (let i = 0; i < attempts; i++) {
            const angle = (i * 2 * Math.PI) / attempts;
            const spawnPos = {
                x: this.position.x + Math.cos(angle) * extendedRadius,
                y: this.position.y + Math.sin(angle) * extendedRadius
            };

            if (!this.game.isPositionOccupied(spawnPos)) {
                const marine = new Marine(this.game, spawnPos.x, spawnPos.y);
                this.game.addUnit(marine);
                return;
            }
        }

        // 마지막 시도: 랜덤 위치
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const distance = spawnRadius + Math.random() * spawnRadius;
            const spawnPos = {
                x: this.position.x + Math.cos(angle) * distance,
                y: this.position.y + Math.sin(angle) * distance
            };

            if (!this.game.isPositionOccupied(spawnPos)) {
                const marine = new Marine(this.game, spawnPos.x, spawnPos.y);
                this.game.addUnit(marine);
                return;
            }
        }

        console.log('Failed to find spawn position for Marine');
    }

    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);

        // 생산 진행 상태 표시
        if (this.isConstructed()) {
            const progress = this.productionQueue.getProgress();
            if (progress > 0) {
                const barWidth = this.size.width;
                const barHeight = 5;
                
                ctx.fillStyle = '#0000ff';
                ctx.fillRect(
                    this.position.x - barWidth/2,
                    this.position.y - this.size.height/2 - 20,
                    barWidth * progress,
                    barHeight
                );
            }
        }
    }
} 