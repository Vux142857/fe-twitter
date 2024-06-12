import React, { useState, useEffect } from 'react';

interface TypingEffectProps {
  text: string
}

const TypingEffect: React.FC<TypingEffectProps> = (typingProps: TypingEffectProps) => {
  const textToType = typingProps.text
  const [displayedText, setDisplayedText] = useState(textToType[0]);
  let index = 0;

  useEffect(() => {
    const typingInterval = setInterval(() => {
      index++;
      setDisplayedText((displayedText) => displayedText + textToType[index]);
      if (index == textToType.length - 1) {
        clearInterval(typingInterval);
      }
    }, 150); // Thời gian delay giữa mỗi ký tự, có thể điều chỉnh

    return () => {
      clearInterval(typingInterval);
    };
  }, [textToType]);

  return (
    <div className="typing-effect-container">
      <span>{displayedText}</span>
    </div>
  );
};

export default TypingEffect;
