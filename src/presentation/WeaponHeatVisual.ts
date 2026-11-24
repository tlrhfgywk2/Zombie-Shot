import { Color, MathUtils, type MeshStandardMaterial } from 'three';
import { WEAPON_HEAT_VISUAL } from './presentationConfig';

const { stops, interpolationSpeed, tintColor, emissiveColor, maxEmissiveIntensity } = WEAPON_HEAT_VISUAL;
const maxVisualHeat = stops.at(-1)![0];

export class WeaponHeatVisual {
  private readonly surfaces;
  private readonly glow = new Color(emissiveColor);
  private target = 0;
  private displayed = 0;

  constructor(materials: readonly MeshStandardMaterial[]) {
    this.surfaces = materials.map(material => {
      const { color, emissive, emissiveIntensity } = material;
      // 밝은 슬라이드와 어두운 프레임·손잡이의 대비를 고온에서도 유지한다.
      const brightness = Math.max(color.r, color.g, color.b);
      return {
        material,
        color: color.clone(),
        emissive: emissive.clone(),
        emissiveIntensity,
        tint: new Color(tintColor).multiplyScalar(0.12 + brightness),
        glowStrength: 0.32 + brightness,
      };
    });
  }

  setHeat(heat: number, immediate = false): void {
    this.target = Math.min(heat, maxVisualHeat);
    if (immediate) this.apply(this.target);
  }

  update(deltaSeconds: number): void {
    if (this.displayed === this.target) return;
    const next = MathUtils.damp(this.displayed, this.target, interpolationSpeed, deltaSeconds);
    this.apply(Math.abs(next - this.target) < 0.001 ? this.target : next);
  }

  private apply(heat: number): void {
    this.displayed = heat;
    if (heat === 0) {
      for (const { material, color, emissive, emissiveIntensity } of this.surfaces) {
        material.color.copy(color);
        material.emissive.copy(emissive);
        material.emissiveIntensity = emissiveIntensity;
      }
      return;
    }
    const upper = stops.findIndex(stop => heat <= stop[0]);
    const [lowHeat, lowTint, lowGlow] = stops[upper - 1]!;
    const [highHeat, highTint, highGlow] = stops[upper]!;
    const t = (heat - lowHeat) / (highHeat - lowHeat);
    const tintAmount = MathUtils.lerp(lowTint, highTint, t);
    const glowAmount = MathUtils.lerp(lowGlow, highGlow, t) * maxEmissiveIntensity;
    for (const { material, color, emissive, emissiveIntensity, tint, glowStrength } of this.surfaces) {
      material.color.copy(color).lerp(tint, tintAmount);
      const intensity = glowAmount * glowStrength;
      material.emissive.setRGB(
        emissive.r * emissiveIntensity + this.glow.r * intensity,
        emissive.g * emissiveIntensity + this.glow.g * intensity,
        emissive.b * emissiveIntensity + this.glow.b * intensity,
      );
      material.emissiveIntensity = 1;
    }
  }
}
