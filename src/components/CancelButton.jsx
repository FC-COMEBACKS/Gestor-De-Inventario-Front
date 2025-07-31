import React from 'react';
import { Button } from './ui/Button';

const CancelButton = ({ onClick, disabled = false, children = 'Cancelar', ...props }) => {
  return (
    <Button 
      variant="secondary" 
      onClick={onClick} 
      disabled={disabled}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CancelButton;