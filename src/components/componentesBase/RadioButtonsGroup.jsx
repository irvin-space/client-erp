import React, { useState } from 'react';

//MUI Components
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

//RadioButtonsGroup component
const RadioButtonsGroup = ({ label, values, direction, onChange, value }) => {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value); // pass the value back up
    }
  };

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <RadioGroup row={direction === 'row'} value={value} onChange={handleChange}>
        {values.map((item, index) => {
          return <FormControlLabel key={index} value={item} control={<Radio />} label={item} />;
        })}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioButtonsGroup;
