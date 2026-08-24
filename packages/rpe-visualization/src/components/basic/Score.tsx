export interface ScoreProps {
  score: number;
}

export function Score(props: ScoreProps) {
  return (
    <span>
      {props.score.toFixed(2)}
    </span>
  );
}