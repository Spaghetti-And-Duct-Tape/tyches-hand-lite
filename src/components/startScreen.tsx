import logo from "../assets/tyche's_hand_logo.png"

export default function StartScreen() {
  return (
    <div className="start-screen-content">
      <div className="logo-container">
        <img
          style={{ width: "50vw" }} 
          src={ logo } 
        />
      </div>
    </div>
  )
};