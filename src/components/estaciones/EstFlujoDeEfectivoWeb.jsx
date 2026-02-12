import React, { useState, useEffect } from 'react';

import dayjs from 'dayjs';
import XLSX from 'xlsx-js-style';

//MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

//Componentes propios del sistema
import FirstComponent from '../componentesBase/FirstComponent';
import MuiTablaBase from '../componentesBase/MuiTablaBase';

import useSQL from '@/hooks/useSQL';

//Componente EstFlujoDeEfectivoWeb
const EstFlujoDeEfectivoWeb = () => {
  const [registros, setRegistros] = useState([]);
  const [fechaDesde, setFechaDesde] = useState(dayjs().subtract(1, 'month'));
  const [cleanFechaDesde, setCleanFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState(dayjs());
  const [cleanFechaHasta, setCleanFechaHasta] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCleanFechaDesde(dayjs().subtract(1, 'month').format('YYYYMMDD'));
    setCleanFechaHasta(dayjs().format('YYYYMMDD'));
  }, []);

  const { executeFetch } = useSQL();

  const handleConsultar = async () => {
    setRegistros([]);
    setIsLoading(true);
    console.log('Consultando estFlujoDeEfectivoWeb');
    console.log('Flujo_Efectivo_Space');
    const { success, data } = await executeFetch('Flujo_Efectivo_Space', {
      desdeFecha: `'${cleanFechaDesde}'`,
      hastaFecha: `'${cleanFechaHasta}'`
    });

    console.log(dayjs().format('MM/DD/YYYY'));
    console.log(data);
    if (success) {
      console.log('exito', data);
      const arregloRespuesta = data[0];
      console.log(arregloRespuesta);
      //Agregar unique id a cada elemento
      const cleanArregloRespuesta = arregloRespuesta.map((item, index, arr) => {
        return { ...item, identifier: index };
      });
      console.log('clean', cleanArregloRespuesta);
      setRegistros(cleanArregloRespuesta);
      setIsLoading(false);
    } else {
      console.log('sin exito en la consulta Flujo_Efectivo_Space');
      setIsLoading(false);
    }
  };

  const handleExportarAExcel = () => {
    if (registros.length > 0) {
      console.log('creando archivo excel');
      //generate spreadsheet
      const worksheet = XLSX.utils.json_to_sheet(registros);

      //Apply styles to columns
      Object.keys(worksheet).forEach((cell) => {
        // Skip special keys like !ref, !cols, etc.
        if (cell[0] === '!') return;

        const match = cell.match(/\d+/);
        if (match && match[0] === '1') {
          worksheet[cell].s = {
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '4F81BD' } },
            alignment: { horizontal: 'center' }
          };
        }
      });

      //Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'FlujoDeEfectivo');
      XLSX.writeFile(workbook, 'flujo_efectivo.xlsx');
    } else {
      console.log('No se encuentran registros');
    }
  };

  const handleFechaDesde = (e) => {
    console.log(e.format('YYYY-MM-DD'));
    setFechaDesde(e);
    console.log('formatDesde');
    console.log(typeof e.format('YYYY-MM-DD'));
    console.log(e.format('YYYY-MM-DD').replaceAll('-', ''));
    let cleanFechaDesde = e.format('YYYY-MM-DD').replaceAll('-', '');
    setCleanFechaDesde(cleanFechaDesde);
  };

  const handleFechaHasta = (e) => {
    console.log(e.format('YYYY-MM-DD'));
    setFechaHasta(e);
    console.log('formatHasta');
    console.log(typeof e.format('YYYY-MM-DD'));
    console.log(e.format('YYYY-MM-DD').replaceAll('-', ''));
    let cleanFechaHasta = e.format('YYYY-MM-DD').replaceAll('-', '');
    setCleanFechaHasta(cleanFechaHasta);
  };
  return (
    <Box>
      <Grid sx={{mb:4}} container spacing={2}>
        <Grid>
          <Typography variant="h2">Flujos de Efectivo Web</Typography>
        </Grid>
      </Grid>
      <Grid mb={4} container spacing={2}>
        <Grid size={2}>
          <FirstComponent onChange={(e) => handleFechaDesde(e)} value={fechaDesde} label={'Desde'} />
        </Grid>
        <Grid size={2}>
          <FirstComponent onChange={(e) => handleFechaHasta(e)} value={fechaHasta} label={'Hasta'} />
        </Grid>
        <Grid sx={{ backgroundColor: '' }} size={1.5}>
          <Button
            onClick={() => {
              handleConsultar();
            }}
            variant="contained"
            loading={isLoading}
            fullWidth
          >
            Consultar
          </Button>
        </Grid>
        <Grid sx={{ backgroundColor: '' }} size={2}>
          <Button
            onClick={() => {
              handleExportarAExcel();
            }}
            variant="outlined"
            loading={isLoading}
            fullWidth
          >
            Exportar a Excel
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <MuiTablaBase
          idPropiedad="identifier"
          datos={registros}
          estructuraEncabezados={[
            { propiedad: 'nombre', encabezadoTitulo: 'Nombre' },
            { propiedad: 'importe', encabezadoTitulo: 'Importe',alineamiento:'right', alineamientoEncabezado:'right', formato: 'moneda' },
            { propiedad: 'orden', encabezadoTitulo: 'Orden' }
          ]}
        />
      </Grid>
    </Box>
  );
};

export default EstFlujoDeEfectivoWeb;
