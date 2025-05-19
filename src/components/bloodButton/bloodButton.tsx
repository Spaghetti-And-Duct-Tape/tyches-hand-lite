import './bloodButton.css';

interface BloodButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType?: "button" | "submit" | "reset";
  action?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export default function BloodButton({
  buttonType = "button",
  action = () => {},
  disabled = false,
  children,
  ...props
}: BloodButtonProps) {
  return (
    <button 
      type={ buttonType }
      onClick={ action }
      className="blood-button"
      disabled={ disabled }
      { ...props }
    >
      { children }
    </button>
  );
}
