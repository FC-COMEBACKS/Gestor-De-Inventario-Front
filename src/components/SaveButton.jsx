import React from 'react';
import { Button } from './ui/Button';

const SaveButton = ({ onClick, disabled = false, children = 'Guardar', ...props }) => {
  return (
    <Button 
      variant="primary" 
      onClick={onClick} 
      disabled={disabled}
      {...props}
    >
      {children}
    </Button>
  );
};

export default SaveButton;