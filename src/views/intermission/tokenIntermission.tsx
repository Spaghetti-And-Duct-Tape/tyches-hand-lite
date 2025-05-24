import BloodButton from "../../components/bloodButton/bloodButton";
import WoodenPanel from "../../components/dialogueBox/woodenPanels";
import Token from "../../components/token/token";
import type { CardType } from "../../utils/cards";
import { tokens, type TokenType } from "../../utils/tokens";
import IntermissionDescription from "./intermissionDescription";

export default function TokenIntermission({
  token,
  items, 
  setItem,
} : {
  token: TokenType | undefined;
  items: {
    deck: CardType[];
    token: number | null;
  };
  setItem: (key: string, value: CardType[] | number) => void;
}) {
  
  if (!token) return;

  return (
    <>
      <h2
        style={{ 
          textAlign: "center",
          gridColumn: "1 / span 4" 
        }}
      >
        Tyche's Blessing
      </h2>
      <div
        className="inner-content"
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Token
            token={ token } 
          />
        </div>
      </div>
      <div
        className="intermission-description-container"
      >
        <IntermissionDescription
          item={ token }
        />
      </div>
      <CurrentToken
        currentToken={ tokens[items.token] }
      />
      <div 
        style={{ 
          gridColumn: "2 / span 3",
          display: "flex",
          margin: "10px",
          justifyContent: "space-evenly",
          alignItems: "center"
        }}
      >
        <BloodButton
          action={ () => setItem("token", token.id) }
        >
          Equip
        </BloodButton>
        <BloodButton>
          Discard
        </BloodButton>
      </div>
    </>
  )
};


function CurrentToken({ currentToken } : { currentToken?: TokenType }) {
  if (!currentToken) return;

  return (
    <div
      style={{
        gridColumn: "1 / span 1"
      }}
    >
      <WoodenPanel>
        <div className="inner-content">
          <p
            style={{ 
              margin: "0",
            }}
          >
            Current Token:
          </p> 
          <p
            style={{ 
              margin: "0",
            }}
          >
            { currentToken.name }
          </p>
        </div>
      </WoodenPanel>
    </div>
  )
};