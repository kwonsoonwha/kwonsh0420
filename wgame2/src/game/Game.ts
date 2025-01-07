import { GameInterface } from './GameInterface';
import { Vector2D } from './types';
import { Unit } from './units/Unit';
import { Building } from './buildings/Building';
import { Projectile } from './Projectile';
import { SoundControl } from './ui/SoundControl';
import { ProductionPanel } from './ui/ProductionPanel';
import { MineralField } from './resources/MineralField';
import { Marine } from './units/Marine';
import { Barracks } from './buildings/Barracks';
import { CommandCenter } from './buildings/CommandCenter';
import { Tank } from './units/Tank';
import { TeamColor, Team } from './types';
import { AIController } from './ai/AIController';

export class Game implements GameInterface {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private commandCenterPosition: Vector2D;
    private mineralFields: MineralField[] = [];
    private buildings: Building[] = [];
    private units: Unit[] = [];
    private projectiles: Projectile[] = [];
    private selectedUnits: Unit[] = [];
    private selectedBuildings: Building[] = [];
    private soundControl: SoundControl;
    private productionPanel: ProductionPanel;
    private gridSize: number;
    private gridColor: string;
    private mousePosition: Vector2D = { x: 0, y: 0 };
    private isMouseDown: boolean = false;
    private selectionStart: Vector2D | null = null;
    private dragStart: Vector2D | null = null;
    private isDragging: boolean = false;
    private commandCenter: CommandCenter;
    private lastUpdateTime: number = 0;
    private teams: Team[] = [
        { id: 0, color: TeamColor.RED, minerals: 50 },
        { id: 1, color: TeamColor.BLUE, minerals: 50 },
        { id: 2, color: TeamColor.GREEN, minerals: 50 },
        { id: 3, color: TeamColor.YELLOW, minerals: 50 }
    ];
    private commandCenters: CommandCenter[] = [];  // 각 팀의 커맨드센터 배열
    private aiControllers: AIController[] = [];

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.width = 1600;
        this.canvas.height = 1200;
        this.ctx = canvas.getContext('2d')!;
        
        // UI 컴포넌트 생성
        this.productionPanel = new ProductionPanel(this);
        this.soundControl = new SoundControl();

        // 4개 팀의 커맨드센터 생성
        this.initializeTeams();

        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        // 게임 루프 시작
        this.startGameLoop();

        // 미네랄 필드 생성
        this.initializeMineralFields();
    }

    // 캔버스 관련
    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    // 유닛 관리
    getUnits(): Unit[] {
        return this.units;
    }

    addUnit(unit: Unit): void {
        this.units.push(unit);
    }

    removeUnit(unit: Unit): void {
        const index = this.units.indexOf(unit);
        if (index > -1) {
            this.units.splice(index, 1);
        }
    }

    getSelectedUnits(): Unit[] {
        return this.selectedUnits;
    }

    // 건물 관리
    addBuilding(building: Building): void {
        this.buildings.push(building);
    }

    removeBuilding(building: Building): void {
        const index = this.buildings.indexOf(building);
        if (index > -1) {
            this.buildings.splice(index, 1);
        }
    }

    getSelectedBuildings(): Building[] {
        return this.selectedBuildings;
    }

    // 미네랄 관리
    getMinerals(team?: Team): number {
        if (team) {
            return team.minerals;
        }
        return this.getCurrentTeam().minerals;
    }

    addMinerals(amount: number, team?: Team): void {
        const targetTeam = team || this.getCurrentTeam();
        targetTeam.minerals += amount;
    }

    spendMinerals(amount: number, team?: Team): boolean {
        const targetTeam = team || this.getCurrentTeam();
        if (targetTeam.minerals >= amount) {
            targetTeam.minerals -= amount;
            return true;
        }
        return false;
    }

    // 투사체 관리
    addProjectile(projectile: Projectile): void {
        this.projectiles.push(projectile);
    }

    // 위치 관련
    getCommandCenterPosition(teamIndex: number = 0): Vector2D {
        if (teamIndex >= 0 && teamIndex < this.commandCenters.length) {
            return this.commandCenters[teamIndex].getPosition();
        }
        return { x: 0, y: 0 };
    }

    private setupEventListeners(): void {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    private startGameLoop(): void {
        const gameLoop = (timestamp: number) => {
            // 델타 타임 계산
            if (this.lastUpdateTime === 0) {
                this.lastUpdateTime = timestamp;
            }
            const deltaTime = timestamp - this.lastUpdateTime;
            this.lastUpdateTime = timestamp;

            // 게임 상태 업데이트
            this.update(deltaTime);

            // 화면 그리기
            this.draw();

            // 다음 프레임 요청
            requestAnimationFrame(gameLoop);
        };

        requestAnimationFrame(gameLoop);
    }

    private update(deltaTime: number): void {
        // 건물 업데이트
        this.buildings.forEach(building => building.update());

        // 유닛 업데이트
        this.units.forEach(unit => unit.update());

        // 발사체 업데이트
        this.projectiles = this.projectiles.filter(projectile => {
            projectile.update();
            return !projectile.isDestroyed();
        });

        // 파괴된 유닛 제거
        this.units = this.units.filter(unit => !unit.isDestroyed());

        // 파괴된 건물 제거
        this.buildings = this.buildings.filter(building => !building.isDestroyed());

        // AI 업데이트
        this.aiControllers.forEach(ai => ai.update(deltaTime));
    }

    private handleMouseDown(event: MouseEvent): void {
        const pos = this.getMousePosition(event);
        
        if (event.button === 0) {  // 좌클릭
            this.dragStart = pos;
            this.isDragging = true;

            // UI 클릭 체크
            if (this.productionPanel.isPointInside(pos.x, pos.y)) {
                this.productionPanel.handleClick(pos.x, pos.y);
                return;
            }

            if (this.soundControl.isPointInside(pos.x, pos.y)) {
                this.soundControl.handleMouseDown(pos.x, pos.y);
                return;
            }
        }
    }

    private handleMouseMove(event: MouseEvent): void {
        this.mousePosition = this.getMousePosition(event);
    }

    private handleMouseUp(event: MouseEvent): void {
        const pos = this.getMousePosition(event);

        if (event.button === 0) {  // 좌클릭
            if (this.isDragging && this.dragStart) {
                if (Math.abs(pos.x - this.dragStart.x) > 5 || Math.abs(pos.y - this.dragStart.y) > 5) {
                    // 드래그 선택
                    const left = Math.min(this.dragStart.x, pos.x);
                    const right = Math.max(this.dragStart.x, pos.x);
                    const top = Math.min(this.dragStart.y, pos.y);
                    const bottom = Math.max(this.dragStart.y, pos.y);

                    // 기존 선택 해제
                    this.selectedUnits.forEach(unit => unit.setSelected(false));
                    this.selectedUnits = [];
                    this.selectedBuildings.forEach(building => building.setSelected(false));
                    this.selectedBuildings = [];

                    // 드래그 영역 내의 유닛/건물 선택
                    this.units.forEach(unit => {
                        const unitPos = unit.getPosition();
                        if (unitPos.x >= left && unitPos.x <= right && 
                            unitPos.y >= top && unitPos.y <= bottom) {
                            unit.setSelected(true);
                            this.selectedUnits.push(unit);
                        }
                    });

                    this.buildings.forEach(building => {
                        const buildingPos = building.getPosition();
                        if (buildingPos.x >= left && buildingPos.x <= right && 
                            buildingPos.y >= top && buildingPos.y <= bottom) {
                            building.setSelected(true);
                            this.selectedBuildings.push(building);
                        }
                    });
                } else {
                    // 클릭 선택
                    let clickedSomething = false;

                    // 건물 선택 체크
                    for (const building of this.buildings) {
                        if (building.isPointInside(pos.x, pos.y)) {
                            this.selectedUnits.forEach(unit => unit.setSelected(false));
                            this.selectedUnits = [];
                            this.selectedBuildings.forEach(b => b.setSelected(false));
                            this.selectedBuildings = [building];
                            building.setSelected(true);
                            clickedSomething = true;
                            
                            // 배럭스 선택 시 생산 패널 표시
                            if (building instanceof Barracks) {
                                this.productionPanel.show(building);
                            } else {
                                this.productionPanel.hide();
                            }
                            
                            break;
                        }
                    }

                    // 유닛 선택 체크
                    if (!clickedSomething) {
                        for (const unit of this.units) {
                            if (unit.isPointInside(pos.x, pos.y)) {
                                this.selectedUnits.forEach(u => u.setSelected(false));
                                this.selectedUnits = [unit];
                                this.selectedBuildings.forEach(b => b.setSelected(false));
                                this.selectedBuildings = [];
                                unit.setSelected(true);
                                clickedSomething = true;
                                break;
                            }
                        }
                    }

                    // 아무것도 선택하지 않았다면 모든 선택 해제
                    if (!clickedSomething) {
                        this.selectedUnits.forEach(unit => unit.setSelected(false));
                        this.selectedUnits = [];
                        this.selectedBuildings.forEach(building => building.setSelected(false));
                        this.selectedBuildings = [];
                        this.productionPanel.hide();
                    }
                }
            }
            this.isDragging = false;
            this.dragStart = null;
        } else if (event.button === 2) {  // 우클릭
            // 미네랄 필드 클릭 체크
            const clickedMineralField = this.mineralFields.find(field => 
                field.isPointInside(pos.x, pos.y)
            );

            if (clickedMineralField) {
                this.selectedUnits.forEach(unit => {
                    if (unit instanceof Marine) {
                        unit.setMiningTarget(clickedMineralField);
                    }
                });
            } else {
                // 적 유닛 클릭 체크
                const targetUnit = this.units.find(unit => 
                    !this.selectedUnits.includes(unit) && unit.isPointInside(pos.x, pos.y)
                );
                
                if (targetUnit) {
                    this.selectedUnits.forEach(unit => unit.attackTarget(targetUnit));
                } else {
                    // 이동
                    this.selectedUnits.forEach(unit => unit.moveTo(pos.x, pos.y));
                }
            }
        }
    }

    private getMousePosition(event: MouseEvent): Vector2D {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    private moveSelectedUnits(x: number, y: number): void {
        this.selectedUnits.forEach(unit => unit.moveTo(x, y));
    }

    draw(): void {
        // 배경 지우기
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 그리드 그리기
        this.drawGrid();

        // 미네랄 필드 그리기
        this.mineralFields.forEach(field => field.draw(this.ctx));

        // 건물 그리기
        this.buildings.forEach(building => building.draw(this.ctx));

        // 유닛 그리기
        this.units.forEach(unit => unit.draw(this.ctx));

        // 발사체 그리기
        this.projectiles.forEach(projectile => projectile.draw(this.ctx));

        // 드래그 선택 영역 그리기
        if (this.isDragging && this.dragStart) {
            const currentPos = this.mousePosition;
            this.ctx.strokeStyle = '#00ff00';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(
                this.dragStart.x,
                this.dragStart.y,
                currentPos.x - this.dragStart.x,
                currentPos.y - this.dragStart.y
            );
        }

        // UI 그리기
        this.drawUI();
    }

    private drawUI(): void {
        // 현재 팀의 미네랄만 표시
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Minerals: ${this.getCurrentTeam().minerals}`, 10, 20);

        // 유닛 카운트 표시
        const counts = this.getUnitCounts();
        this.ctx.fillText(`Marines: ${counts.marines}`, 10, 40);
        this.ctx.fillText(`Tanks: ${counts.tanks}`, 10, 60);

        // 생산 패널 그리기
        this.productionPanel.draw(this.ctx);
        
        // 사운드 컨트롤 그리기
        this.soundControl.draw(this.ctx);
    }

    private drawGrid(): void {
        this.ctx.strokeStyle = this.gridColor;
        this.ctx.lineWidth = 1;

        // 수직선
        for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        // 수평선
        for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    isPositionOccupied(pos: Vector2D): boolean {
        const margin = 20;  // 유닛 간 최소 거리

        // 유닛 충돌 체크
        for (const unit of this.units) {
            const unitPos = unit.getPosition();
            const dx = unitPos.x - pos.x;
            const dy = unitPos.y - pos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < margin) {
                return true;
            }
        }

        // 건물 충돌 체크
        for (const building of this.buildings) {
            const buildingPos = building.getPosition();
            const buildingSize = building.getSize();
            if (Math.abs(buildingPos.x - pos.x) < (buildingSize.width/2 + margin) &&
                Math.abs(buildingPos.y - pos.y) < (buildingSize.height/2 + margin)) {
                return true;
            }
        }

        // 미네랄 필드 충돌 체크
        for (const mineralField of this.mineralFields) {
            const mineralPos = mineralField.getPosition();
            const mineralSize = mineralField.getSize();
            if (Math.abs(mineralPos.x - pos.x) < (mineralSize.width/2 + margin) &&
                Math.abs(mineralPos.y - pos.y) < (mineralSize.height/2 + margin)) {
                return true;
            }
        }

        return false;
    }

    private initializeTeams(): void {
        const teamPositions = [
            { x: 200, y: 200 },     // 좌상단
            { x: 1400, y: 200 },    // 우상단
            { x: 200, y: 1000 },    // 좌하단
            { x: 1400, y: 1000 }    // 우하단
        ];

        // 각 팀의 커맨드센터와 배럭스 생성
        for (let i = 0; i < this.teams.length; i++) {
            // 커맨드센터 생성
            const commandCenter = new CommandCenter(this, teamPositions[i].x, teamPositions[i].y, this.teams[i]);
            this.commandCenters.push(commandCenter);
            this.buildings.push(commandCenter);

            // 배럭스 생성 (커맨드센터 오른쪽에)
            const barracks = new Barracks(
                this, 
                teamPositions[i].x + 150, 
                teamPositions[i].y,
                this.teams[i]
            );
            this.buildings.push(barracks);

            // AI 팀이면 AI 컨트롤러 추가
            if (i > 0) {  // 첫 번째 팀(플레이어)을 제외한 나머지
                this.initializeAI(this.teams[i], commandCenter, barracks);
            }
        }
    }

    private initializeAI(team: Team, commandCenter: CommandCenter, barracks: Barracks): void {
        const ai = new AIController(this, team, commandCenter, barracks);
        this.aiControllers.push(ai);
    }

    private initializeMineralFields(): void {
        // 각 팀 근처의 미네랄 필드
        const mineralPositions = [
            // 좌상단 팀 미네랄
            { x: 300, y: 100 },
            { x: 100, y: 300 },
            
            // 우상단 팀 미네랄
            { x: 1300, y: 100 },
            { x: 1500, y: 300 },
            
            // 좌하단 팀 미네랄
            { x: 100, y: 900 },
            { x: 300, y: 1100 },
            
            // 우하단 팀 미네랄
            { x: 1500, y: 900 },
            { x: 1300, y: 1100 },
            
            // 중앙 미네랄
            { x: 800, y: 600 },
            { x: 700, y: 500 },
            { x: 900, y: 500 },
            { x: 700, y: 700 },
            { x: 900, y: 700 }
        ];

        // 미네랄 필드 생성
        for (const pos of mineralPositions) {
            const mineralField = new MineralField(this, pos.x, pos.y);
            this.mineralFields.push(mineralField);
        }
    }

    getUnitCounts(): { marines: number; tanks: number } {
        let marines = 0;
        let tanks = 0;

        for (const unit of this.units) {
            if (unit instanceof Marine) {
                marines++;
            } else if (unit instanceof Tank) {
                tanks++;
            }
        }

        return { marines, tanks };
    }

    getCurrentTeam(): Team {
        return this.teams[0];  // 현재는 첫 번째 팀만 플레이 가능
    }

    getBuildings(): Building[] {
        return this.buildings;
    }

    // ... 나머지 메서드들 ...
}
