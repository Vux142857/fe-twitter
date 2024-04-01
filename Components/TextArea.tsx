import { memo } from "react";

interface TextArea {
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
  accept?: string;
}

const Input: React.FC<TextArea> = ({ placeholder, value, onChange, disabled, label }) => {
  return (
    <div className="w-full">
      {label && <p className="text-xl text-primary-content font-semibold mb-2">{label}</p>}
      <textarea
        disabled={disabled}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
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
      />
    </div>
  );
}

export default memo(Input);