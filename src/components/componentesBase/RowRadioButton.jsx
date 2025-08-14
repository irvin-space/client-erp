import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function RowRadioButtonsGroup({ titulo, valor1, valor2, valor3, value, onChange }) {
  const handleChange = (event) => {
    console.log(event.target.value)
    console.log(typeof event.target.value)
    onChange(event.target.value);
  
  };

  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">{titulo}</FormLabel>
      <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group" value={value} onChange={handleChange}>
        <FormControlLabel value={valor1} control={<Radio />} label={valor1} />
        <FormControlLabel value={valor2} control={<Radio />} label={valor2} />
        {valor3 && <FormControlLabel value={valor3} control={<Radio />} label={valor3} />}
      </RadioGroup>
    </FormControl>
  );
}
