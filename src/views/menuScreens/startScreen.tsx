import logo from "../../assets/tyche's_hand_logo.png";

export default function StartScreen() {
  return (
    <div 
      className="start-screen-content">
      <div 
        className="logo-container"
        style={{
          opacity: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          style={{ 
            width: "min(40vw, calc(50vh * 16 / 9))" 
          }} 
          src={ logo } 
        />
      </div>
    </div>
  )
};