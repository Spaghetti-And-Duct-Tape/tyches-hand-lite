import WoodenPanel from "./woodenPanels";

export default function DialogueBox({
  line,
  isVisible
}: {
  line: string;
  isVisible: boolean;
}) {
  return (
    <div 
      className="dialogue-container "
      style={{
        zIndex: 2,
        opacity: isVisible ? "1" : 0,
        position: "absolute",
        width: "fit-content",
        top: "40%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <WoodenPanel>
        <div className="dialogue-content">
          <p 
            key={ line } 
            className="dialogue-line"
          >
            { line }
          </p>
        </div>
      </WoodenPanel>
    </div>
  )
}