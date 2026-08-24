export interface PromptBoxConnectionProps {
  fromPromptId: string;
  fromX: number;
  fromY: number;
  toPromptId: string;
  toX: number;
  toY: number;
  isHighlighted?: boolean;
}

export function PromptBoxConnection(props: PromptBoxConnectionProps) {
  const { fromX, fromY, toX, toY } = props;

  return (
    <path
      d={`M ${fromX} ${fromY} C${fromX} ${toY}, ${toX} ${fromY}, ${toX} ${toY}`} 
      stroke='var(--stroke)'
      strokeWidth={1}
      fill='none'
      opacity={props.isHighlighted == false ? 0.25 : 1}
    />
  );
}