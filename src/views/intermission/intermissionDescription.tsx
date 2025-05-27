import WoodenPanel from "../../components/dialogueBox/woodenPanels";

export default function IntermissionDescription({ 
  item 
} : { 
  item?: { 
    name: string;
    description: string;
    effectDescription: string; 
}}) {

  if (!item) return;

  const { name, description, effectDescription } = item;
  
  return (
    <WoodenPanel>
      <div 
        className="inner-content"
      >
        <h2
          style={{
            margin: "5px",
            textAlign: "center"
          }}
        >
          { name }
        </h2>
        <p
          style={{
            margin: "0",
            padding: "10px"
          }}
        >
          { description }
        </p>
        <p
          style={{ 
            margin: "0",
            fontStyle: "italic" 
          }}
        >
          { effectDescription }
        </p>
      </div>
    </WoodenPanel>
  )
}