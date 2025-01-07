export interface Vector2D {
    x: number;
    y: number;
}

export interface Size2D {
    width: number;
    height: number;
}

export interface Damageable {
    takeDamage(amount: number): void;
    isDestroyed(): boolean;
    getHealth(): number;
    getMaxHealth(): number;
}

export enum ProjectileType {
    BULLET,    // 마린용 총알
    CANNON     // 탱크용 포탄
}

export enum TeamColor {
    RED = '#ff4444',
    BLUE = '#4444ff',
    GREEN = '#44ff44',
    YELLOW = '#ffff44'
}

export interface Team {
    id: number;
    color: TeamColor;
    minerals: number;  // 각 팀의 미네랄 보유량
} 