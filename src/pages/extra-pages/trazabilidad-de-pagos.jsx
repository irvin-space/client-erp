import React, { useState } from 'react';

//MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import useAuth from '../../hooks/useAuth';

//Componentes propios del proyecto
import DataTable from '../../components/componentesBase/DataTable3';
import ComponenteListaDinamica from '../../components/componentesBase/ComponenteListaDinamica';
import BusquedaDeClientes from '../../components/estaciones/busqueda-de-clientes';
import FirstComponent from '../../components/componentesBase/FirstComponent';
// import

import dayjs from 'dayjs';

import useSQL from '../../hooks/useSQL';

//Componente
const TrazabilidadDePagos = () => {
  const [sucursal, setSucursal] = useState(useAuth().user?.sucursal || '');
  console.log(useAuth());

  const [openBusquedaClientePedimentoModal, setOpenBusquedaClientePedimentoModal] = useState(false); // Seguimiento del estado del modal de busqueda de clientes factura
  const [clienteFolioPedimento, setClienteFolioPedimento] = useState(null);
  const [nombreDeCliente, setNombreDeCliente] = useState('');
  const [numeroDeCliente, setNumeroDeCliente] = useState(null);
  const [arregloDeConsulta, setArregloDeConsulta] = useState([]);

  const [desdeFecha, setDesdeFecha] = useState(dayjs().subtract(1, 'month'));
  const [hastaFecha, setHastaFecha] = useState(dayjs());

  const { executeFetch } = useSQL();

  const handleSucursalSelected = (value, objeto) => {
    console.log('Sucursal seleccionada:', value);
    setSucursal(value);
  };

  const handleRowSelectClientePedimento = (row) => {
    console.log('est-camb-ad', row);
    setOpenBusquedaClientePedimentoModal(false);
    let folioYNombre = `${row.folio} - ${row.nombre_cliente}`;
    let nombreDeCliente = row.nombre_cliente;
    let numeroDeCliente = row.cliente;
    // setSelectedTramite(null);
    // setFolio('');
    // setGastos([]);
    // setIngresos([]);
    console.log('Esta es el numero de cliente:', row.cliente);
    setClienteFolioPedimento(folioYNombre);
    setNombreDeCliente(nombreDeCliente);
    setNumeroDeCliente(numeroDeCliente);
  };

  const handleAplicarFiltros = async () => {
    console.log('Aplicar filtros...');
    console.log('sucursal', sucursal);
    // console.log("Cliente",clienteFolioPedimento)
    console.log('Numero de cliente', numeroDeCliente);
    console.log(!!numeroDeCliente);
    let numeroCliente = numeroDeCliente;
    if (!numeroDeCliente) {
      console.log('a');
      numeroCliente = 0;
      console.log(numeroCliente);
    }
    console.log('Desde Fecha', desdeFecha);
    console.log('Desde Fecha', desdeFecha.format('YYYY-MM-DD').replaceAll('-', ''));
    console.log('Hasta Fecha', hastaFecha.format('YYYY-MM-DD').replaceAll('-', ''));

    const objetoParametros = {
      '@cSucursal': sucursal == 'Todos' ? "'%'" : `'${sucursal}'`,
      '@nCliente': numeroCliente,
      '@dFecha1': `'${desdeFecha.format('YYYY-MM-DD').replaceAll('-', '')}'`,
      '@dFecha2': `'${hastaFecha.format('YYYY-MM-DD').replaceAll('-', '')}'`
    };

    const { data, success } = await executeFetch('Trazabilidad_Pagos', objetoParametros);
    console.log(success);
    console.log(data);
    if (success) {
      setArregloDeConsulta(data);
    }
  };

  return (
    <Box>
      <Box sx={{ marginBottom: '16px', backgroundColor: 'white' }}>
        <Typography sx={{ verticalAlign: 'baseline' }} variant="h2">
          Trazabilidad de Pagos
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid sx={{ backgroundColor: { xs: 'lightcoral', md: 'lightgrey', lg: 'white' } }} size={{ xs: 12, md: 12, lg: 12 }}>
          <Grid sx={{ height: '100%', backgroundColor: '', display: 'flex', alignItems: 'end' }} container spacing={3}>
            <Grid size={{ md: 1, lg: 1 }}>
              <Typography variant="h4" sx={{}}>
                Filtros
              </Typography>
            </Grid>
            {/* Sucursales */}
            <Grid sx={{ height: '60%' }} size={{ xs: 12, md: 2, lg: 2 }}>
              <ComponenteListaDinamica
                label="Sucursal"
                onChange={handleSucursalSelected}
                instruccionSQL={'combo_sucursales'}
                parametros={{
                  '@cCentro': "'      1'"
                }}
                valueKey="sucursal"
                labelKey="nombre_sucursal"
                value={sucursal}
                extraOption="Todos"
              />
            </Grid>
            <Grid sx={{ height: '60%' }} size={{ xs: 12, md: 3, lg: 3 }}>
              <Box sx={{ height: '100%', display: 'flex' }}>
                <TextField
                  sx={{ width: '80%' }}
                  id="standard-basic"
                  label="Cliente"
                  variant="standard"
                  value={nombreDeCliente ? nombreDeCliente : ''}
                />
                <BusquedaDeClientes
                  open={openBusquedaClientePedimentoModal}
                  onClose={() => setOpenBusquedaClientePedimentoModal(false)}
                  onOpen={() => setOpenBusquedaClientePedimentoModal(true)}
                  onSelectedRow={handleRowSelectClientePedimento}
                  //
                  //
                  //
                  //
                />
              </Box>
            </Grid>
            {/* Fecha Desde */}
            <Grid size={{ md: 2, lg: 2 }}>
              <Typography variant="subtitle2">Desde</Typography>
              <FirstComponent value={desdeFecha} onChange={setDesdeFecha} />
            </Grid>
            {/* Fecha Hasta */}
            <Grid size={{ md: 2, lg: 2 }}>
              <Typography variant="subtitle2">Hasta</Typography>
              <FirstComponent value={hastaFecha} onChange={setHastaFecha} />
            </Grid>
            {/* Botones Aplicar,Reinicar */}
            <Grid sx={{ display: 'flex', justifyContent: 'space-evenly' }} size={{ md: 2, lg: 2 }}>
              <Button variant="outlined">Reiniciar</Button>
              <Button variant="contained" onClick={handleAplicarFiltros}>
                Aplicar
              </Button>
            </Grid>
          </Grid>
        </Grid>
        {/* Tabla */}
        <Grid
          sx={{ marginTop: '16px', height: '65vh', backgroundColor: { xs: 'lightcoral', md: 'lightgrey', lg: 'lightblue' } }}
          size={{ xs: 12, md: 12, lg: 12 }}
        >
          <DataTable rowsArray={arregloDeConsulta} />
        </Grid>
        {/* <Grid sx={{ backgroundColor: { xs: 'lightcoral', md: 'lightgrey', lg: 'white' } }} size={{ xs: 12, md: 8, lg: 12 }}>
          <p>Lorem Ipsum</p>
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default TrazabilidadDePagos;
