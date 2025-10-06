import React from 'react';
//MUI
import Typography from '@mui/material/Typography';

//Componente MonedaFormatoMiles
const MonedaFormatoMiles = ({ cantidad = 0, etiquetaHTML, moneda }) => {
  return (
    <Typography
      variant={etiquetaHTML}
    >{`$${cantidad.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${moneda ? moneda : ''}`}</Typography>
  );
};

//Exportar componente MonedaFormatoMiles
export default MonedaFormatoMiles;
