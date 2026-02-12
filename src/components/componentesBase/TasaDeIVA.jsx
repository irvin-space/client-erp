import React, { useState, useEffect } from 'react';

//MUI
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid'

//Componentes propios del proyecto
import ComponenteListaDinamica from './ComponenteLIstaDinamica';

//TasaDeIVA Component
const TasaDeIVA = ({onChange,textFieldValue,optionValue,gridSpacing=2}) => {
  return (
    <Grid container spacing={gridSpacing}>
    {/* <Box sx={{ backgroundColor: 'lightblue', display:'flex', width: '100%' }}>
      <Box sx={{backgroundColor:'orange', width:'80%'}}> */}
        <Grid size={6}>
            <ComponenteListaDinamica
          labelKey={'tasa_iva'}
          valueKey={'folio'}
          instruccionSQL={'Combo_Tasas_Ivas'}
          parametros={{ otros: 1, activos: 1 }}
          label="Tasa de Iva %"
          onChange={onChange}
          value={optionValue}
        />
        </Grid>
      {/* </Box>
      <Box> */}
        <Grid size={6}>
        <TextField value={textFieldValue} id="outlined-basic" label="Otro %" variant="outlined" />
        </Grid>
      {/* </Box>
    </Box> */}
    </Grid>
  );
};

//Export TasaDeIVA Component
export default TasaDeIVA;
