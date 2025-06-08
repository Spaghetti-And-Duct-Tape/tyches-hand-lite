import WoodenPanel from "../../components/dialogue/woodenPanel";

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
        style={{
          width: "100%"
        }}
        className="inner-content intermission-description"
      >
        <h2
          style={{
            margin: "0",
            textAlign: "center"
          }}
        >
          { name }
        </h2>
        <p
          style={{
            margin: "0",
            fontStyle: "italic",
            padding: "10px"
          }}
        >
          { effectDescription }
        </p>
        <p
          style={{ 
            margin: "0",
          }}
        >
          { description }
        </p>
      </div>
    </WoodenPanel>
  )
}