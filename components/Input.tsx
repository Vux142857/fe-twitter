import { memo } from "react";

interface InputProps {
  placeholder?: string;
  value?: string;
  type?: string;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  accept?: string;
  multiple?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ placeholder, value, type = "text", onChange, disabled, label, accept, multiple, onKeyDown }) => {
  return (
    <div className="w-full">
      {label && <p className="text-xl text-primary-content font-semibold mb-2">{label}</p>}
      <input
        disabled={disabled}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        type={type}
        accept={accept}
        multiple={multiple}
        className="
            w-full
            p-4 
            text-lg 
            border-2
            border-neutral-800 
            rounded-md
            outline-none
            text-primary-content
            focus:border-secondary
            focus:border-2
            transition
            disabled:bg-neutral-900
            disabled:opacity-70
            disabled:cursor-not-allowed
          "
        onKeyDown={onKeyDown}
      />
    </div>
  );
}

export default memo(Input);