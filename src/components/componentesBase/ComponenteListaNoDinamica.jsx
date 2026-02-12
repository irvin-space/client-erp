import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ComponenteListaNoDinamica = ({ label, etiquetas, onChange, value }) => {

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id={label}>{label}</InputLabel>
        <Select displayEmpty labelId={label} id={label} value={value} label={label} onChange={onChange}>
          {etiquetas.length > 0 ? (
            etiquetas.map((item, index) => {
              return (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              );
            })
          ) : (
            <MenuItem disabled value="">
              <em>Sin opciones disponibles</em>
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ComponenteListaNoDinamica;
