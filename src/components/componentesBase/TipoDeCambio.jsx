import React, { useState, useEffect } from 'react';

//Mui
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

//Componentes propios del proyecto
import ComponenteListaDinamica from './ComponenteLIstaDinamica';

//Componente TipoDeCambio
const TipoDeCambio = ({valorTipoDeCambio}) => {
  return (
    <Box display={'flex'}>
      <ComponenteListaDinamica label="Tipo De Cambio" />
      <TextField value={valorTipoDeCambio} label="" />
    </Box>
  );
};

export default TipoDeCambio;
