import React, { useState, useEffect } from 'react';

//Mui
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import CircularProgress from '@mui/material/CircularProgress';

//Ant design
import ClearOutlined from '@ant-design/icons/ClearOutlined';
import FileExcelOutlined from '@ant-design/icons/FileExcelOutlined';

//Librerias
import dayjs from 'dayjs';
import XLSX from 'xlsx-js-style';

//Componentes propios del proyect
import ComponenteListaDinamica from '../componentesBase/ComponenteLIstaDinamica';
import BusquedaDeClientes from '../servicios/busqueda-de-clientes';
import FirstComponent from '../componentesBase/FirstComponent';
import RadioButtonsGroup from '../componentesBase/RadioButtonsGroup';

import useSQL from '@/hooks/useSQL';

const FacturasDeClientesEntreFechas = () => {
  //Estados
  // const [openBusquedaClienteFacturaModal, setOpenBusquedaClienteFacturaModal] = useState(false); // Seguimiento del estado del modal de busqueda de clientes factura
  const [openBusquedaClientePedimentoModal, setOpenBusquedaClientePedimentoModal] = useState(false); // Seguimiento del estado del modal de busqueda de clientes pedimento
  const [openBusquedaClienteFacturaModal, setOpenBusquedaClienteFacturaModal] = useState(false); // Seguimiento del estado del modal de busqueda de clientes factura
  const [sucursal, setSucursal] = useState('%');
  const [clienteFactura, setClienteFactura] = useState('');
  const [clienteFacturaFolio, setClienteFacturaFolio] = useState(0);
  const [clienteFacturaTodos, setClienteFacturaTodos] = useState(0);
  const [clientePedimento, setClientePedimento] = useState('');
  const [clientePedimentoFolio, setClientePedimentoFolio] = useState(0);
  const [clientePedimentosTodos, setClientePedimentosTodos] = useState(0);
  // const [fechaDesdeInicial, setFechaDesdeInicial] = useState(dayjs().subtract(1, 'year'));
  const [fechaDesde, setFechaDesde] = useState(dayjs().subtract(1, 'month'));
  const [fechaHasta, setFechaHasta] = useState(dayjs());
  // const [fechaHastaInicial, setFechaHastaInicial] = useState(dayjs());
  const [resumenPorCliente, setResumenPorCliente] = useState(0);
  const [conComentarios, setConComentarios] = useState(0);
  const [soloClientesNuevos, setSoloClientesNuevos] = useState(0);
  const [soloFacturasConSaldo, setSoloFacturasConSaldo] = useState(0);
  const [sinOrdenarPorSucursal, setSinOrdenarPorSucursal] = useState(0);
  const [mostrar, setMostrar] = useState('Todas');
  const [claveMostrar, setClaveMostrar] = useState('0');
  const [expresarEn, setExpresarEn] = useState('Original');
  const [mostrarDistribucionProyectos, setMostrarDistribucionProyectos] = useState(0);
  const [detallarPedimento, setDetallarPedimento] = useState(0);
  const [desgloseDeConceptosDeFacturacion, setDesgloseDeConceptosDeFacturacion] = useState(1);
  const [remisiones, setRemisiones] = useState(0);
  const [supervisorDeOperaciones, setSupervisorDeOperaciones] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { executeFetch } = useSQL();

  const handleSucursalSelected = (value) => {
    console.log('sucursal selected');
    console.log(value);
    setSucursal(value);
  };

  const handleRowSelectClienteFacturacion = (row) => {
    console.log('desde FacturasDeclientesEntreFechas', row);
    setOpenBusquedaClienteFacturaModal(false);
    let folioYNombre = `${row.folio} - ${row.nombre_cliente}`;
    // setSelectedTramite(null);
    // setFolio('');
    // setGastos([]);
    // setIngresos([]);
    setClienteFactura(folioYNombre);
    setClienteFacturaFolio(row.folio);
    setClienteFacturaTodos(0);
  };

  const handleClienteFacturaTodos = (e) => {
    console.log(e.target.checked);
    if (e.target.checked) {
      setClienteFactura('');
      setClienteFacturaFolio(0);
      setClienteFacturaTodos(1);
    }
  };

  const handleRowSelectClientePedimento = (row) => {
    console.log('desde FacturasDeclientesEntreFechas', row);
    setOpenBusquedaClientePedimentoModal(false);
    let folioYNombre = `${row.folio} - ${row.nombre_cliente}`;
    // setSelectedTramite(null);
    // setFolio('');
    // setGastos([]);
    // setIngresos([]);
    setClientePedimento(folioYNombre);
    console.log(row.folio);
    setClientePedimentoFolio(row.folio);
  };

  const handleClientePedimentoTodos = (e) => {
    console.log(e.target.checked);
    if (e.target.checked) {
      setClientePedimento('');
      setClientePedimentoFolio(0);
      setClientePedimentosTodos(1);
    }
  };

  const handleFechaDesde = (e) => {
    console.log(dayjs(e.$d));

    const year = String(e.$y);
    const month = String(e.$M + 1).padStart(2, '0'); // ensures 01–12
    const day = String(e.$D).padStart(2, '0'); // ensures 01–31

    const fecha = `${year}${month}${day}`;

    console.log(fecha);
    setFechaDesde(e);
  };

  const handleFechaHasta = (e) => {
    console.log(dayjs(e.$d));

    const year = String(e.$y);
    const month = String(e.$M + 1).padStart(2, '0'); // ensures 01–12
    const day = String(e.$D).padStart(2, '0'); // ensures 01–31

    const fecha = `${year}${month}${day}`;

    console.log(fecha);
    setFechaHasta(e);
  };

  const handleResumenPorCliente = (e) => {
    console.log(e.target.checked);
    if (e.target.checked) {
      setResumenPorCliente(1);
    }
  };

  const handleConComentarios = (e) => {
    console.log(e.target.checked);
    if (e.target.checked) {
      setConComentarios(1);
    }
  };

  const handleSoloClientesNuevos = (e) => {
    console.log(e.target.checked);
    if (e.target.checked) {
      setSoloClientesNuevos(1);
    }
  };

  const handleSoloFacturasConSaldo = (e) => {
    console.log(e.target.checked);
    if (e.target.checked) {
      setSoloFacturasConSaldo(1);
    }
  };

  const handleSinOrdenarPorSucursal = (e) => {
    console.log(e.target.checked);
    if (e.target.checked) {
      setSinOrdenarPorSucursal(1);
    }
  };

  const handleMostrar = (e) => {
    console.log(e);
    setMostrar(e);
  };

  const handleDato = (e) => { 
    console.log(e.target.value.padStart(4,'0'));

    setClaveMostrar(e.target.value);
    
    
  };

  const handleExpresarEn = (e) => {
    console.log(e);
    setExpresarEn(e);
  };

  const handleMostrarDistribucionProyectos = (e) => {
    console.log();
    if (e.target.checked) {
      setMostrarDistribucionProyectos(1);
    }
  };

  const handleDetallarPedimento = (e) => {
    console.log(e.target.checked);
    if (e.target.checked) {
      setDetallarPedimento(1);
    }
  };

  const handleRemisiones = (e) => {
    console.log(e.target.checked);
    if (e.target.checked) {
      setRemisiones(1);
    }
  };

  const handleSupervisorDeOperaciones = (e) => {
    console.log(e.target.checked);
    if (e.target.checked) {
      setSupervisorDeOperaciones(1);
    }
  };

  const handleExportar = async () => {
    setIsLoading(true);
    // console.log(
    //   executeFetch('Rep_Facturas_Tramites_SPACE7', {
    //     sucursal: "'%'",
    //     cliente: 2186,
    //     todos: 0,
    //     desde: "'20250101'",
    //     hasta: "'20251231'",
    //     resumen: 0,
    //     nuevos: 0,
    //     con_saldo: 0,
    //     sin_sucursal: 0,
    //     moneda: "'Original'",
    //     segmentos: 0,
    //     cliente__pedimento: 0,
    //     cliente_pedimento: 1,
    //     mostrar: "'Todas'",
    //     clave_mostrar: "'0000'",
    //     remisiones: 0,
    //     supervisor: 0
    //   })
    // );

    // const { success, data } = await executeFetch('Rep_Facturas_Tramites_SPACE7', {
    //   sucursal: sucursal == '' ? "'%'" : `"${sucursal}"`,
    //   cliente: 2186,
    //   todos: 0,
    //   desde: "'20250101'",
    //   hasta: "'20251231'",
    //   resumen: 0,
    //   nuevos: 0,
    //   con_saldo: 0,
    //   sin_sucursal: 0,
    //   moneda: "'Original'",
    //   segmentos: 0,
    //   cliente__pedimento: 0,
    //   cliente_pedimento: 1,
    //   mostrar: "'Todas'",
    //   clave_mostrar: "'0000'",
    //   remisiones: 0,
    //   supervisor: 0
    // });

    const { success, data } = await executeFetch('Rep_Facturas_Tramites_SPACE7', {
      sucursal: `"${sucursal}"`,
      cliente: `"${clienteFacturaFolio}"`,
      todos: `"${clienteFacturaTodos}"`,
      desde: `"${fechaDesde.format('YYYYMMDD')}"`,
      hasta: `"${fechaHasta.format('YYYYMMDD')}"`,
      resumen: `"${resumenPorCliente}"`,
      nuevos: `"${soloClientesNuevos}"`,
      con_saldo: `"${soloFacturasConSaldo}"`,
      sin_sucursal: `"${sinOrdenarPorSucursal}"`,
      moneda: `"${expresarEn}"`,
      segmentos: `"${mostrarDistribucionProyectos}"`,
      cliente__pedimento: `"${clientePedimentoFolio}"`,
      cliente_pedimento: `"${clientePedimentosTodos}"`,
      mostrar: `"${mostrar}"`,
      clave_mostrar: `"${claveMostrar.padStart(4,'0')}"`,
      remisiones: `"${remisiones}"`,
      supervisor: `"${supervisorDeOperaciones}"`
    });

    // console.log(success);
    // console.log(data);
    // console.log(useSQL);
    // console.log('Ejecutar');
    // console.log('Sucursal', sucursal);
    // console.log('Cliente Factura folio', clienteFacturaFolio);
    // console.log('Clientes Factura Todos', clienteFacturaTodos);
    // console.log('Cliente Pedimento foliio', clientePedimentoFolio);
    // console.log('Cliente Pedimento Todos', clientePedimentosTodos);
    // console.log('Fecha Desde', fechaDesde.format('YYYYMMDD'));
    // console.log('Fecha Hasta', fechaHasta.format('YYYYMMDD'));
    // console.log('Resumen Por Cliente', resumenPorCliente);
    // console.log('Con Comentarios', conComentarios);
    // console.log('Solo Clientes Nuevos', soloClientesNuevos);
    // console.log('Solo Facturas Con Saldo', soloFacturasConSaldo);
    // console.log('Sin Ordenar Por Sucursal', sinOrdenarPorSucursal);
    // console.log('Mostrar', mostrar);
    console.log('claveMostrar', claveMostrar.padStart(4,"0"));
    // console.log('Expresar en', expresarEn);
    // console.log('Mostrar Distribucion Proyectos', mostrarDistribucionProyectos);
    // console.log('Detallar Pedimento', detallarPedimento);
    // console.log('DesgloseDeConceptosDeFacturacion', desgloseDeConceptosDeFacturacion);
    // console.log('Remisiones', remisiones);
    // console.log('Supervisore de Operaciones', supervisorDeOperaciones);

    console.log(data)

    if (success && data[0].length > 0) {
            setIsLoading(false);
      //generate spreadsheet
      const worksheet = XLSX.utils.json_to_sheet(data[0]);

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
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Facturas');
      XLSX.writeFile(workbook, 'facturas_styled.xlsx');
    }else{
      setIsLoading(false)
    }





    //-----------------------------------------------------------------------
    // !!!! CODIGO DE PRUEBA PARA GENERAR ARCHIVO XLSX DESDE BACKEND !!!
   // Trigger file download 
    // const blob = await response.blob();

    //   const blob = await data.blob()
    //   const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'facturas_styled.xlsx'; // Same filename as before
    // document.body.appendChild(a);
    // a.click();
    // window.URL.revokeObjectURL(url);
    // !!!! CODIGO DE PRUEBA PARA GENERAR ARCHIVO XLSX DESDE BACKEND !!!
    ///-----------------------------------------------------------------------
  };

  return (
    <Paper square={false} elevation={4} sx={{ p: 4, width: { xs: '95vw', lg: '50vw' }, margin: '0 auto' }}>
      <Box sx={{ backgroundColor: '' }}>
        {/* Titulo */}
        <Box component="section">
          <Typography variant="h2">Facturas de Clientes Entre Fechas</Typography>
        </Box>
        <Divider sx={{ marginTop: '1rem', mb: 3 }} />
        {/* Sucursal */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={4}>
            <ComponenteListaDinamica
              label="Sucursal"
              onChange={handleSucursalSelected}
              instruccionSQL="combo_sucursales"
              // value={selectedTramite?.sucursal ? selectedTramite?.sucursal : sucursal}
              value={sucursal}
              valueKey="sucursal"
              extraOption="*Todos*"
              labelKey="nombre_sucursal"
              retornaObjeto={false}
              parametros={{
                '@cCentro': "'      1'"
              }}
              // lEditando={!lEditando}
            />
          </Grid>
        </Grid>
        {/* Cliente Factura,Cliente Pedimento */}
        <Grid container spacing={2} sx={{ mb: 10 }}>
          <Grid size={6}>
            <BusquedaDeClientes
              open={openBusquedaClienteFacturaModal}
              onClose={() => setOpenBusquedaClienteFacturaModal(false)}
              onOpen={() => setOpenBusquedaClienteFacturaModal(true)}
              onSelectedRow={handleRowSelectClienteFacturacion}
              // value={
              //   selectedTramite?.cteFacturacion
              //     ? `${selectedTramite?.id_cliente_factura} - ${selectedTramite.cteFacturacion}`
              //     : selectedTramite?.nombre_cliente_factura
              //       ? `${selectedTramite?.cliente_factura} - ${selectedTramite?.nombre_cliente_factura}`
              //       : clienteFolioFacturacion != ''
              //         ? clienteFolioFacturacion
              //         : ''
              // }
              value={clienteFactura}
              // editando={!lEditando}
              label="Cliente - Factura"
            />
            <FormGroup row>
              {/* <FormControlLabel control={<Checkbox defaultChecked />} label="Resumen por Cliente" /> */}
              <FormControlLabel
                control={<Checkbox checked={clienteFacturaFolio == 0} onChange={(e) => handleClienteFacturaTodos(e)} />}
                label="Todos"
              />
            </FormGroup>
          </Grid>
          <Grid size={6}>
            <BusquedaDeClientes
              open={openBusquedaClientePedimentoModal}
              onClose={() => setOpenBusquedaClientePedimentoModal(false)}
              onOpen={() => setOpenBusquedaClientePedimentoModal(true)}
              onSelectedRow={handleRowSelectClientePedimento}
              // value={
              //   selectedTramite?.cteFacturacion
              //     ? `${selectedTramite?.id_cliente_factura} - ${selectedTramite.cteFacturacion}`
              //     : selectedTramite?.nombre_cliente_factura
              //       ? `${selectedTramite?.cliente_factura} - ${selectedTramite?.nombre_cliente_factura}`
              //       : clienteFolioFacturacion != ''
              //         ? clienteFolioFacturacion
              //         : ''
              // }
              value={clientePedimento}
              // editando={!lEditando}
              label="Cliente - Pedimento"
              //
              //
              //
              //
            />
            <FormGroup row>
              {/* <FormControlLabel control={<Checkbox defaultChecked />} label="Resumen por Cliente" /> */}
              <FormControlLabel
                control={<Checkbox checked={clientePedimentoFolio == 0} onChange={(e) => handleClientePedimentoTodos(e)} />}
                label="Todos"
              />
            </FormGroup>
          </Grid>
        </Grid>
        {/* Desde, Hasta */}
        <Grid container spacing={2} sx={{ mb: 6 }} justifyContent={'center'}>
          <Grid size={4}>
            {/* <Typography variant="h4">Desde</Typography> */}
            <FirstComponent value={fechaDesde} onChange={(e) => handleFechaDesde(e)} label={'Desde'} />
          </Grid>
          <Grid size={4}>
            {/* <Typography variant="h4">Hasta</Typography> */}
            <FirstComponent value={fechaHasta} onChange={(e) => handleFechaHasta(e)} label={'Hasta'} />
          </Grid>
        </Grid>
        {/* Resumen por Cliente, con Comentarios, Solo Clientes Nuevos, Solo Facturas Con Saldo, Sin Ordenar por Sucursal  */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={6}>
            <FormGroup sx={{ justifyContent: 'center' }}>
              {/* <FormControlLabel control={<Checkbox defaultChecked />} label="Resumen por Cliente" /> */}
              <FormControlLabel control={<Checkbox onChange={(e) => handleResumenPorCliente(e)} />} label="Resumen por Cliente" />
              {/* <FormControlLabel required control={<Checkbox />} label="Con Comentarios" /> */}
              <FormControlLabel control={<Checkbox onChange={(e) => handleConComentarios(e)} />} label="Con Comentarios" />
              {/* <FormControlLabel disabled control={<Checkbox />} label="Solo Clientes Nuevos" /> */}
              <FormControlLabel control={<Checkbox onChange={(e) => handleSoloClientesNuevos(e)} />} label="Solo Clientes Nuevos" />
              <FormControlLabel control={<Checkbox onChange={(e) => handleSoloFacturasConSaldo(e)} />} label="Solo Facturas Con Saldo" />
              <FormControlLabel control={<Checkbox onChange={(e) => handleSinOrdenarPorSucursal(e)} />} label="Sin Ordenar por Sucursal" />
            </FormGroup>
          </Grid>
          <Grid size={3}>
            <RadioButtonsGroup
              onChange={(e) => handleMostrar(e)}
              label={'Mostrar'}
              values={['Todas', 'Por Aduana', 'Por Patente']}
              direction={'column'}
            />
          </Grid>
          <Grid size={2} alignItems={'center'}>
            <TextField label="Clave" value={claveMostrar} onChange={(e) => handleDato(e)}></TextField>
          </Grid>
        </Grid>
        {/* Mostrar */}
        <Grid container spacing={2} sx={{ mb: 4 }} justifyContent={'center'}>
          <Grid size={6}>
            <FormGroup sx={{ justifyContent: 'center' }}>
              {/* <FormControlLabel control={<Checkbox defaultChecked />} label="Resumen por Cliente" /> */}
              <FormControlLabel
                control={<Checkbox onChange={(e) => handleMostrarDistribucionProyectos(e)} />}
                label="Mostrar Distribución Proyectos"
              />
              {/* <FormControlLabel required control={<Checkbox />} label="Con Comentarios" /> */}
              <FormControlLabel control={<Checkbox onChange={(e) => handleDetallarPedimento(e)} />} label="Detallar Pedimento" />
              {/* <FormControlLabel disabled control={<Checkbox />} label="Solo Clientes Nuevos" /> */}
              <FormControlLabel disabled control={<Checkbox defaultChecked />} label="Desglose de Conceptos de Facturación" />
              <FormControlLabel control={<Checkbox onChange={(e) => handleRemisiones(e)} />} label="Remisiones" />
              <FormControlLabel
                control={<Checkbox onChange={(e) => handleSupervisorDeOperaciones(e)} />}
                label="Supervisor de Operaciones"
              />
            </FormGroup>
          </Grid>
          <Grid size={6} sx={{ backgroundColor: '' }}>
            <RadioButtonsGroup
              onChange={(e) => handleExpresarEn(e)}
              label={'Expresar en'}
              values={['Original', 'USCY', 'MXP']}
              direction={'column'}
            />
          </Grid>
        </Grid>
        {/* Salida del Reporte, Aceptar, Cancelar */}
        {/* <Grid container spacing={2}>
        <Grid size={2}>
          <ComponenteListaDinamica
            label="Salida del Reporte"
            // onChange={handleSucursalSelected}
            instruccionSQL="combo_sucursales"
            // value={selectedTramite?.sucursal ? selectedTramite?.sucursal : sucursal}
            valueKey="sucursal"
            labelKey="nombre_sucursal"
            retornaObjeto={false}
            parametros={{
              '@cCentro': "'      1'"
            }}
            // lEditando={!lEditando}
          />
        </Grid>
      </Grid> */}
        {/* Boton */}
        <Grid container spacing={2} justifyContent={'center'}>
          <Grid size={4}>
            {/* <Button variant="contained">Aceptar</Button>
          <Button variant="outlined">Cancelar</Button> */}
            <Button
              loading={isLoading}
              loadingPosition="start"
              startIcon={<FileExcelOutlined style={{ fontSize: 'large' }} />}
              variant="contained"
              onClick={handleExportar}
              fullWidth
            >
              Descargar Archivo
            </Button>
          </Grid>
          {/* <Grid size={4}> */}
          {/* <Button variant="contained">Aceptar</Button>
          <Button variant="outlined">Cancelar</Button> */}
          {/* <Button disabled startIcon={<ClearOutlined style={{ fontSize: 'large' }} />} variant="outlined">
              Limpiar Formulario
            </Button>
          </Grid> */}
        </Grid>
      </Box>
    </Paper>
  );
};

export default FacturasDeClientesEntreFechas;
