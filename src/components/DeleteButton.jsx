import React from 'react';
import { Button } from './ui/Button';

const DeleteButton = ({ onClick, disabled = false, children = 'Eliminar', ...props }) => {
  return (
    <Button 
      variant="danger" 
      onClick={onClick} 
      disabled={disabled}
      {...props}
    >
      {children}
    </Button>
  );
};

export default DeleteButton;