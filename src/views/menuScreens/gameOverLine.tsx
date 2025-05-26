export default function GameOverLine({
  animationDelay,
  gameOverLine
} : {
  animationDelay: number;
  gameOverLine: string;
}) {
  return(
    <li
      className="game-over-line-container"
      style={{
        color: "white",
        display: "flex",
        animationDelay: `${ animationDelay * 5}s`
      }}
    >
      { gameOverLine.split("").map((letter, index) => (
        <span
          key={ index }
          className="loading-text"
          style={{ "--delay": `${ index * 0.3 }s` }}
          data-text={ letter }
        >
          { letter }
        </span>
      ))}
    </li>
  )
};