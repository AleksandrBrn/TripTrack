import React from 'react';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';

const DownloadButton = ({ 
  text = "скачать",
  onClick,
  isDisabled, 
}) => {
  return (
    <Button
      variant="outline"
      color="primary"
      startIcon={<DownloadIcon />}
      onClick={onClick}
      disabled={isDisabled}
      sx={{
        width: 30,
        height: 30, 
        mt: 2,
        mb: 2,
      }}
    >
      {/* {text} */}
    </Button>
  );
};

export default DownloadButton;