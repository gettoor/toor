export interface CandidateBoxConnectionProps {
  fromCandidateId: string;
  fromX: number;
  fromY: number;
  toCandidateId: string;
  toX: number;
  toY: number;
  isHighlighted?: boolean;
}

export function CandidateBoxConnection(props: CandidateBoxConnectionProps) {
  const { fromX, fromY, toX, toY } = props;

  return (
    <path
      d={
        `M ${fromX + 0.5} ${fromY + 0.5} `+
        `C ${fromX + 0.5} ${toY + 0.5}, `+
        `${toX + 0.5} ${fromY + 0.5}, `+
        `${toX + 0.5} ${toY + 0.5}`
      } 
      stroke='var(--stroke)'
      strokeWidth={1}
      fill='none'
      opacity={props.isHighlighted == false ? 0.25 : 1}
    />
  );
}