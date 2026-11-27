// The reference motion decelerates with two exponential rates after its initial acceleration.
export function dampedEase(duration, slow, fast) {
  const travel = (seconds) => 1 - (fast * Math.exp(-slow * seconds) - slow * Math.exp(-fast * seconds)) / (fast - slow)
  const settled = travel(duration)
  return (progress) => travel(duration * progress) / settled
}
