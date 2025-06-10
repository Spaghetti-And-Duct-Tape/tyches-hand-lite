import WoodenPanel from "../dialogue/woodenPanel";
import "./hoverBox.css"

export default function HoverBox({
  name = null,
  description = null,
  isFlipped = false,
  children
} : {
  name?: string | null;
  description?: string | null;
  isFlipped?: boolean;
  children: React.ReactNode
}) {

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block"
      }} 
      className="hover-container"
    >
      <div 
        className="hover-item"
      >
        { children }
      </div>
      <div 
        style={{
          position: "absolute",
          color: "white"
        }}
        className={ `hover-box ${ isFlipped ? "hide-hover-box" : "" }` }
      >
        <WoodenPanel>
          <h3
            style={{
              textAlign: "center",
              padding: "5px 0"
            }}
            className="inner-content hover-name"
          >
            { name }
          </h3>
          { description &&
            <p
              style={{ 
                textAlign: "center"
              }}
              className="inner-content hover-description"
            >
              { description }
            </p>
          }
        </WoodenPanel>
      </div>
    </div>
  )
};