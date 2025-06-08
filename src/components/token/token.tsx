import type { TokenType } from "../../utils/token";
import "./token.css";

export default function Token({
  token
} : { 
  token?: TokenType
}) {
  if (!token) return;

  const { rune, effect } = token;

  return (
    <div className={ `token ${ effect }` }>
      <div className="outer-ring" />
      <div className="colored-layer">
        <svg viewBox="0 0 120 120" className="text-ring">
          <defs>
            <path id="circlePath" d="M 60, 60
              m -30, 0
              a 30,30 0 1,1 60,0
              a 30,30 0 1,1 -60,0"
            />
          </defs>
          <text className="gold-text">
            <textPath xlinkHref="#circlePath">Τύχης Χείρ • Τύχης Χείρ • Τύχης Χείρ • </textPath>
          </text>
        </svg>
      </div>
      <div className="gold-separator"/>
      <div className="inner-core">
        <span className="rune">{ rune }</span>
      </div>
    </div>
  )
};