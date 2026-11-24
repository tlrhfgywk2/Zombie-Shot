import { defaultScenario, isRound, lockMagazine, P220, resolveVolley, startEncounter, validScenario } from './rules';
import type { Frame, Round, Scenario, Shot } from './rules';

export class CombatController {
  private scenario: Scenario = { ...defaultScenario };
  state = startEncounter(this.scenario);
  slots: readonly (Round | null)[] = Object.freeze(Array<Round>(P220.capacity).fill('standard'));
  shots: Shot[] = [];
  private generation = 0;
  private timer?: ReturnType<typeof setTimeout>;

  constructor(private readonly onChange: (event?: Frame['kind'] | 'reset') => void) {}

  edit(index: number, round: Round | null): boolean {
    if (this.state.phase !== 'planning' || !Number.isInteger(index) || index < 0 || index >= this.slots.length) return false;
    if (round !== null && !isRound(round)) return false;
    this.slots = Object.freeze(this.slots.map((old, i) => i === index ? round : old));
    this.onChange();
    return true;
  }

  clearMagazine(): boolean {
    if (this.state.phase !== 'planning') return false;
    this.slots = Object.freeze(this.slots.map(() => null));
    this.onChange();
    return true;
  }

  fire(): boolean {
    if (this.state.phase !== 'planning') return false;
    const locked = lockMagazine(this.slots, P220.capacity);
    if (!locked) return false;
    const generation = ++this.generation;
    const volley = resolveVolley(this.state, locked);
    this.state = { ...this.state, phase: 'firing' };
    this.shots = [];
    const advance = () => {
      while (generation === this.generation) {
        const next = volley.next();
        if (next.done) return;
        const event = next.value;
        this.state = event.state;
        if (event.kind === 'shot') this.shots.push(event.shot);
        this.onChange(event.kind);
        if (generation !== this.generation) return;
        // 치명타와 접촉의 종결 판정은 같은 호출에서 끝낸다.
        if ((event.kind === 'shot' && this.state.hp > 0) || (event.kind === 'approach' && this.state.distance > 0)) {
          this.timer = setTimeout(advance, event.kind === 'shot' ? 300 : 500);
          return;
        }
      }
    };
    advance();
    return true;
  }

  reset(scenario: Scenario = this.scenario): boolean {
    if (!validScenario(scenario)) return false;
    ++this.generation;
    clearTimeout(this.timer);
    this.scenario = { ...scenario };
    this.state = startEncounter(scenario);
    this.shots = [];
    this.onChange('reset');
    return true;
  }
}
