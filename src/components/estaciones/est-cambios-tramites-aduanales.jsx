import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MyContext } from '../../context';

import useAuth from 'hooks/useAuth.js';

//Librerias
import dayjs from 'dayjs';

// Mensajes
import { mensajes } from '../../utils/mensajes.js';

// Componentes de material ui
import Typography from '@mui/material/Typography';
import { Input } from '@mui/material';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DownOutlined } from '@ant-design/icons';
import Grid from '@mui/material/Grid';

// Componentes propios del proyecto
import FirstComponent from '../componentesBase/FirstComponent';
// import ComponenteLista from '../componentesBase/ComponenteLista';
// import RowRadioButtonsGroup from '../componentesBase/RowRadioButon';
import RowRadioButtonsGroup from '../componentesBase/RowRadioButton.jsx';
import DataTable from '../componentesBase/DataTable.jsx';
import DataTable2 from '../componentesBase/DataTable2.jsx';
import ComponenteListaDinamica from '../componentesBase/ComponenteListaDinamica.jsx';
// import Mensajes from '../componentesBase/Mensajes.jsx';

//Modales
import BusquedaTramitesAduanales from './busqueda-tramites-aduanales.jsx';
import BusquedaDeClientes from './busqueda-de-clientes.jsx'

//Iconos
import { SearchOutlined } from '@ant-design/icons';
import { DownCircleOutlined } from '@ant-design/icons';
import { bgcolor, border, fontSize, height, width } from '@mui/system';
import { color } from 'framer-motion';

//Componentes Comunes
import Autoriza from '../comun/autoriza.jsx';

// Componente EstCambiosTramitesAduanales
const EstCambiosTramitesAduanales = () => {
  const { data, setData } = useContext(MyContext);
  // const [selectedValue, setSelectedValue] = useState('');
  const [openModal, setOpenModal] = useState(false); // Seguimiento del estado del modal de busqueda tramites aduanales
  const [openBusquedaClienteModal,setOpenBusquedaClienteModal]=useState(false) // Seguimiento del estado del modal de busqueda de clientes

  const [selectedTramite, setSelectedTramite] = useState(null);
  const [sucursal, setSucursal] = useState(useAuth().user.sucursal);
  const [ingresos, setIngresos] = useState(null);
  const [gastos, setGastos] = useState(null);
  const [clave_pedimento, setClave] = useState('');

  const [nivelDeSeguridad, setNivelDeSeguridad] = useState(useAuth().menu);

  const [esHabilitadoIniciar, setEsHabilitadoIniciar] = useState(true);
  const [esHabilitadoGuardar, setEsHabilitadoGuardar] = useState(false);
  const [esHabilitadoCancelar, setEsHabilitadoCancelar] = useState(false);

  const [folio, setFolio] = useState('');

  const handleFetch = async (parametros) => {
    try {
      const response = await fetch('http://localhost:3001/dinamico/lista', {
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

      setSelectedTramite(data[0][0]);
      setIngresos(data[1]);
      setGastos(data[2]);
      // setSegundoArreglo(data[1]);
    } catch (error) {
      console.log(error);
    } finally {
      // setIsLoading(false); //Terminar de cargar
      console.log('Done');
    }
  };
  let { pathname } = useLocation();
  useEffect(() => {
    console.log(pathname);
    if (pathname.includes('est-cambios-tramites-aduanales')) {
      // console.log('menu', nivelDeSeguridad);
      for (let i = 0; i < nivelDeSeguridad.length; i++) {
        // console.log('menu object', nivelDeSeguridad[i]);
        // console.log('children', nivelDeSeguridad[i].children);
        for (let index = 0; index < nivelDeSeguridad[i].children.length; index++) {
          const element = nivelDeSeguridad[i].children[index];
          // console.log('children item', element.url);
          if (typeof element?.url === 'string' && element.url.includes('/est-cambios-tramites-aduanales')) {
            // console.log('elemento objetivo', element);
            console.log(element.nivel_seguridad);
            //Una vez se encuentra el nivel de seguridad se setea en el estado nivelDeSeguridad
            setNivelDeSeguridad(element.nivel_seguridad);
          }
        }
      }
    }
  }, []); // Este codigo se ejecuta cada vez que el comoponente se monta

  useEffect(() => {
    console.log('nivel de seguridad', nivelDeSeguridad);
    console.log('updated setConsultaConExtito = True');
    // setConsultaConExito(true);
    console.log('Updated folio state:', folio);
    console.log('Type:', typeof folio);
    if (folio) {
      console.log('folio', folio);
      console.log('length', folio.length);
      if (folio.length < 6 || folio.length >= 7) {
        setIngresos([]);
        setGastos([]);
      }
      // if (folio.length > 5 && folio.length < 7) {
      //   console.log('Valid length range:', folio.length, folio);
      //   handleFetch(folio);
      // }
    } else {
      console.log('No hay resultados');
    }
  }, [folio]); // Este codigo se ejecuta cada vez que la variable folio cambia

  const handleEnterButton = async (e) => {
    console.log('key pressed', e);
    if (e.key === 'Enter') {
      //Buscar tramite por el folio
      console.log(e.target.value);
      await handleFetch(folio);
      // mensajes('aviso', 'Consulta realizada', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do');
    }
  };

  const handleFolio = (e) => {
    if (selectedTramite) {
      setSelectedTramite(null);
    }
    let value = e.target.value;
    // console.log('Input value (current):', value); // This is what the user just typed
    setFolio(value);
  };

  // console.log('Debajo debe mostrarse lo que hay en data');
  // console.log(data.menu);
  // console.log(JSON.parse(Object.values(JSON.parse(data.resultado).recordsets[1][0])[0]).Menu);

  // const handleClick = async () => {
  //   try {
  //     const response = await fetch('http://localhost:3001/consulta', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         Procedimiento: 'Combo_Tasas_Ivas',
  //         Parametros: { otros: 0, solo_activas: 0 }
  //       })
  //     });
  //     const data = await response.json();
  //     console.log('Respuesta del servidor:', data);
  //   } catch (error) {
  //     console.error('Error en la petición:', error);
  //   }
  // };

  const handleIniciar = () => {
    console.log('El boton Iniciar se presiono');
    // Si no se ha cargado informacion del pedimento ingresando el folio y presionando enter o buscando y seleccionandolo por medio del modal,
    // al presionarlo se desabilita el mismo boton(iniciar) y se habilita el boton de guardar
    // al presinarlo se habilita el boton cancelar
    //console.log(typeof selectedTramite)
    // if(!selectedTramite){
    //   setEsHabilitadoGuardar(true)
    //   setEsHabilitadoIniciar(false)
    //   setEsHabilitadoCancelar(true)
    // }

    setEsHabilitadoGuardar(true);
    setEsHabilitadoIniciar(false);
    setEsHabilitadoCancelar(true);
  };

  const handleGuardar = () => {
    console.log('El boton guardar se presiono');
  };

  const handleCancelar = () => {
    console.log('El boton cancelar se presiono');
    //Si esta habilitado el propio boton(cancelar) y se presiona el boton iniciar se habilita el boton iniciar
    //y el boton guardar se desabilita
    setEsHabilitadoIniciar(true);
    setEsHabilitadoGuardar(false);
    setEsHabilitadoCancelar(false);
    setSelectedTramite(null);
    setIngresos([]);
    setGastos([]);
    setFolio('');
  };

  const handleImprimir = () => {
    console.log('El boton Imprimir se presiono');
    if (selectedTramite) {
      console.log(selectedTramite);
    }
  };

  // Callback: hace el llamado cuando la fila a sido seleccionada
  const handleRowSelect = (row) => {
    console.log('Row selected in parent:', row);
    //Ejemplo:

    // {
    //   "clave": "RT",
    //   "cteFacturacion": "RM HEALTHCARE PRODUCTS",
    //   "ctePedimento": "RM HEALTHCARE PRODUCTS",
    //   "fecha": "22 Jul 2025",
    //   "history": [
    //     {}, {}, {}, {}, {}, {}
    //   ],
    //   "impuesto": 2731,
    //   "pedimento": "250730665024852",
    //   "precintos": 0,
    //   "tipo": "E",
    //   "tramite": 960977
    // }

    setSelectedTramite(row);

    //Si un tramite es seleccionado por medio del componente busqueda-tramites-aduanales
    //se habilita el boton Guardar, se habilita el boton Cancelar, se deshabilita el boton Iniciar
    setEsHabilitadoGuardar(true);
    setEsHabilitadoCancelar(true);
    setEsHabilitadoIniciar(false);

    setOpenModal(false); // Cerrar modal
  };

  const handleAutorizar=(row)=>{
    console.log('Autorizar el registro:', row);
  };

  const handleNuevo=()=>{
    console.log('Nuevo registro');  
  };

  const handleBorrar=(row)=>{ 
    console.log('Borrar el registro:', row);
  };

  const handleCambiar=(row)=>{
    console.log('Cambiar el registro:', row);
  };

  const handleVerHistoria=(row)=>{ 
    console.log('Ver historia del registro:', row);
  };
  

  return (
    <div>
      <Typography variant="h2">Modificación de Trámites Aduanales</Typography>
      <Divider sx={{ my: 2 }} />

      <Box component="form" className="base" sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
          {/* Tramite, Fecha */}
          <Grid size={4}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
              <TextField
                id="standard-basic"
                label="Trámite aduana"
                variant="standard"
                onChange={handleFolio}
                onKeyDown={(e) => handleEnterButton(e)}
                fullWidth
                value={selectedTramite?.tramite ? selectedTramite.tramite : folio}
                // value={folio}
              />

              <BusquedaTramitesAduanales
                onSelectRow={handleRowSelect}
                open={openModal}
                onClose={() => {
                  document.activeElement?.blur();
                  setOpenModal(false);
                }}
                onOpen={() => setOpenModal(true)}
              />
            </Box>
          </Grid>
          <Grid size={4}>
            <FirstComponent value={dayjs(selectedTramite?.fecha)} label = "Fecha" />
          </Grid>
        </Grid>

        <br />

        {/* Ivas, Precintos,$ */}
        <Grid container spacing={1}>
          <Grid size={4}>
            {/* <ComponenteLista titulo="Sucursal" /> */}
            <ComponenteListaDinamica
              label="Sucursal"
              onChange={setSucursal}
              instruccionSQL="combo_sucursales"
              value={selectedTramite?.sucursal ? selectedTramite?.sucursal : sucursal}
              valueKey="sucursal"
              labelKey="nombre_sucursal"
              parametros={{
                '@cCentro': "'      1'"
              }}
            />
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              id="outlined-number"
              label="Precintos"
              type="number"
              // value={selectedTramite?.precintos || selectedTramite?.precintos == 0 ? selectedTramite.precintos : ''}
              // value={selectedTramite?.precintos.lenght > 0 || selectedTramite?.precintos[0] == 0 ? selectedTramite.precintos[0] : ''}
              value={
                Array.isArray(selectedTramite?.precintos)
                  ? selectedTramite.precintos.length > 0 || selectedTramite.precintos[0] === 0
                    ? selectedTramite.precintos[0]
                    : ''
                  : typeof selectedTramite?.precintos === 'number'
                    ? selectedTramite.precintos
                    : ''
              }
            />
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              placeholder="0.00"
              id="outlined-start-adornment"
              label="Tipo Cambio"
              slotProps={{ input: { startAdornment: '$' } }}
              value={
                selectedTramite?.tipo_cambio || selectedTramite?.tipo_cambio == 0 ? Math.floor(selectedTramite.tipo_cambio * 100) / 100 : ''
              }
            />
          </Grid>
        </Grid>

        <br />

        {/* Acordion Pedimento/Cliente */}
        <Accordion
          sx={{
            borderRadius: '4px',
            '&:last-of-type': {
              borderRadius: '4px' // Ensure last accordion maintains radius
            }
          }}
        >
          <AccordionSummary expandIcon={<DownOutlined />} aria-controls="panel1-content" id="panel1-header">
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
                      <Grid size={6}>
                        {/* <RowRadioButtonsGroup titulo="Tipo" valor1="Importación" valor2="Exportación" /> */}
                        <RowRadioButtonsGroup
                          titulo="Tipo"
                          valor1="Importación"
                          valor2="Exportación"
                          value={
                            selectedTramite
                              ? selectedTramite.tipo?.startsWith('I')
                                ? 'Importación'
                                : selectedTramite.tipo_pedimento?.startsWith('I')
                                  ? 'Importación'
                                  : 'Exportación'
                              : null
                          }
                        />
                      </Grid>
                      <Grid size={6}>
                        <ComponenteListaDinamica
                          label="Clave"
                          onChange={setClave}
                          instruccionSQL="SELECT DISTINCT nombre_clave, clave_pedimento FROM Claves_Pedimentos ORDER BY nombre_clave"
                          value={selectedTramite?.clave_pedimento ? selectedTramite?.clave_pedimento : clave_pedimento}
                          valueKey="clave_pedimento"
                          labelKey="nombre_clave"
                          
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid size={12}>
                    <Grid container spacing={3}>
                      <Grid size={6}>
                        <TextField
                          fullWidth
                          id="standard-basic"
                          label="Número de pedimento"
                          variant="standard"
                          // value={selectedTramite?.pedimento ? selectedTramite.pedimento : ''}
                          // value={selectedTramite?.pedimento.length > 0 ? selectedTramite.pedimento[0] : ''}
                          value={
                            Array.isArray(selectedTramite?.pedimento)
                              ? selectedTramite?.pedimento[0]
                              : selectedTramite?.pedimento
                                ? selectedTramite?.pedimento
                                : ''
                          }
                        />
                      </Grid>
                      <Grid size={6}>
                        <RowRadioButtonsGroup
                          titulo="Cargo"
                          valor1="Con Cargo"
                          valor2="Sin Cargo"
                          value={selectedTramite ? (selectedTramite?.con_cargo == true ? 'Con Cargo' : 'Sin Cargo') : null}
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
                      <Grid size={12}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                          <TextField
                            id="standard-basic"
                            label="Fólio - Pedimento"
                            variant="standard"
                            value={
                              selectedTramite?.ctePedimento
                                ? `${selectedTramite?.id_cliente_pedimento}-${selectedTramite.ctePedimento}`
                                : selectedTramite?.nombre_cliente_pedimento
                                  ? `${selectedTramite?.cliente_pedimento} - ${selectedTramite?.nombre_cliente_pedimento}`
                                  : ''
                            }
                            fullWidth
                          />

                          <BusquedaDeClientes
                            open={openBusquedaClienteModal}
                            onClose={() => setOpenBusquedaClienteModal(false)}
                            onOpen={() => setOpenBusquedaClienteModal(true)}
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
                      <Grid size={12}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                          <TextField
                            id="standard-multiline-flexible"
                            label="Fólio - Facturación"
                            multiline
                            maxRows={2}
                            variant="standard"
                            value={
                              selectedTramite?.cteFacturacion
                                ? `${selectedTramite?.id_cliente_factura} - ${selectedTramite.cteFacturacion}`
                                : selectedTramite?.nombre_cliente_factura
                                  ? `${selectedTramite?.cliente_factura} - ${selectedTramite?.nombre_cliente_factura}`
                                  : ''
                            }
                            fullWidth
                          />

                          <Button variant="outlined" sx={{ height: '100%' }}>
                            <SearchOutlined style={{ fontSize: '1.5em', color: '#00345D' }} />
                          </Button>

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
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <br />

        {/* Acordion Tipo de pago/Forma de pago Termina */}
        <Accordion
          sx={{
            borderRadius: '4px',
            '&:last-of-type': {
              borderRadius: '4px' // Ensure last accordion maintains radius
            }
          }}
        >
          <AccordionSummary expandIcon={<DownOutlined />} aria-controls="panel2-content" id="panel2-header">
            <Typography variant="h5">Tipo de Pago/Forma Pago</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={4}>
              {/* Tipo de pago/forma de pago */}
              <Grid size={6}>
                <Grid container spacing={1}>
                  <Grid size={12}>
                    {/* Tipo de pago */}
                    <Grid container spacing={1}>
                      <Grid size={12}>
                        <RowRadioButtonsGroup
                          titulo="Tipo de Pago"
                          valor1="Financiado"
                          valor2="Anticipo"
                          valor3="Transferencia de Cliente"
                          value={
                            selectedTramite?.tipo_pago_impuestos.includes('Financiado')
                              ? 'Financiado'
                              : selectedTramite?.tipo_pago_impuestos.includes('Anticipo')
                                ? 'Anticipo'
                                : selectedTramite?.tipo_pago_impuestos.includes('Transferencia')
                                  ? 'Transferencia de Cliente'
                                  : null
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid size={12}>
                    <Grid container spacing={3}>
                      <Grid size={12}>
                        <RowRadioButtonsGroup titulo="Forma de Pago" valor1="Transferencia de Cuenta" valor2="Cheque" />
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
                      <Grid size={12}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%', width: '100%' }}>
                          <TextField
                            id="standard-multiline-flexible"
                            label="Impuesto"
                            variant="standard"
                            // value={
                            //   selectedTramite?.impuesto.length > 0 || selectedTramite?.impuesto[0] == 0 ? selectedTramite.impuesto[0] : ''
                            // }
                            value={
                              Array.isArray(selectedTramite?.impuesto)
                                ? selectedTramite?.impuesto[0]
                                : selectedTramite?.impuesto
                                  ? selectedTramite?.impuesto
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
                      <Grid size={12}>{/* <ComponenteLista titulo="Chequera" /> */}</Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <br />
      </Box>

      <br />

      {/* Tabla Ingreso Aduanal */}
      <Box>
        <Typography variant="h4">Ingresos Agencia Aduanal</Typography>
        <br />
        {/* <DataTable datos={selectedTramite?.history} flag={'Ingresos'} /> */}
        <DataTable
          datos={selectedTramite?.history ? selectedTramite?.history : ingresos}
          flag={selectedTramite?.history ? 'Ingresos' : ''}
        />
      </Box>

      <br />
      {/* Tabla gastos por Cuenta del Cliente */}
      <Box>
        <Typography variant="h4">Gastos por Cuenta del Cliente</Typography>
        <br />
        {/* <DataTable datos={selectedTramite?.history} flag={'Gastos'}></DataTable> */}
        <DataTable datos={selectedTramite?.history ? selectedTramite?.history : gastos} flag={selectedTramite?.history ? 'Gastos' : ''} />
      </Box>
      <br/>
      <Stack direction="row">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box>
            <Autoriza 
              texto="Autorizar Gastos"
              Color="success"
              onSelectRow={handleRowSelect}
              open={openModal}
              onClose={() => {
                document.activeElement?.blur();
                setOpenModal(false);
              }}
              onOpen={() => setOpenModal(true)}/>
            &nbsp;
            <Button variant="outlined" onClick={handleNuevo} color="primary">
              Nuevo Gasto
            </Button>
            &nbsp;
            <Button variant="outlined" onClick={handleCambiar} color="warning">
              Cambiar Gasto
            </Button>
            &nbsp;
            <Button variant="outlined" onClick={handleBorrar} color="error">
              Borrar Gasto
            </Button>
            
          </Box>
          <Box>
            <Button variant="text" onClick={handleVerHistoria} color="success">
              Ver Historia
            </Button>
          </Box>
        </Box>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Botones */}
      <Stack direction="row">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box>
            <Button variant="contained" disabled={!esHabilitadoIniciar} onClick={handleIniciar}>
              Iniciar
            </Button>
            <Button variant="contained" disabled={!esHabilitadoGuardar} onClick={handleGuardar}>
              Guardar
            </Button>
            <Button variant="contained" disabled={!esHabilitadoCancelar} onClick={handleCancelar} color="secondary">
              Cancelar
            </Button>
          </Box>
          <Box>
            {/* <Button onClick={handleClick} variant="contained"> */}
            <Button onClick={handleImprimir} variant="contained">
              Imprimir
            </Button>
          </Box>
        </Box>
      </Stack>

      {/* Componente lista de prueba */}

      {/* <ComponenteListaDinamica
        label="Ivas"
        instruccionSQL="combo_tasas_ivas"
        parametros={{
          '@lOtros': 0,
          '@lSolo_Activas': 0
        }}
        valueKey="folio"
        labelKey="tasa_iva"
      />  */}
      {/* <ComponenteListaDinamica
        label="Forma pago"
        instruccionSQL="combo_formas_pago"
        valueKey="forma_pago"
        labelKey="forma_pago"
      /> */}

      {/* Sweet Alerts de pruebas */}
      {/* {mensajes('error' ,'Lorem Ipsum','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do' )} */}

      {/* {mensajes('pregunta' ,'Lorem Ipsum','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do' )} */}

      {/* {mensajes('aviso' ,'Lorem Ipsum','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do' )} */}
    </div>
  );
};

// Exportacion de componente EstCambiosTramitesAduanales
export default EstCambiosTramitesAduanales;
