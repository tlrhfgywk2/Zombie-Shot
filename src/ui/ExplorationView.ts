import type { SpecialAmmoType } from '../data/ammoDefinitions';
export interface ExplorationChoice {
  id: string; label: string; detail: string; disabled?: boolean; ammo?: SpecialAmmoType; amount?: number; badge?: string;
}
export interface ExplorationScreen {
  title: string; description: string; progress: string; awareness: number; tools: readonly string[];
  choices: readonly ExplorationChoice[];
  payment?: { options: readonly { ammo: SpecialAmmoType; count: number }[]; selected?: SpecialAmmoType };
  capacity?: string;
}
