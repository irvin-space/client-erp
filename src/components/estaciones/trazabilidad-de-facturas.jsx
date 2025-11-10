import React, { useState } from 'react';

//React Router
import { useNavigate } from 'react-router';

//MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import useAuth from '../../hooks/useAuth';

//Componentes propios del proyecto
import DataTable from '../../components/componentesBase/DataTable3';
import ComponenteListaDinamica from '../../components/componentesBase/ComponenteListaDinamica';
import BusquedaDeClientes from '../servicios/busqueda-de-clientes';
import FirstComponent from '../../components/componentesBase/FirstComponent';
import MuiTablaBase from '../componentesBase/MuiTablaBase';

import dayjs from 'dayjs';

import useSQL from '../../hooks/useSQL';

//Componente
const TrazabilidadDeFacturas = () => {
  const { user } = useAuth();
  console.log(user);

  const STORAGE_KEY = 'trazabilidadPagosFiltros';
  const savedState = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false); // Cargando
  const [sucursal, setSucursal] = useState(savedState.sucursal || user?.sucursal || '');
  const [openBusquedaClientePedimentoModal, setOpenBusquedaClientePedimentoModal] = useState(false); // Seguimiento del estado del modal de busqueda de clientes factura
  const [clienteFolioPedimento, setClienteFolioPedimento] = useState(null);
  const [nombreDeCliente, setNombreDeCliente] = useState('');
  const [numeroDeCliente, setNumeroDeCliente] = useState(null);
  //const [arregloDeConsulta, setArregloDeConsulta] = useState([]);
  const [arregloDeConsulta, setArregloDeConsulta] = useState(savedState.arregloDeConsulta || []);

  const [desdeFecha, setDesdeFecha] = useState(savedState.desdeFecha ? dayjs(savedState.desdeFecha) : dayjs().subtract(1, 'month'));
  const [hastaFecha, setHastaFecha] = useState(savedState.hastaFecha ? dayjs(savedState.hastaFecha) : dayjs());

  console.log(dayjs());

  const [columnaSucursal, setColumnaSucursal] = useState(null);

  const { executeFetch } = useSQL();

  // Guarda valores de filtrado en sessionStorage
  const saveToSessionStorage = () => {
    const stateToSave = {
      sucursal,
      desdeFecha: desdeFecha?.format('YYYY-MM-DD HH:mm:ss'),
      hastaFecha: hastaFecha?.format('YYYY-MM-DD HH:mm:ss'),
      arregloDeConsulta, // <--- LÍNEA AGREGADA
      // clienteFolioPedimento,
      // nombreDeCliente,
      // numeroDeCliente,
      // arregloDeConsulta,
      // columnaSucursal,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  };

  React.useEffect(() => {
    saveToSessionStorage();
  }, [
    sucursal,
    desdeFecha,
    hastaFecha,
    arregloDeConsulta
    // clienteFolioPedimento,
    // nombreDeCliente,
    // numeroDeCliente,
    // arregloDeConsulta,
    // columnaSucursal,
  ]);

  const handleSucursalSelected = (value, objeto) => {
    // if (value == '%') {
    //   setColumnaSucursal({ field: 'sucursal', headerName: 'Sucursal', flex: 1, height: 500 });
    // } else {
    //   setColumnaSucursal(null);
    // }
    setSucursal(value);
  };

  const handleRowSelectClientePedimento = (row) => {
    setOpenBusquedaClientePedimentoModal(false);
    let folioYNombre = `${row.folio} - ${row.nombre_cliente}`;
    let nombreDeCliente = row.nombre_cliente;
    let numeroDeCliente = row.cliente;
    // setSelectedTramite(null);
    // setFolio('');
    // setGastos([]);
    // setIngresos([]);
    // console.log('Esta es el numero de cliente:', row.cliente);
    setClienteFolioPedimento(folioYNombre);
    setNombreDeCliente(folioYNombre);
    setNumeroDeCliente(numeroDeCliente);
  };

  const handleAplicarFiltros = async () => {
    setIsLoading(true);
    let numeroCliente = numeroDeCliente;
    if (!numeroDeCliente) {
      numeroCliente = 0;
    }

    const objetoParametros = {
      '@cSucursal': sucursal == 'Todos' ? "'%'" : `'${sucursal}'`,
      '@nCliente': numeroCliente,
      '@dFecha1': `'${desdeFecha.format('YYYY-MM-DD').replaceAll('-', '')}'`,
      '@dFecha2': `'${hastaFecha.format('YYYY-MM-DD').replaceAll('-', '')}'`
    };

    const { data, success } = await executeFetch('Trazabilidad_Pagos_Facturas', objetoParametros);

    if (success) {
      console.log('facturaS', data[0]);
      //   setArregloDeConsulta(data[0]);
      setArregloDeConsulta(data[0]);
    }
    setIsLoading(false);
  };

  const handleReiniciarValores = () => {
    setSucursal(user?.sucursal || '');
    setNombreDeCliente('');
    setNumeroDeCliente(null);
    setDesdeFecha(dayjs().subtract(1, 'month'));
    setHastaFecha(dayjs());
    setArregloDeConsulta([]);
  };

  const handleRowSelect = (rowInfo) => {
    // navigate('/dashboard-trazabilidad-facturas', { state: { rowInfo } });
    console.log("esto se envia desde trazabilidad")
    console.log("rowInfo desde trazabilidad de facturas",rowInfo)
    navigate('/dashboard-trazabilidad-facturas', { state: { rowInfo } });
  };

  return (
    <Box>
      <Box sx={{ marginBottom: '16px' /*, backgroundColor: 'white'*/ }}>
        <Typography sx={{ verticalAlign: 'baseline' }} variant="h2">
          Trazabilidad de Facturas
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <Grid sx={{ backgroundColor: '', display: 'flex', alignItems: 'end' }} container spacing={3}>
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
            {/* Clientes */}
            <Grid sx={{ height: '60%' }} size={{ xs: 12, md: 3, lg: 4 }}>
              <Box sx={{ height: '100%', display: 'flex' }}>
                {/* <TextField
                  sx={{ width: '80%' }}
                  id="standard-basic"
                  label="Cliente"
                  variant="standard"
                  value={nombreDeCliente ? nombreDeCliente : ''}
                /> */}
                <BusquedaDeClientes
                  open={openBusquedaClientePedimentoModal}
                  onClose={() => setOpenBusquedaClientePedimentoModal(false)}
                  onOpen={() => setOpenBusquedaClientePedimentoModal(true)}
                  onSelectedRow={handleRowSelectClientePedimento}
                  value={nombreDeCliente ? nombreDeCliente : ''}
                />
              </Box>
            </Grid>
            {/* Fecha Desde */}
            <Grid size={{ xs: 12, md: 2, lg: 2 }}>
              <Typography variant="subtitle2">Desde</Typography>
              <FirstComponent value={desdeFecha} onChange={setDesdeFecha} />
            </Grid>
            {/* Fecha Hasta */}
            <Grid size={{ xs: 12, md: 2, lg: 2 }}>
              <Typography variant="subtitle2">Hasta</Typography>
              <FirstComponent value={hastaFecha} onChange={setHastaFecha} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* Tabla */}
      <Box sx={{ width: '100', marginTop: '16px', height: '60vh', overflowX: 'auto' }}>
        <MuiTablaBase
          seleccionable={true}
          idPropiedad={'factura'}
          datos={arregloDeConsulta}
          onSelectRow={handleRowSelect}
          filtro='true'
          estructuraEncabezados={[
            { propiedad: 'nombre_tipo', encabezadoTitulo: 'Tipo' },
            { propiedad: 'sucursal', encabezadoTitulo: 'Sucursal' },
            { propiedad: 'cliente', encabezadoTitulo: 'Cliente' },
            { propiedad: 'factura', encabezadoTitulo: 'Factura' },
            { propiedad: 'fiscal', encabezadoTitulo: 'Fiscal' },
            { propiedad: 'fecha_factura', encabezadoTitulo: 'Fecha Factura' },
            { propiedad: 'total', encabezadoTitulo: 'Total', formato: 'moneda' },
            { propiedad: 'importe_gasto_tramite', encabezadoTitulo: 'I.Gasto Tramite',formato:'moneda' },
            { propiedad: 'saldo_actual', encabezadoTitulo: 'Saldo Actual' },
            { propiedad: 'moneda', encabezadoTitulo: 'Moneda' },
            { propiedad: 'poliza', encabezadoTitulo: 'Poliza' },
            { propiedad: 'numero_exportada', encabezadoTitulo: 'Num. Exportada' },
            { propiedad: 'fecha_exportada', encabezadoTitulo: 'Fecha Exportada' },
            { propiedad: 'estado_actual', encabezadoTitulo: 'Estado Actual' }
          ]}
        />
        {/* <DataTable rowsArray={arregloDeConsulta} onSelectRow={handleRowSelect} sucursalColumna={columnaSucursal} /> */}
      </Box>
      <br />
      {/* Botones Aplicar,Reinicar */}
      <Box sx={{ display: 'flex', justifyContent: 'l' }}>
        <Button
          sx={{ marginRight: '8px' }}
          variant="contained"
          onClick={handleAplicarFiltros}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          Consultar
        </Button>
        <Button variant="outlined" onClick={handleReiniciarValores}>
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};

export default TrazabilidadDeFacturas;
