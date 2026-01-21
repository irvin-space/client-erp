import React, { useState, useEffect } from 'react';

//MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

//Componentes del proyecto
import useAuth from '@/hooks/useAuth';
import BusquedaTramitesAduanales from '../servicios/busqueda-tramites-aduanales';
import FirstComponent from '../componentesBase/FirstComponent';
import ComponenteListaDinamica from '../componentesBase/ComponenteLIstaDinamica';
import MuiTablaBase from '../componentesBase/MuiTablaBase';
import RowRadioButtonsGroup from '../componentesBase/RowRadioButton';
import BusquedaDeClientes from '../servicios/busqueda-de-clientes';
import { mensajes } from '@/utils/mensajes';
import dayjs from 'dayjs';
import ChequeDePagoDeImpuestos from '../componentesBase/ChequeDePagoDeImpuestos';
import ComplementoDeTramitesAduanales from '../componentesBase/ComplementoDeTramitesAduanales';
import ModificarClienteFact from '../componentesBase/ModificarClienteFact';
import CargaDePedimentos from '../componentesBase/CargaDePedimentos';
import PermitirModificar from '../componentesBase/PermitirModificar';
import PermitirQuitarConcepto from '../componentesBase/PermitirQuitarConcepto';
import MostrarDocumentos from '../componentesBase/MostrarDocumentos';
import AgregarConcepto from '../componentesBase/AgregarConcepto';
import VerFactura from '../componentesBase/VerFactura';
import VerChequeDeGastos from '../componentesBase/VerChequeDeGastos';

//Ant Design Iconos
import { DownOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';

//Componente est_tramites_aduanales
const EstTramitesAduanales = () => {
  //Estados
  const [sucursal, setSucursal] = useState(useAuth().user?.sucursal || '');
  const [openModal, setOpenModal] = useState(false);
  const [abrirBusquedaClientePedimentoModal, setAbrirBusquedaClientePedimentoModal] = useState(false);

  const [impuestosPagados, setImpuestosPagados] = useState(false);
  const [folioDeTramiteAConsultar, setFolioDeTramiteAConsultar] = useState('');
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState('');
  const [numeroDePedimentoFormateado, setNumeroDePedimentoFormateado] = useState(null);
  const [formaPago, setFormaPago] = useState('');
  const [clavePedimento, setClavePedimento] = useState('');
  const [clienteFolioPedimento, setClienteFolioPedimento] = useState('');
  const [clienteFolioFacturacion, setClineteFolioFacturacion] = useState('');
  const [chequera, setChequera] = useState('');
  const [ingresos, setIngresos] = useState('');
  const [gastos, setGastos] = useState('');
  const [arregloGastosIngresos, setArregloGastosIngresos] = useState([]);

  const [editando, setEditando] = useState(null);
  const [datosCargados, setDatosCargados] = useState(false);
  const [crearTramiteManual, setCrearTramiteManual] = useState(false);

  const [tramiteManualPrecintos, setTramiteManualPrecintos] = useState(0);
  const [tramiteManualPedimentoTipo, settramiteManualPedimentoTipo] = useState('Importación');
  const [tramiteManualNumeroDePedimento, settramiteManualNumeroDePedimento] = useState('');

  const formatearNumeroDePedimento = (numeroDePedimento) => {
    console.log('tipo de dato', typeof numeroDePedimento);
    const stringNumeroDePedimentoSinFormatear = String(numeroDePedimento); //'25073066 5024852'
    const primeraParte = stringNumeroDePedimentoSinFormatear.substring(0, 2);
    const segundaParte = stringNumeroDePedimentoSinFormatear.substring(2, 4);
    const terceraParte = stringNumeroDePedimentoSinFormatear.substring(4, 8);
    const cuartaParte = stringNumeroDePedimentoSinFormatear.slice(8);

    const stringNumeroDePedimentoFormateado = `${primeraParte}-${segundaParte}-${terceraParte}-${cuartaParte}`;
    console.log(stringNumeroDePedimentoFormateado);
    setNumeroDePedimentoFormateado(stringNumeroDePedimentoFormateado);
  };

  useEffect(() => {
    console.log('me monte o actualice');
    console.log(tramiteSeleccionado);
  }, [tramiteSeleccionado]);

  const handleVerChequeDeImpuestos = () => {
    console.log('Click, ver cheque de impuestos');
  };
  // Callback: hace el llamado cuando la fila a sido seleccionada en la tabla de busqueda de...
  const handleRowSelect = (row, o) => {
    console.log('Row selected in parent:', row);
    console.log(row.clave);
    console.log('find the forma pago', row);
    if (row.forma_pago === 'Propio') {
      setFormaPago('Transferencia de Cuenta');
    } else if (row.forma_pago === 'Cliente') {
      setFormaPago('Cheque');
    }
    // console.log(setClave(row.clave))
    setTramiteSeleccionado(row);
    if (row.tramite > 0) {
      setFolioDeTramiteAConsultar(row.tramite);
    }
    console.log('history debajo');
    if (row.history && row.history.length > 0) {
      console.log('history');
      console.log(row.history);
      const arregloIngresos = [];
      const arregloGastos = [];
      for (let i = 0; i < row.history.length; i++) {
        console.log('a');
        console.log(row.history[i].naturaleza);
        if (row.history[i].naturaleza == 'Ingresos') {
          console.log('hubo un ingreso');
          arregloIngresos.push(row.history[i]);
          setIngresos(arregloIngresos);
        }
        if (row.history[i].naturaleza == 'Gastos') {
          console.log('hubo gastos');
          arregloGastos.push(row.history[i]);
          setGastos(arregloGastos);
        }
      }
      console.log(arregloIngresos);
      console.log(arregloGastos);
    }

    formatearNumeroDePedimento(row.pedimento[0]);
    //Si un tramite es seleccionado por medio del componente busqueda-tramites-aduanales
    //se habilita el boton Guardar, se habilita el boton Cancelar, se deshabilita el boton Iniciar
    // setEsHabilitadoGuardar(true);
    // setEsHabilitadoCancelar(true);
    // setEsHabilitadoIniciar(false);

    setOpenModal(false); // Cerrar modal
  };

  const handleFetch = async (parametros) => {
    try {
      const response = await fetch(import.meta.env.VITE_URL_ENVIRONMENT + '/dinamico/lista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruccionSQL: 'Trae_Tramite_Aduanal',
          parametros: parametros
        })
      });

      const data = await response.json();
      console.log('debajo esta el resultado del sp del tramite X');
      console.log(data);
      console.log(data[0][0]);

      // --- Lógica agregada para verificar si hay registros ---
      if (data[0] && data[0].length === 0) {
        // Si el primer array está vacío, muestra una alerta.
        {
          mensajes('aviso', 'Consulta Realizada');
        } // este es sweetalert2
      }

      const FormaPago = data[0][0].forma_pago.trim();

      if (FormaPago === 'Propio') {
        setFormaPago('Transferencia de Cuenta');
      } else if (FormaPago === 'Cliente') {
        setFormaPago('Cheque');
      }

      //   setSelectedTramite(data[0][0]);
      setTramiteSeleccionado(data[0][0]);
      console.log('data 1 arreglo', data[1]);
      setIngresos(data[1]);
      console.log('data 2 arreglo', data[2]);
      setGastos(data[2]);
      formatearNumeroDePedimento(data[0][0].pedimento);


      setDatosCargados(true)

      //   setGastos(data[2]);
      // setSegundoArreglo(data[1]);
    } catch (error) {
      console.log(error);
    } finally {
      // setIsLoading(false); //Terminar de cargar
      console.log('Done');
    }
  };

  const handleFolio = (e) => {
    console.log('handle folio', e);
    // setFolioDeTramiteAConsultar(e.target.value);

    if (folioDeTramiteAConsultar) {
      setTramiteSeleccionado(null);
      setIngresos(null);
      setGastos(null);
      setEditando(false);
      setNumeroDePedimentoFormateado(null);
    }
    setFolioDeTramiteAConsultar(e.target.value);
  };

  const handleTeclaEnter = async (e) => {
    console.log('handle tecla enter', e);
    if (e.key === 'Enter') {
      console.log('final value', folioDeTramiteAConsultar);
      setCrearTramiteManual(true)
      await handleFetch(folioDeTramiteAConsultar);
    }
  };

  const handleSeleccionDeFilaClientePedimento = (row) => {
    console.log('est-camb-ad', row);
    setAbrirBusquedaClientePedimentoModal(false);
    let folioYNombre = `${row.folio} - ${row.nombre_cliente}`;
    setTramiteSeleccionado(null);
    setFolioDeTramiteAConsultar('');
    setGastos([]);
    setIngresos([]);
    setClienteFolioPedimento(folioYNombre);
  };

  const handleVerFactura = () => {
    console.log('click, ver factura');
  };

  const handlePermitirQuitarConcepto = () => {
    console.log('click, permitir quitar concepto');
  };

  const handlePermitirModificar = () => {
    console.log('click, permitir modificar');
  };

  const handleCargarPedimentos = () => {
    console.log('click, cargar pedimentos');
  };

  const handleCargarCotizacion = () => {
    console.log('click, cargar cotizacion');
  };

  const handleComplementarTramite = () => {
    console.log('click, complementar tramite');
  };

  const handleModificarClienteFac = () => {
    console.log('click, modificar cliente fac.');
  };

  const handleMostrarDocumentos = () => {
    console.log('click, mostrar documentos');
  };

  const handleIniciar = () => {
    console.log('click, iniciar');
    //setEditando(true)
    setCrearTramiteManual(true);
  };

  const handleGuardar = () => {
    console.log('Click, guardar');
  };

  const handleCancelar = () => {
    console.log('Click, cancelar');
    // setEditando(false);
    setCrearTramiteManual(false);
    setFolioDeTramiteAConsultar('');
    setNumeroDePedimentoFormateado(null)
    setTramiteSeleccionado(null);
    setIngresos(null);
    setGastos(null);
  };

  const handlePagoDeImpuestos = () => {
    console.log('Click, pago de impuestos');
  };

  const handleVerChequeDeGastos = () => {
    console.log('Click, ver cheque de gastos');
  };

  const handleClaveSelected = (value, objeto) => {
    console.log('valueclave', value);
    console.log('objetodeclave', objeto);
    setClavePedimento(value);
  };

  //Funciones que al precionar boton de iniciar permite editar ciertos cammpos
  const handleSucursalSelected = (value, objeto) => {
    console.log('Sucursal seleccionada:', value);
    setSucursal(value);
  };

  const handleTramiteManualPrecintos = (e) => {
    console.log('changing value', e.target.value);
    setTramiteManualPrecintos(e.target.value);
  };

  const handleEditandoPedimentoTipo = (e) => {
    console.log('editando tipo de pedimento ', e);
    setEditandoPedimentoTipo(e);
  };

  const handleEditandoNumeroDePedimento = (e) => {
    console.log('editando numero de pedimento', e.target.value);
    setEditandoNumeroDePedimento(e.target.value);
  };

  return (
    <Box sx={{ backgroundColor: '' }}>
      {/* Titulo */}
      <Box component="section">
        <Typography variant="h2">Trámites Aduanales</Typography>
      </Box>
      <Divider sx={{ marginTop: '1rem' }} />
      {tramiteSeleccionado?.impuestos_pagados && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Typography variant={'h3'} sx={{ color: 'red' }}>
              Impuestos Pagados
            </Typography>

            {/* <Button sx={{ mx: 2 }} onClick={handleVerChequeDeImpuestos} variant="contained" startIcon={<EyeOutlined />}>
              Ver Cheque de Impuestos
            </Button> */}

            <ChequeDePagoDeImpuestos tramite={folioDeTramiteAConsultar} />
          </Box>
        </>
      )}

      {/* Tramite, Sucursal, Fecha, Precintos, F.Facturacion, T.Cambio, Impuestos Pagados, Ver Cheque de Impuestos */}
      <Box sx={{ display: 'flex', justifyContent: 'center', backgroundColor: '', marginTop: '1rem' }}>
        <Grid sx={{ width: '100%', backgroundColor: '' }} container spacing={2}>
          {/* Busqueda de tramites aduanales */}
          <Grid size={3} sx={{ backgroundColor: '' }}>
            {tramiteSeleccionado?.tramite_aduana ? (
              <BusquedaTramitesAduanales
                onSelectRow={handleRowSelect}
                open={openModal}
                onClose={() => {
                  document.activeElement?.blur();
                  setOpenModal(false);
                }}
                onOpen={() => setOpenModal(true)}
                editando={false}
                onChange={(e) => handleFolio(e)}
                onKeyDown={(e) => handleTeclaEnter(e)}
                value={tramiteSeleccionado?.tramite_aduana ? tramiteSeleccionado?.tramite_aduana : folioDeTramiteAConsultar}
              />
            ) : (
              <BusquedaTramitesAduanales
                onSelectRow={handleRowSelect}
                open={openModal}
                onClose={() => {
                  document.activeElement?.blur();
                  setOpenModal(false);
                }}
                onOpen={() => setOpenModal(true)}
                editando={crearTramiteManual}
                onChange={(e) => handleFolio(e)}
                onKeyDown={(e) => handleTeclaEnter(e)}
                value={tramiteSeleccionado?.tramite ? tramiteSeleccionado?.tramite : folioDeTramiteAConsultar}
              />
            )}
          </Grid>
          {/* Fecha */}
          <Grid size={3} sx={{ backgroundColor: '' }}>
            <FirstComponent value={dayjs(tramiteSeleccionado?.fecha)} label="Fecha" />
          </Grid>
          {/* F.Facturacion */}
          <Grid size={3} sx={{ backgroundColor: '' }}>
            <FirstComponent value={dayjs(tramiteSeleccionado?.fecha_facturacion)} label={'Fecha Facturación'} />
          </Grid>
          {/* Aviso: Impuestos Pagados Propuesta2 */}
          <Grid size={3} sx={{ backgroundColor: '' }}>
            {/* <Typography component={'h3'} sx={{ color: 'red' }}>
              Impuestos Pagados
            </Typography>
            <Button variant="outlined">Ver Cheque de Impuestos</Button> */}
          </Grid>
          {/* Sucursal */}
          <Grid size={3} sx={{ backgroundColor: '' }}>
            <ComponenteListaDinamica
              label="Sucursal"
              onChange={handleSucursalSelected}
              instruccionSQL="combo_sucursales"
              value={tramiteSeleccionado?.sucursal ? tramiteSeleccionado.sucursal : sucursal}
              valueKey="sucursal"
              labelKey="nombre_sucursal"
              retornaObjeto={false}
              parametros={{
                '@cCentro': "'      1'"
              }}
              // lEditando={true}
            />
          </Grid>
          {/* Precintos */}
          <Grid size={3} sx={{ backgroundColor: '' }}>
            <TextField
              fullWidth
              //value={tramiteSeleccionado?.precintos || tramiteSeleccionado?.precintos == 0 ? tramiteSeleccionado.precintos : ''}
              // value={
              //   tramiteSeleccionado?.precintos || tramiteSeleccionado?.precintos == 0
              //     ? tramiteSeleccionado.precintos
              //     : tramiteSeleccionado?.precintos[0] || tramiteSeleccionado?.precintos[0] == 0
              //       ? tramiteSeleccionado.precintos[0]
              //       : ''
              // }
              value={
                crearTramiteManual
                  ? tramiteManualPrecintos
                  : tramiteSeleccionado?.precintos !== undefined && tramiteSeleccionado?.precintos !== null
                    ? Array.isArray(tramiteSeleccionado.precintos)
                      ? (tramiteSeleccionado.precintos[0] ?? '')
                      : tramiteSeleccionado.precintos
                    : ''
              }
              label={'Precintos'}
              type="number"
              onChange={crearTramiteManual ? (e) => handleTramiteManualPrecintos(e) : null}
            />
          </Grid>
          {/* Tipo de cambio */}
          <Grid size={3} sx={{ backgroundColor: '' }}>
            <TextField
              fullWidth
              value={tramiteSeleccionado?.tipo_cambio ? tramiteSeleccionado.tipo_cambio : ''}
              placeholder="0.00"
              label={'Tipo de Cambio'}
              type="number"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Pedimento/Cliente */}
      <Box sx={{ marginY: '1rem' }}>
        <Accordion>
          <AccordionSummary expandIcon={<DownOutlined />}>
            <Typography variant="h5">Pedimento/Cliente</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Grid container spacing={4}>
              {/* Pedimento */}
              <Grid size={6}>
                <Grid container spacing={1}>
                  <Grid size={12}>
                    {/* Titulo aqui */}
                    <Typography variant="h4">Pedimento</Typography>
                  </Grid>
                  <Grid size={12}>
                    {/* Radio group aqui */}
                    <Grid container spacing={1}>
                      <Grid size={6} sx={{ backgroundColor: '' }}>
                        {/* <RowRadioButtonsGroup titulo="Tipo" valor1="Importación" valor2="Exportación" /> */}
                        <RowRadioButtonsGroup
                          onChange={editando ? (e) => handleEditandoPedimentoTipo(e) : null}
                          titulo="Tipo"
                          valor1="Importación"
                          valor2="Exportación"
                          value={
                            editando
                              ? editandoPedimentoTipo
                              : tramiteSeleccionado
                                ? tramiteSeleccionado.tipo?.startsWith('I')
                                  ? 'Importación'
                                  : tramiteSeleccionado.tipo_pedimento?.startsWith('I')
                                    ? 'Importación'
                                    : 'Exportación'
                                : null
                          }
                        />
                      </Grid>
                      <Grid size={6} sx={{ backgroundColor: '' }}>
                        <ComponenteListaDinamica
                          label="Clave"
                          //onChange={setClave}
                          onChange={editando ? handleClaveSelected : null}
                          //onChange={() => console.log('click1')}
                          instruccionSQL="SELECT DISTINCT nombre_clave, clave_pedimento FROM Claves_Pedimentos ORDER BY nombre_clave"
                          value={tramiteSeleccionado?.clave_pedimento ? tramiteSeleccionado?.clave_pedimento : clavePedimento}
                          valueKey="clave_pedimento"
                          labelKey="nombre_clave"
                          // disabled={true}
                          lEditando={!editando}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid size={12}>
                    <Grid container spacing={3}>
                      <Grid size={6} sx={{ backgroundColor: '' }}>
                        {/* Numero de pedimento */}
                        <TextField
                          fullWidth
                          id="standard-basic"
                          label="Número de pedimento"
                          variant="standard"
                          // value={tramiteSeleccionado?.pedimento ? tramiteSeleccionado.pedimento : ''}
                          // value={tramiteSeleccionado?.pedimento.length > 0 ? tramiteSeleccionado.pedimento[0] : ''}
                          onChange={crearTramiteManual ? (e) => handleEditandoNumeroDePedimento(e) : null}
                          value={
                            Array.isArray(tramiteSeleccionado?.pedimento)
                              ? numeroDePedimentoFormateado
                              : numeroDePedimentoFormateado
                                ? numeroDePedimentoFormateado
                                : ''
                          }
                          //disabled={editando}
                        />
                      </Grid>
                      <Grid size={6} sx={{ backgroundColor: '' }}>
                        <RowRadioButtonsGroup
                          titulo="Cargo"
                          valor1="Con Cargo"
                          valor2="Sin Cargo"
                          value={tramiteSeleccionado ? (tramiteSeleccionado?.con_cargo == true ? 'Con Cargo' : 'Sin Cargo') : null}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={6}>
                {/* Cliente */}
                <Grid container spacing={1}>
                  <Grid size={12}>
                    {/* Titulo aqui */}
                    <Typography variant="h4">Cliente</Typography>
                  </Grid>
                  <Grid size={12}>
                    {/* Radio group aqui */}
                    <Grid container spacing={2}>
                      <Grid size={12} sx={{ backgroundColor: '' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                          {/* <TextField
                            id="standard-basic"
                            label="Cliente - Pedimento"
                            variant="standard"
                            value={
                              selectedTramite?.ctePedimento
                                ? `${selectedTramite?.id_cliente_pedimento}-${selectedTramite.ctePedimento}`
                                : selectedTramite?.nombre_cliente_pedimento
                                  ? `${selectedTramite?.cliente_pedimento} - ${selectedTramite?.nombre_cliente_pedimento}`
                                  : clienteFolioPedimento != ''
                                    ? clienteFolioPedimento
                                    : ''
                           selectedTramite }
                            fullWidth
                          /> */}

                          <BusquedaDeClientes
                            open={abrirBusquedaClientePedimentoModal}
                            onClose={() => setAbrirBusquedaClientePedimentoModal(false)}
                            onOpen={() => setAbrirBusquedaClientePedimentoModal(true)}
                            onSelectedRow={handleSeleccionDeFilaClientePedimento}
                            value={
                              tramiteSeleccionado?.ctePedimento
                                ? `${tramiteSeleccionado?.id_cliente_pedimento}-${tramiteSeleccionado.ctePedimento}`
                                : tramiteSeleccionado?.nombre_cliente_pedimento
                                  ? `${tramiteSeleccionado?.cliente_pedimento} - ${tramiteSeleccionado?.nombre_cliente_pedimento}`
                                  : clienteFolioPedimento != ''
                                    ? clienteFolioPedimento
                                    : ''
                            }
                            // editando={!lEditando}
                            label="Cliente - Pedimento"
                            //
                            //
                            //
                            //
                          />
                          {/* <BusquedaTramitesAduanales
                            onSelectRow={handleRowSelect}
                            open={openModal}
                            onClose={() => setOpenModal(false)}
                            onOpen={() => setOpenModal(true)}
                          /> */}
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid size={12}>
                    {/* Pedimento y cargo aqui */}
                    <Grid container spacing={2}>
                      <Grid size={12} sx={{ backgroundColor: '' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                          {/* <TextField
                            id="standard-multiline-flexible"
                            label="Cliente - Facturación"
                            multiline
                            maxRows={2}
                            variant="standard"
                            value={
                              selectedTramite?.cteFacturacion
                                ? `${selectedTramite?.id_cliente_factura} - ${selectedTramite.cteFacturacion}`
                                : selectedTramite?.nombre_cliente_factura
                                  ? `${selectedTramite?.cliente_factura} - ${selectedTramite?.nombre_cliente_factura}`
                                  : clienteFolioFacturacion != ''
                                    ? clienteFolioFacturacion
                                    : ''
                            }
                            fullWidth
                          /> */}

                          {/* <Button variant="outlined" sx={{ height: '100%' }}>
                            <SearchOutlined style={{ fontSize: '1.5em', color: '#00345D' }} />
                          </Button> */}

                          <BusquedaDeClientes
                            // open={openBusquedaClienteFacturaModal}
                            //open={abrirBusquedaClienteFacturaModal}
                            onClose={() => setOpenBusquedaClienteFacturaModal(false)}
                            onOpen={() => setOpenBusquedaClienteFacturaModal(true)}
                            // onSelectedRow={handleRowSelectClienteFacturacion}
                            value={
                              tramiteSeleccionado?.cteFacturacion
                                ? `${tramiteSeleccionado?.id_cliente_factura} - ${tramiteSeleccionado.cteFacturacion}`
                                : tramiteSeleccionado?.nombre_cliente_factura
                                  ? `${tramiteSeleccionado?.cliente_factura} - ${tramiteSeleccionado?.nombre_cliente_factura}`
                                  : clienteFolioFacturacion != ''
                                    ? clienteFolioFacturacion
                                    : ''
                            }
                            // editando={!lEditando}
                            label="Cliente - Factura"
                            //
                            //
                            //
                            //
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Tipo de Pago/Forma de Pago */}
      <Box sx={{ marginY: '1rem' }}>
        <Accordion>
          <AccordionSummary expandIcon={<DownOutlined />}>
            <Typography variant="h5">Tipo de Pago/Forma de Pago</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Grid container spacing={4}>
              {/* Tipo de pago/forma de pago */}
              <Grid size={6}>
                <Grid container spacing={1}>
                  <Grid size={12}>
                    {/* Tipo de pago */}
                    <Grid container spacing={1}>
                      <Grid size={12} sx={{ backgroundColor: '' }}>
                        <RowRadioButtonsGroup
                          titulo="Tipo de Pago"
                          valor1="Financiado"
                          valor2="Anticipo"
                          valor3="Transferencia de Cliente"
                          value={
                            tramiteSeleccionado?.tipo_pago_impuestos?.includes('Financiado')
                              ? 'Financiado'
                              : tramiteSeleccionado?.tipo_pago_impuestos?.includes('Anticipo')
                                ? 'Anticipo'
                                : tramiteSeleccionado?.tipo_pago_impuestos?.includes('Transferencia')
                                  ? 'Transferencia de Cliente'
                                  : null
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* Forma de pago */}
                  <Grid size={12}>
                    <Grid container spacing={3}>
                      <Grid size={12} sx={{ backgroundColor: '' }}>
                        <RowRadioButtonsGroup
                          titulo="Forma de Pago"
                          valor1="Transferencia de Cuenta"
                          valor2="Cheque"
                          value={tramiteSeleccionado ? formaPago : null}
                          //onChange={handleFormaPago}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={6}>
                {/* Cliente */}
                <Grid container spacing={1}>
                  <Grid size={12}>
                    {/* Radio group aqui */}
                    <Grid container spacing={2}>
                      <Grid size={12} sx={{ backgroundColor: '' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%', width: '100%' }}>
                          <TextField
                            id="standard-multiline-flexible"
                            label="Impuesto"
                            variant="standard"
                            // value={
                            //   selectedTramite?.impuesto.length > 0 || selectedTramite?.impuesto[0] == 0 ? selectedTramite.impuesto[0] : ''
                            // }
                            value={
                              Array.isArray(tramiteSeleccionado?.impuesto)
                                ? tramiteSeleccionado?.impuesto[0]
                                : tramiteSeleccionado?.impuesto
                                  ? tramiteSeleccionado?.impuesto
                                  : ''
                            }
                            fullWidth
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid size={12}>
                    {/* Chequera*/}
                    <Grid container spacing={2}>
                      <Grid size={12} sx={{ backgroundColor: '' }}>
                        <br></br>
                        <ComponenteListaDinamica
                          label="Chequera"
                          //   onChange={handleChequeraSelected}
                          instruccionSQL="Combo_Chequeras"
                          value={tramiteSeleccionado?.chequera ? tramiteSeleccionado?.chequera : chequera}
                          valueKey="chequera"
                          labelKey="nombre_chequera"
                          retornaObjeto={false}
                          tramiteSeleccionado
                          //   lEditando={!lEditando}
                          parametros={{
                            '@cCondicion ': "' WHERE es_fiscal = 1 '"
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Botones (Tramite Vehicular, Ver Factura, Permitir Quitar Concepto, Permitir Modificar, Cargar Pedimentos, Cargar Cotizacion, Complementar Tramite, Modificar Cliente Fact.)  */}
      <Box sx={{ marginY: '2rem' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'space-evenly', md: 'space-evenly', lg: 'space-between' },
            flexWrap: 'wrap',
            gap: '15px 0px'
          }}
        >
          {/* <Button onClick={handleVerFactura} variant="outlined" startIcon={<EyeOutlined />}>
            Ver Factura
          </Button> */}
          <VerFactura isEnable={datosCargados}/>
          <AgregarConcepto isEnable={datosCargados} />
          {/* <Button onClick={handlePermitirQuitarConcepto} variant="outlined" startIcon={<MinusCircleOutlined />}>
            Permitir Quitar Concepto
          </Button> */}
          <PermitirQuitarConcepto isEnable={datosCargados} />
          {/* <Button onClick={handlePermitirModificar} variant="outlined" startIcon={<EditOutlined />}>
            Permitir Modificar
          </Button> */}
          <PermitirModificar isEnable={datosCargados} />
          {/* <Button onClick={handleCargarPedimentos} variant="outlined" startIcon={<UploadOutlined />}>
            Cargar Pedimentos
          </Button> */}
          <CargaDePedimentos isEnable={datosCargados} />
          <Button onClick={handleCargarCotizacion} variant="outlined" startIcon={<UploadOutlined />}>
            Cargar Cotización
          </Button>
          {/* <Button onClick={handleComplementarTramite} variant="outlined" startIcon={<PlusCircleOutlined />}>
            Complementar Trámite
          </Button> */}
          <ComplementoDeTramitesAduanales isEnable={datosCargados} />
          {/* <Button onClick={handleModificarClienteFac} variant="outlined" startIcon={<EditOutlined />}>
            Modificar Cliente Fact.
          </Button> */}
          <ModificarClienteFact isEnable={datosCargados} />
        </Box>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox disabled checked={tramiteSeleccionado?.vehicular ? true : false} />}
            label="Trámmite Vehicular"
          />
        </FormGroup>
      </Box>

      {/* Tabla Ingresos Agencia Aduanal */}
      <Box sx={{ marginY: '1rem', backgroundColor: '' }}>
        <Box>
          <Typography variant="h4">Ingresos Agencia Aduanal</Typography>
        </Box>
        <MuiTablaBase
          estructuraEncabezados={[
            { propiedad: 'concepto', encabezadoTitulo: 'Concepto' },
            { propiedad: 'descripcion', encabezadoTitulo: 'Nombre Concepto' },
            { propiedad: 'test3', encabezadoTitulo: 'Referencia' },
            { propiedad: 'fiscal', encabezadoTitulo: 'Factura' },
            { propiedad: 'moneda', encabezadoTitulo: 'Moneda' },
            { propiedad: 'cantidad', encabezadoTitulo: 'Cantidad', formato: 'moneda' }, //Esta columna podria tener numeros que deseo aplicarles un formato, por ejemplo 14698.36797721 --> 14,698.36
            { propiedad: 'importe', encabezadoTitulo: 'Importe M.N' },
            { propiedad: 'importe_me', encabezadoTitulo: 'Importe M.E' }
          ]}
          datos={ingresos}
          idPropiedad="concepto"
        />
      </Box>

      {/* Tabla gastos por Cuenta del Cliente */}
      <Box sx={{ marginY: '1rem', backgroundColor: '' }}>
        <Box>
          <Typography variant="h4">Gastos por Cuenta del Cliente</Typography>
        </Box>
        <MuiTablaBase
          estructuraEncabezados={[
            { propiedad: 'concepto', encabezadoTitulo: 'Concepto' },
            { propiedad: 'descripcion', encabezadoTitulo: 'Nombre Concepto' },
            { propiedad: 'test3', encabezadoTitulo: 'Referencia' },
            { propiedad: 'fiscal', encabezadoTitulo: 'Factura' },
            { propiedad: 'moneda', encabezadoTitulo: 'Moneda' },
            { propiedad: 'cantidad', encabezadoTitulo: 'Cantidad', formato: 'moneda' }, //Esta columna podria tener numeros que deseo aplicarles un formato, por ejemplo 14698.36797721 --> 14,698.36
            { propiedad: 'importe', encabezadoTitulo: 'Importe M.N' },
            { propiedad: 'importe_me', encabezadoTitulo: 'Importe M.E' }
          ]}
          datos={gastos}
          idPropiedad="concepto"
        />
      </Box>

      {/* Mostrar Documentos  */}
      <Box sx={{ marginY: '1rem' }}>
        {/* <Button variant="outlined" onClick={handleMostrarDocumentos}>
          Mostrar Documentos
        </Button> */}
        <MostrarDocumentos />
      </Box>

      {/* Botones (Iniciar, Guardar, Cancelar, Pago De Impuestos, Ver Cheque De Gastos) */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '95%' }}>
        <Box>
          {/* <Button variant="contained" disabled={lEditando} onClick={handleIniciar}>
            Iniciar
          </Button>
          <Button variant="contained" disabled={!lEditando} onClick={handleGuardar}>
            Guardar
          </Button>
          <Button variant="contained" disabled={!lEditando} onClick={handleCancelar} color="secondary">
            Cancelar
          </Button> */}

          <Button variant="contained" onClick={handleIniciar} disabled={crearTramiteManual}>
            Iniciar
          </Button>
          <Button variant="contained" onClick={handleGuardar} disabled={!crearTramiteManual}>
            Guardar
          </Button>
          <Button variant="contained" onClick={handleCancelar} disabled={!crearTramiteManual} color="secondary">
            Cancelar
          </Button>
        </Box>
        <Box sx={{display:'flex'}}>
          <Button sx={{ mx: 2 }} variant="contained" onClick={handlePagoDeImpuestos}>
            Pago De Impuestos
          </Button>
          {/* <Button variant="contained" onClick={handleVerChequeDeGastos}>
            Ver Cheque De Gastos
          </Button> */}
          <VerChequeDeGastos isEnable={true}/>
        </Box>
      </Box>
    </Box>
  );
};

//Export EstTramitesAduanales component
export default EstTramitesAduanales;
