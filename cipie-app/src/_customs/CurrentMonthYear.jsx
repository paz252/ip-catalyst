import React from 'react';

import Typography from '@mui/material/Typography';

const CurrentMonthYear = ({ variant = 'h6' }) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const monthYear = yesterday.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return <Typography variant={variant}>{monthYear}</Typography>;
};

export default CurrentMonthYear;
