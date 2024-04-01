interface ButtonProps {
    label: string;
    secondary?: boolean;
    fullWidth?: boolean;
    large?: boolean;
    onClick?: any;
    disabled?: boolean;
    outline?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    label,
    secondary,
    fullWidth,
    onClick,
    large,
    disabled,
    outline
}) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`
          disabled:opacity-70
          disabled:cursor-not-allowed
          rounded-full
          font-semibold
          hover:opacity-80
          transition
          border-2
          ${fullWidth ? 'w-full' : 'w-fit'}
          ${secondary ? 'bg-secondary text-secondary-content border-black' : 'bg-primary text-primary-content border-primary-content'}
          ${large ? 'text-xl px-5 py-3' : 'text-md px-4 py-2'}
          ${outline ? 'bg-transparent' : ''}
          ${outline ? 'border-primary' : ''}
          ${outline ? 'text-primary-content' : ''}
        `}
        >
            {label}
        </button>
    );
}

export default Button;