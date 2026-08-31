import './style.css';
import { Game } from './core/Game';

const root = document.querySelector<HTMLDivElement>('#app');
if (!root) throw new Error('게임 루트 요소를 찾을 수 없습니다.');
new Game(root);
