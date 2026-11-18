export interface IterationLabelProps {
  label: string;
  x: number;
  y: number;
  fill: string;
}

export function IterationLabel(props: IterationLabelProps) {
  const { label, x, y, fill } = props;

  // Start + bottom edge of the unrotated text is (x, y). Rotating -90°
  // around that point turns it into the lower-right corner.
  return (
    <text
      x={x}
      y={y}
      fill={fill}
      style={{ fontSize: 'var(--font-size-small)' }}
      textAnchor='start'
      dominantBaseline='text-after-edge'
      transform={`rotate(-90 ${x} ${y})`}
    >
      {label}
    </text>
  );
}
