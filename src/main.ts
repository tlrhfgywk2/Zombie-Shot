import './style.css';
import { mountCombat } from './prototype/CombatView';

const root = document.querySelector<HTMLDivElement>('#app');
if (!root) throw new Error('게임 루트 요소를 찾을 수 없습니다.');
mountCombat(root);
