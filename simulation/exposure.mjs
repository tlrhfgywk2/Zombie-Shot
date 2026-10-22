export function assertFreshOrExactReplay(registry, request) {
  if (!Number.isInteger(request.firstSeed) || !Number.isInteger(request.count) || request.count <= 0 || request.firstSeed < 0 || request.firstSeed + request.count > 2 ** 32) throw new Error('Invalid holdout interval');
  for (const previous of registry) {
    const overlaps = request.firstSeed < previous.firstSeed + previous.count && previous.firstSeed < request.firstSeed + request.count;
    const sameInterval = request.firstSeed === previous.firstSeed && request.count === previous.count;
    const sameSource = request.hash === previous.hash || request.hash === previous.portableHash;
    if (overlaps && !(sameInterval && sameSource)) throw new Error('Holdout interval overlaps exposed seeds; declare a fresh interval or replay the exact frozen evaluation');
  }
}
