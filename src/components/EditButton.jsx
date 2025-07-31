import React from 'react';
import { Button } from './ui/Button';

const EditButton = ({ onClick, disabled = false, children = 'Editar', ...props }) => {
  return (
    <Button 
      variant="warning" 
      onClick={onClick} 
      disabled={disabled}
      {...props}
    >
      {children}
    </Button>
  );
};

export default EditButton;