import { defaultScenario, isRound, lockMagazine, P220, resolveVolley, startEncounter, validScenario } from './rules';
import type { EchoHit, Frame, Round, Scenario, Shot } from './rules';
import { traceControllerCombat, traceTransition, traceTurn } from './analysis/trace';
import type { CombatTraceSink } from './analysis/trace';

export class CombatController {
  private scenario: Scenario = { ...defaultScenario };
  state = startEncounter(this.scenario);
  slots: readonly (Round | null)[] = Object.freeze(Array<Round>(P220.capacity).fill('standard'));
  shots: Shot[] = [];
  echoes: EchoHit[] = [];
  private generation = 0;
  private timer?: ReturnType<typeof setTimeout>;
  private trace?: ReturnType<typeof traceControllerCombat>;
  private tracedTurn = 0;

  constructor(private readonly onChange: (event?: Frame['kind'] | 'reset') => void,
    private readonly createTrace?: () => CombatTraceSink) {}

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
    if (this.createTrace) {
      this.trace ??= traceControllerCombat(this.createTrace());
      this.tracedTurn = this.state.turns + 1;
    }
    const volley = resolveVolley(this.state, locked, this.trace);
    this.state = { ...this.state, phase: 'firing' };
    this.shots = [];
    this.echoes = [];
    const advance = () => {
      while (generation === this.generation) {
        const next = volley.next();
        if (next.done) return;
        const event = next.value;
        this.state = event.state;
        if (event.kind === 'shot') this.shots.push(event.shot);
        if (event.kind === 'echo') this.echoes.push(event.echo);
        this.onChange(event.kind);
        if (generation !== this.generation) return;
        // 치명타와 접촉의 종결 판정은 같은 호출에서 끝낸다.
        if (((event.kind === 'shot' || event.kind === 'echo') && this.state.hp > 0) || (event.kind === 'approach' && this.state.distance > 0)) {
          this.timer = setTimeout(advance, event.kind === 'approach' ? 500 : 300);
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
    const next = startEncounter(scenario);
    if (this.trace) {
      this.trace.cancelPending();
      traceTransition(traceTurn(this.trace, this.tracedTurn), 'reset', this.state, next);
      this.trace = undefined;
    }
    this.state = next;
    this.shots = [];
    this.echoes = [];
    this.onChange('reset');
    return true;
  }
}
