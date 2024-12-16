import React from 'react';

type HeadingProps = {
  text: string;
  className?: string;
};

const Heading: React.FC<HeadingProps> = ({ text, className }) => {
  return <h1 className={`text-4xl font-bold ${className}`}>Heading Test</h1>;
};

export default Heading;
