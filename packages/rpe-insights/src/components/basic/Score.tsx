export interface ScoreProps {
  score: number;
}

export function Score(props: ScoreProps) {
  return (
    <span>
      <b>{props.score.toFixed(2)}</b>
    </span>
  );
}