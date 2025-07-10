import { Button, CircularProgress } from '@mui/material';

export default function DefaultButton({ 
  id, text, onClick, isDisabled, isLoading, variant = 'contained' 
}) {
  return (
    <Button
      sx={{m: 2}} 
      id={id} 
      variant={variant} 
      color="primary" 
      onClick={onClick} 
      disabled={isDisabled}
      startIcon={isLoading ? <CircularProgress size={20} color='inherit' /> : null}
      >
      {text}
    </Button>
  );
}
