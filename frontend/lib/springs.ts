/**
 * Spring presets — Apple Design spec (WWDC 2018 Fluid Interfaces)
 * bounce: damping ratio (0 = critically damped/no overshoot, 0.5 = bouncy)
 * duration: response time in seconds — NOT a fixed duration, spring settles naturally
 */
export const SPRINGS = {
  /** Default UI — critically damped, no overshoot */
  default:    { type: 'spring' as const, bounce: 0,    duration: 0.35 },
  /** Snappy micro-interactions */
  snappy:     { type: 'spring' as const, bounce: 0,    duration: 0.22 },
  /** Modal / sheet — slight bounce because it emerges from a tap */
  sheet:      { type: 'spring' as const, bounce: 0.15, duration: 0.4  },
  /** Momentum-driven flick release — visible bounce because a flick preceded it */
  momentum:   { type: 'spring' as const, bounce: 0.22, duration: 0.4  },
  /** Drawer vertical slide */
  drawer:     { type: 'spring' as const, bounce: 0.12, duration: 0.35 },
  /** Tab indicator / checkmark */
  micro:      { type: 'spring' as const, bounce: 0,    duration: 0.18 },
} as const;

/**
 * Rubber-band boundary resistance (Apple's formula).
 * Apply when the user drags past an edge: the further past the bound,
 * the less the element follows — reads as "responsive, but there's nothing more here."
 */
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

/**
 * Project where a flick will land using exponential decay — Apple's exact algorithm.
 * Pick the nearest snap point from the *projected* endpoint, not the release point.
 */
export function projectMomentum(velocityPxPerS: number, decelerationRate = 0.998): number {
  return (velocityPxPerS / 1000) * decelerationRate / (1 - decelerationRate);
}
