import { Unit } from './Unit';
import { Game } from '../Game';
import { Team } from '../types';
import { MineralField } from '../resources/MineralField';
import { Vector2D } from '../types';
import { Projectile } from '../Projectile';
import { ProjectileType } from '../types';

export class Marine extends Unit {
    private static readonly MINING_RANGE = 50;
    private static readonly MINING_AMOUNT = 8;
    private static readonly MINING_COOLDOWN = 1000;  // 1초
    private static readonly ATTACK_RANGE = 150;      // 추가
    private static readonly ATTACK_DAMAGE = 5;       // 추가
    private static readonly ATTACK_COOLDOWN = 500;   // 추가 (0.5초)
    
    private lastMiningTime: number = 0;
    private lastAttackTime: number = 0;
    private targetMineralField: MineralField | null = null;
    private carryingMinerals: boolean = false;

    constructor(game: Game, x: number, y: number, team?: Team) {
        super(game, x, y, team);
        this.health = 40;
        this.maxHealth = 40;
        this.speed = 3;
        this.size = { width: 20, height: 20 };
        console.log(`Marine created at: ${x} ${y}`);
    }

    update(): void {
        super.update();
        
        // 미네랄 수집 로직 수정
        if (this.targetMineralField && !this.targetMineralField.isEmpty()) {
            const currentTime = Date.now();
            if (currentTime - this.lastMiningTime >= Marine.MINING_COOLDOWN) {
                const minedAmount = this.targetMineralField.mine(Marine.MINING_AMOUNT);
                if (minedAmount > 0) {
                    this.game.addMinerals(minedAmount, this.team);  // 팀 정보 전달
                    this.lastMiningTime = currentTime;
                }
            }
        }
        
        this.updateAttack();
    }

    private updateMining(): void {
        if (this.targetMineralField && !this.isDead()) {
            const currentTime = Date.now();
            
            if (currentTime - this.lastMiningTime >= Marine.MINING_COOLDOWN) {
                if (!this.carryingMinerals) {
                    const mineralPos = this.targetMineralField.getPosition();
                    const distance = this.getDistanceTo(mineralPos);

                    if (distance <= Marine.MINING_RANGE) {
                        const minedAmount = this.targetMineralField.mine(Marine.MINING_AMOUNT);
                        if (minedAmount > 0) {
                            this.carryingMinerals = true;
                            this.lastMiningTime = currentTime;
                            const basePos = this.game.getCommandCenterPosition();
                            this.moveTo(basePos.x, basePos.y);
                        }
                    }
                } else {
                    const basePos = this.game.getCommandCenterPosition();
                    const distance = this.getDistanceTo(basePos);

                    if (distance <= Marine.MINING_RANGE) {
                        this.game.addMinerals(Marine.MINING_AMOUNT);
                        this.carryingMinerals = false;
                        this.lastMiningTime = currentTime;
                        const mineralPos = this.targetMineralField.getPosition();
                        this.moveTo(mineralPos.x, mineralPos.y);
                    }
                }
            }
        }
    }

    private getDistanceTo(pos: Vector2D): number {
        const dx = pos.x - this.position.x;
        const dy = pos.y - this.position.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    setMiningTarget(mineralField: MineralField): void {
        this.targetMineralField = mineralField;
        this.targetUnit = null;
        const mineralPos = mineralField.getPosition();
        this.moveTo(mineralPos.x, mineralPos.y);
    }

    isDead(): boolean {
        return this.health <= 0;
    }

    private updateAttack(): void {
        if (this.targetUnit && !this.targetUnit.isDestroyed()) {
            const currentTime = Date.now();
            const targetPos = this.targetUnit.getPosition();
            const dx = targetPos.x - this.position.x;
            const dy = targetPos.y - this.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= Marine.ATTACK_RANGE && 
                currentTime - this.lastAttackTime >= Marine.ATTACK_COOLDOWN) {
                // 총알 발사
                const projectile = new Projectile(
                    { ...this.position },
                    this.targetUnit,
                    ProjectileType.BULLET,
                    Marine.ATTACK_DAMAGE
                );
                this.game.addProjectile(projectile);
                this.lastAttackTime = currentTime;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        // 마린 본체
        ctx.fillStyle = this.team.color;  // 팀 색상 사용
        ctx.beginPath();
        ctx.arc(
            this.position.x,
            this.position.y,
            this.size.width/2,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // ... 나머지 draw 코드 ...
    }
} 