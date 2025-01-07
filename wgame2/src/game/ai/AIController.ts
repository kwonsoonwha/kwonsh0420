import { Game } from '../Game';
import { Team, Vector2D } from '../types';
import { CommandCenter } from '../buildings/CommandCenter';
import { Barracks } from '../buildings/Barracks';
import { GameObject } from '../GameObject';
import { Unit } from '../units/Unit';
import { Building } from '../buildings/Building';

export class AIController {
    private game: Game;
    private team: Team;
    private commandCenter: CommandCenter;
    private barracks: Barracks;
    private lastProductionTime: number = 0;
    private lastStrategyTime: number = 0;
    private productionInterval: number = 5000;  // 5초마다 유닛 생산 시도
    private strategyInterval: number = 10000;   // 10초마다 전략 업데이트
    private mineralThreshold: number = 200;     // 이 이상의 미네랄이 있으면 탱크 생산
    private marines: Unit[] = [];
    private tanks: Unit[] = [];

    constructor(game: Game, team: Team, commandCenter: CommandCenter, barracks: Barracks) {
        this.game = game;
        this.team = team;
        this.commandCenter = commandCenter;
        this.barracks = barracks;
    }

    update(deltaTime: number): void {
        const currentTime = Date.now();
        
        // 주기적으로 유닛 생산 시도
        if (currentTime - this.lastProductionTime > this.productionInterval) {
            this.tryProduceUnit();
            this.lastProductionTime = currentTime;
        }

        // 주기적으로 전략 업데이트
        if (currentTime - this.lastStrategyTime > this.strategyInterval) {
            this.updateStrategy();
            this.lastStrategyTime = currentTime;
        }

        // 유닛들의 상태 업데이트
        this.updateUnits();
    }

    private tryProduceUnit(): void {
        const minerals = this.game.getMinerals(this.team);
        const myUnits = this.game.getUnits().filter(unit => unit.getTeam().id === this.team.id);
        
        // 기본적으로 마린과 탱크의 비율을 3:1로 유지
        const marines = myUnits.filter(unit => unit.constructor.name === 'Marine');
        const tanks = myUnits.filter(unit => unit.constructor.name === 'Tank');
        
        if (minerals >= this.mineralThreshold && tanks.length * 3 <= marines.length) {
            // 탱크 생산 조건 충족
            this.barracks.startTankProduction();
        } else if (minerals >= 50) {
            // 마린 생산
            this.barracks.startMarineProduction();
        }
    }

    private updateStrategy(): void {
        const myUnits = this.game.getUnits().filter(unit => unit.getTeam().id === this.team.id);
        
        if (myUnits.length >= 5) {  // 최소 5유닛 이상일 때 공격 그룹 형성
            // 가장 가까운 적 기지를 찾아 공격
            const enemyBuildings = this.game.getBuildings().filter((building: Building) => 
                building.getTeam().id !== this.team.id
            );

            if (enemyBuildings.length > 0) {
                const target = this.findNearestTarget(this.commandCenter.getPosition(), enemyBuildings);
                if (target) {
                    // 모든 유닛에게 공격 명령
                    for (const unit of myUnits) {
                        unit.setTarget(target);
                    }
                }
            }
        }
    }

    private updateUnits(): void {
        const myUnits = this.game.getUnits().filter(unit => unit.getTeam().id === this.team.id);
        const enemyUnits = this.game.getUnits().filter(unit => unit.getTeam().id !== this.team.id);
        const enemyBuildings = this.game.getBuildings().filter((building: Building) => 
            building.getTeam().id !== this.team.id
        );

        for (const unit of myUnits) {
            if (!unit.hasTarget()) {
                // 가장 가까운 적 유닛이나 건물을 찾아 공격
                const targets = [...enemyUnits, ...enemyBuildings];
                if (targets.length > 0) {
                    const nearestTarget = this.findNearestTarget(unit.getPosition(), targets);
                    if (nearestTarget) {
                        unit.setTarget(nearestTarget);
                    }
                } else {
                    // 적이 없으면 기지 근처에서 대기
                    const basePos = this.commandCenter.getPosition();
                    const guardPos = {
                        x: basePos.x + (Math.random() - 0.5) * 200,
                        y: basePos.y + (Math.random() - 0.5) * 200
                    };
                    unit.moveTo(guardPos);
                }
            }
        }
    }

    private findNearestTarget(position: Vector2D, targets: GameObject[]): GameObject | null {
        let nearest = null;
        let minDistance = Infinity;

        for (const target of targets) {
            const targetPos = target.getPosition();
            const distance = Math.sqrt(
                Math.pow(targetPos.x - position.x, 2) + 
                Math.pow(targetPos.y - position.y, 2)
            );

            if (distance < minDistance) {
                minDistance = distance;
                nearest = target;
            }
        }

        return nearest;
    }
}