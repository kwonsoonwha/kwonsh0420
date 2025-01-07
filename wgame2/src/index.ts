import { Game } from './game/Game';
import { Barracks } from './game/buildings/Barracks';
import { Marine } from './game/units/Marine';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    // 캔버스 크기 설정
    canvas.width = 1200;
    canvas.height = 900;

    const game = new Game(canvas);

    // 초기 유닛과 건물 생성
    const barracks = new Barracks(game, 300, 300, game.getCurrentTeam());
    game.addBuilding(barracks);

    const marine = new Marine(game, 200, 200);
    game.addUnit(marine);
});
