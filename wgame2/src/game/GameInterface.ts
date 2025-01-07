import { Vector2D } from './types';
import { Unit } from './units/Unit';
import { Building } from './buildings/Building';
import { Projectile } from './Projectile';

export interface GameInterface {
    spendMinerals(amount: number): boolean;
    addMinerals(amount: number): void;
    getCommandCenterPosition(): Vector2D;
    addUnit(unit: Unit): void;
    addBuilding(building: Building): void;
    addProjectile(projectile: Projectile): void;
    isPositionOccupied(pos: Vector2D): boolean;
} 