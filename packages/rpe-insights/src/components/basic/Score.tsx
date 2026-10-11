export interface ScoreProps {
  score: number;
  className?: string;
}

export function Score(props: ScoreProps) {
  return (
    <span className={props.className}>
      <b>{props.score.toFixed(2)}</b>
    </span>
  );
}