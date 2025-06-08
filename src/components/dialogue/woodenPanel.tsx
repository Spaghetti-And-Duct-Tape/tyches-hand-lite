//Stylesheet
import "./woodenPanel.css";

export default function WoodenPanel({ 
  children
} : {
  children?: React.ReactNode
}) {
  return(
    <div className="wooden-panel-container">
      <div className="wooden-layer">
        <div className="dark-seam">
          <div className="wooden-layer">
            { children }
          </div>
        </div>
      </div>
    </div>
  )
};