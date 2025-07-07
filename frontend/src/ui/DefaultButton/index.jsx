import { Button } from '@mui/material';

export default function DefaultButton({ id, text, onClick, isDisabled, variant = 'contained' }) {
  return (
    <Button id={id} variant={variant} color="primary" onClick={onClick} disabled={isDisabled}>
      {text}
    </Button>
  );
}
