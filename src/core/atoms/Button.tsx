import React from 'react';

type ButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({ label, variant = 'primary', onClick }) => {
  const buttonStyles =
    variant === 'primary'
      ? 'bg-blue-500 px-4 py-2 rounded'
      : 'border border-white px-4 py-2 rounded';

  return (
    <button className={buttonStyles} onClick={onClick}>
        Ravi Button Ravi
    </button>
  );
};

export default Button;
