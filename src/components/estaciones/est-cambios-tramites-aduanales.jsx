import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MyContext } from '../../context';

import FileUploader from '../componentesBase/FileUploader';
// Asumiendo que tienes un hook para hacer peticiones al backend
import useBackendApi from '../../hooks/useBackendApi';

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
import ReactMarkdown from 'react-markdown';

// Componentes propios del proyecto
import FirstComponent from '../componentesBase/FirstComponent';
import RowRadioButtonsGroup from '../componentesBase/RowRadioButton.jsx';
import DataTable from '../componentesBase/DataTable.jsx';
import ComponenteListaDinamica from '../componentesBase/ComponenteListaDinamica.jsx';

//Modales
// import BusquedaTramitesAduanales from './busqueda-tramites-aduanales.jsx';
import BusquedaTramitesAduanales from '../servicios/busqueda-tramites-aduanales.jsx';
import BusquedaDeClientes from '../servicios/busqueda-de-clientes.jsx';
import AltaYCambiosAGastosNoDeducibles from './alta-y-cambios-a-gastos-no-deducibles.jsx';
import HistoriaTramites from '../servicios/historia-tramites.jsx';

//Componentes Comunes
import Autoriza from '../comun/autoriza.jsx';
import { set } from 'lodash-es';
import useSQL from 'hooks/useSQL.js';
import { m } from 'framer-motion';

// Componente EstCambiosTramitesAduanales
const EstCambiosTramitesAduanales = () => {
  const [analisisResultado, setAnalisisResultado] = useState(null);
  const { postData } = useBackendApi(); // Hook de ejemplo
  //const { data, setData } = useContext(MyContext);
  const [openModal, setOpenModal] = useState(false); // Seguimiento del estado del modal de busqueda tramites aduanales
  const [openAutoriza, setOpenAutoriza] = useState(false); // Seguimiento del estado del modal de autorizacion
  const [openAutorizaBorrar, setOpenAutorizaBorrar] = useState(false); // Seguimiento del estado del modal de autorizacion
  const [openAutorizaBorrarTA, setOpenAutorizaBorrarTA] = useState(false); // Seguimiento del estado del modal de autorizacion
  const [openBusquedaClientePedimentoModal, setOpenBusquedaClientePedimentoModal] = useState(false); // Seguimiento del estado del modal de busqueda de clientes pedimento
  const [openBusquedaClienteFacturaModal, setOpenBusquedaClienteFacturaModal] = useState(false); // Seguimiento del estado del modal de busqueda de clientes factura
  const [openAltaYCambiosAGastosNoDeduciblesModal, setOpenAltaYCambiosAGastosNoDeduciblesModal] = useState(false); // Seguimiento del estado del modal de alta y cambios a gastos no deducibles
  const [openHistoriaTramitesModal, setOpenHistoriaTramitesModal] = useState(false); // Seguimiento del estado del modal de historia de tramites
  const [selectedTramite, setSelectedTramite] = useState('');
  const [sucursal, setSucursal] = useState(useAuth().user?.sucursal || '');
  const [ingresos, setIngresos] = useState(null);
  const [gastos, setGastos] = useState(null);
  const [clave_pedimento, setClave] = useState('');
  const [chequera, setChequera] = useState('');

  const [nivelDeSeguridad, setNivelDeSeguridad] = useState(useAuth().menu);
  const [gastosRowSelected, setGastosRowSelected] = useState(null); 

  const [clienteFolioPedimento, setClienteFolioPedimento] = useState('');
  const [clienteFolioFacturacion, setClienteFolioFacturacion] = useState('');

  const [folio, setFolio] = useState('');
  const [formaPago, setFormaPago] = useState('');

  // Estado para guardar el resultado del análisis
  const [analisisIA, setAnalisisIA] = useState('');
  const [cargandoIA, setCargandoIA] = useState(false);

  const [lEditando, setLEditando] = useState(false);
  // 1. Use el hook useSQL
  const { loading, error, executeFetch } = useSQL();

  const handleAnalisisIA = async (servicio) => {
    if (!selectedTramite) {
      mensajes('aviso', 'Debes seleccionar un trámite para analizar.');
      return;
    }

    // setServicioIA(servicio); // Si decides usar los botones de radio, no necesitas esta línea
    setCargandoIA(true);

    const Params = {
      ficha_deposito: `'167230'`
    };
    const instruccionSQL = 'Trazabilidad_Pagos2'; // El mismo SP que usas en handleFetch
    const parametros = Params; // Usa el folio del trámite seleccionado
    // const promptAI =
    //   'Analiza los datos de este trámite aduanal. Revisa los ingresos y gastos. Identifica cualquier inconsistencia, gasto inusualmente alto o bajo, ' +
    //   'y discrepancias en las fechas. Dame un resumen claro de los hallazgos y una recomendación para el siguiente paso en el proceso de auditoría.';
    const promptAI =
      '**TAREA DE ANÁLISIS FINANCIERO ADUANAL** ' +
      'Analiza detalladamente los datos de este trámite aduanal. Revisa exhaustivamente los **ingresos y gastos**.' +
      '**Objetivos del Análisis:**' +
      '1.  **Inconsistencias:** Identifica cualquier patrón irregular o datos faltantes.' +
      '2.  **Discrepancias:** Señala gastos que sean inusualmente altos o bajos en comparación con la media, o discrepancias en las fechas de registro.' +
      '**FORMATO DE SALIDA REQUERIDO:**' +
      'Tu respuesta debe ser estructurada usando **Markdown** estricto para asegurar un formato profesional y legible.' +
      '--- ' +
      '# 📊 [NOMBRE O FOLIO DEL TRÁMITE] - Resumen de Auditoría Aduanal' +
      '---' +
      '## 🔍 Hallazgos Clave' +
      '* **Identificación de Anomalías:** Usa **negritas** para destacar cualquier monto o fecha crítica. ' +
      '* **Listado:** Usa una lista con viñetas para presentar los 3-5 hallazgos más importantes. Incluye un **Emoji** relevante (e.g., ⚠️ para advertencia, ✅ para conformidad).' +
      '## 📈 Análisis Financiero y de Consistencia' +
      '* **Ingresos/Gastos:** Ofrece una breve comparación y un balance.' +
      '* **Gastos Atípicos:** Si encuentras gastos inusuales, usa un subtítulo con `### Gasto con Alerta: [NOMBRE DEL GASTO]`.' +
      '## ✅ Recomendación y Siguiente Paso' +
      '* **Título Principal:** Usa **Markdown** para un título claro.' +
      '* **Acción:** Proporciona una **recomendación clara y concisa** para el siguiente paso en el proceso de auditoría o corrección.';

    // Elige la URL del endpoint según el servicio que se le pasó como argumento
    const endpointURL =
      servicio === 'gemini'
        ? import.meta.env.VITE_URL_ENVIRONMENT + '/analisis-ia'
        : import.meta.env.VITE_URL_ENVIRONMENT + '/analisis-ia-gpt';

    try {
      const response = await fetch(endpointURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruccionSQL: instruccionSQL,
          parametros: parametros,
          promptAI: promptAI
        })
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      const data = await response.json();
      setAnalisisIA(data.analisis);
      mensajes('success', `Análisis de ${servicio} completado`);
    } catch (error) {
      console.error(`Error al realizar el análisis con ${servicio}:`, error);
      mensajes('error', `Error al realizar el análisis con ${servicio}: ${error.message}`);
      setAnalisisIA('No se pudo realizar el análisis. Intenta de nuevo más tarde.');
    } finally {
      setCargandoIA(false);
    }
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

  const handleIniciar = () => {
    console.log('El boton Iniciar se presiono');
    setLEditando(true);
    // Si no se ha cargado informacion del pedimento ingresando el folio y presionando enter o buscando y seleccionandolo por medio del modal,
    // al presionarlo se desabilita el mismo boton(iniciar) y se habilita el boton de guardar
    // al presinarlo se habilita el boton cancelar
    //console.log(typeof selectedTramite)
    // if(!selectedTramite){
    //   setEsHabilitadoGuardar(true)
    //   setEsHabilitadoIniciar(false)
    //   setEsHabilitadoCancelar(true)
    // }

    // setEsHabilitadoGuardar(true);
    // setEsHabilitadoIniciar(false);
    // setEsHabilitadoCancelar(true);
  };

  const handleGuardar = () => {
    console.log('El boton guardar se presiono');
    setLEditando(false);
  };

  const handleCancelar = () => {
    console.log('El boton cancelar se presiono');
    setLEditando(false);
    //Si esta habilitado el propio boton(cancelar) y se presiona el boton iniciar se habilita el boton iniciar
    //y el boton guardar se desabilita
    // setEsHabilitadoIniciar(true);
    // setEsHabilitadoGuardar(false);
    // setEsHabilitadoCancelar(false);
    setSelectedTramite(null);
    setIngresos([]);
    setGastos([]);
    setFolio('');
    setClienteFolioPedimento;
  };

  const handleImprimir = () => {
    console.log('El boton Imprimir se presiono');
    if (selectedTramite) {
      console.log(selectedTramite);
    }
  };

  const handleRowSelectClientePedimento = (row) => {
    console.log('est-camb-ad', row);
    setOpenBusquedaClientePedimentoModal(false);
    let folioYNombre = `${row.folio} - ${row.nombre_cliente}`;
    setSelectedTramite(null);
    setFolio('');
    setGastos([]);
    setIngresos([]);
    setClienteFolioPedimento(folioYNombre);
  };

  const handleRowSelectClienteFacturacion = (row) => {
    console.log('est-camb-ad', row);
    setOpenBusquedaClienteFacturaModal(false);
    let folioYNombre = `${row.folio} - ${row.nombre_cliente}`;
    setSelectedTramite(null);
    setFolio('');
    setGastos([]);
    setIngresos([]);
    setClienteFolioFacturacion(folioYNombre);
  };

  // Callback: hace el llamado cuando la fila a sido seleccionada
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
    setSelectedTramite(row);
    if (row.tramite > 0) {
      setFolio(row.tramite);
    }

    //Si un tramite es seleccionado por medio del componente busqueda-tramites-aduanales
    //se habilita el boton Guardar, se habilita el boton Cancelar, se deshabilita el boton Iniciar
    // setEsHabilitadoGuardar(true);
    // setEsHabilitadoCancelar(true);
    // setEsHabilitadoIniciar(false);

    setOpenModal(false); // Cerrar modal
  };

  const handleAutorizar = (row) => {
    console.log('Autorizar el registro:', row);
  };

  const handleNuevo = () => {
    console.log('Nuevo registro');
  };

  const handleBorrar = (row) => {
    console.log('Borrar el registro:', row);
  };

  const handleCambiar = (row) => {
    console.log('Cambiar el registro:', row);
  };

  const handleVerHistoria = (row) => {
    console.log('Ver historia del registro:', row);
  };

  // Lógica de validación previa
  const handleProcesoPrevio = () => {
    let pasaValidacion = true;
    let registrosGastos = 0;

    let dataToFilter = selectedTramite?.history || gastos;

    // Check if dataToFilter exists and is an array before filtering
    if (Array.isArray(dataToFilter)) {
      const filteredRecords = dataToFilter.filter((gasto) => {
        // Apply all three conditions from your FoxPro query
        return gasto.gasto_no_deducible > 0 && gasto.estado_gasto_nd.trim() === 'Capturado' && gasto.estatus_proveedor.trim() === 'Pagado';
      });
      registrosGastos = filteredRecords.length;
    }

    if (registrosGastos === 0) {
      pasaValidacion = false;
    }

    if (!pasaValidacion) {
      mensajes('error', 'No hay gastos no deducibles a autorizar.');
      //return false;  comentado par pruebas
      return true;
    }
    return true;
  };

  // Lógica de acción final después de la autorización exitosa
  const handleProcesoPosterior = async () => {
    let datosFiltrar = selectedTramite?.history || gastos;

    if (Array.isArray(datosFiltrar)) {
      const registrosFiltrados = datosFiltrar.filter((gasto) => {
        return gasto.gasto_no_deducible > 0 && gasto.estado_gasto_nd.trim() === 'Capturado';
      });

      const gastosJson = JSON.stringify(registrosFiltrados);

      const Params = {
        nTramite: `'${folio}'`,
        cjSon: `'${gastosJson}'`
      };

      const result = await executeFetch('Autoriza_Gasto_Tramite_Web', Params, true);

      if (result.success) {
        mensajes('aviso', 'Tramite Guardado');
      }
    }
  };

  const handleSucursalSelected = (value, objeto) => {
    console.log('Sucursal seleccionada:', value);
    setSucursal(value);
  };

  const handleChequeraSelected = (value, objeto) => {
    setChequera(value);
  };

  const handleClaveSelected = (value, objeto) => {
    console.log('valueclave', value);
    console.log('objetodeclave', objeto);
    setClave(value);
  };

  const handleProcesoPrevioBorrarTA = () => {
    const lnIngresos_Factura = (ingresos || []).filter((item) => item.estatus_factura !== 'Capturado').length;
    const lnIngresos_Proveedor = (ingresos || []).filter((item) => item.estatus_proveedor !== 'Capturado').length;
    const lnGastos_Factura = (gastos || []).filter((item) => item.estatus_factura !== 'Capturado').length;
    const lnGastos_Proveedor = (gastos || []).filter((item) => item.estatus_proveedor !== 'Capturado').length;

    if (folio == 0 || folio == '' || folio == 'undefined') {
      mensajes('error', 'No hay un trámite seleccionado');
      return false;
    } else {
      if (lnIngresos_Factura == 0 && lnIngresos_Proveedor == 0 && lnGastos_Factura == 0 && lnGastos_Proveedor == 0) {
        return true;
      } else {
        mensajes('error', 'No se puede borrar el trámite');
        return false;
      }
    }
  };

  const handleProcesoPosteriorBorrarTA = async () => {
    const Params = {
      sucursal: `'${sucursal}'`,
      solicita: `'${usuarioLogged}'`,
      autoriza: `'${usuario}'`,
      operacion: `'${FolioAutorizacion}'`,
      componente: `'${Componente}'`,
      tabla: `'${Tabla}'`,
      folio: `'${Folio}'`,
      justificacion: `''`
    };

    const result = await executeFetch('BORRA_TRAMITE_ADUANAL', Params, true);

    if (result.success) {
      mensajes('aviso', 'Trámite eliminado de la BD.');

      if (onProcesoPosteriorBorrarTA) {
        onProcesoPosteriorBorrarTA();
      }
      onClose();
    }
  };
  const handleOpenHistoriaTramitesModal = () => {
    setOpenHistoriaTramitesModal(true);
  };

  const handleCloseHistoriaTramitesModal = () => {
    setOpenHistoriaTramitesModal(false);
  };

  // Cerrar modal y enviar data hacia arriba
  const handleRowSelectGastos = (row) => {
    console.log('row seleccionado en historia de tramites', row);
    setGastosRowSelected(row);
    // Aquí puedes hacer lo que necesites con los datos de la fila
    // como actualizar el estado de la pantalla padre o llamar a otra función
  };

  const handleFormaPago = (value) => {
    console.log('Forma de pago seleccionada:', value);
  };

  const handleProcesoPrevioBorrarGasto = async () => {
    let pasaValidacion = true;
    let registrosGastos = 0;
    mensajes('aviso', GastosRowSelected);
    // PRIVATE pnGasto , ;
    // pnFolio , ;
    // pnTramite , ;
    // pnConcepto , ;
    // pnLinea

    // LOCAL lnImporte, ;
    // lcEstado_Gasto

    // WITH THISFORM
    //   pnGasto 	   = Gastos.gasto_no_deducible
    //   lcEstado_Gasto = Gastos.estado_gasto_nd

    //   IF pnGasto > 0 AND lcEstado_Gasto = 'Capturado'
    //     IF THISFORM.Puede_Borrar()  && hd 21316  validamos que este detalle de tramite no tenga una factura asociada
    //       IF PREGUNTA( '¿ Seguro que desea elimar el Gastos No Deducible ?')
    //         pnFolio = 0

    //         XSQL( 'UPDATE Detalles_Tramites_Aduanales SET ' + ;
    //               'gasto_no_deducible = ?pnFolio ' + ;
    //             'WHERE  gasto_no_deducible = ?pnGasto ')

    //         SELECT Gastos
    //         REPLACE gasto_no_deducible WITH 0 FOR gasto_no_deducible = pnGasto

    //         .grdGastos.Refresh()
    //       ENDIF

    //     ENDIF
    //   ELSE
    //     _ERROR( 'El gasto ya esta pagado')
    //   ENDIF

    // ENDWITH
  };

  // 💡 ESTA ES LA FUNCIÓN CLAVE 💡
  const handleFileAnalysis = async (fileData) => {
    // Aquí recibimos el objeto: { name, mimeType, base64 }
    console.log('Paso 1: Archivo recibido para análisis:', fileData);

    // Paso 1: AGREGAR VALIDACIÓN INICIAL
    if (!folio) {
      console.error('El Folio (trámite) no está definido. No se puede enviar a la IA.');
      mensajes('aviso', 'Debes ingresar o seleccionar un Folio de Trámite para analizar el documento.');
      return;
    }

    try {
      console.log('Enviando archivo a backend para análisis...');
      const response = await postData('/analizar-documento-gemini', {
        tramite_id: folio,
        file: fileData // Enviamos el archivo ya en Base64
      });

      // 🚨 CORRECCIÓN CLAVE: El backend devuelve la data en la propiedad 'data'
      // console.log("Respuesta completa del Backend:", response); // Descomentar para debug

      if (response.success && response.data) {
        setAnalisisResultado(response.data); // USAR response.data
        mensajes('exito', 'Datos extraídos con éxito por la IA.');
        console.log('Datos para llenar campos (FRONTEND):', response.data);
      } else {
        mensajes('error', response.message || 'Error desconocido al extraer datos del documento.');
      }
    } catch (error) {
      console.error('Error en la extracción de datos:', error);
      mensajes('error', 'Fallo de comunicación con el servidor de análisis.');
    }
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
              {selectedTramite?.tramite_aduana ? (
                <BusquedaTramitesAduanales
                  onSelectRow={handleRowSelect}
                  open={openModal}
                  onClose={() => {
                    document.activeElement?.blur();
                    setOpenModal(false);
                  }}
                  onOpen={() => setOpenModal(true)}
                  editando={lEditando}
                  onChange={handleFolio}
                  onKeyDown={(e) => handleEnterButton(e)}
                  value={selectedTramite.tramite_aduana ? selectedTramite.tramite_aduana : folio}
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
                  editando={lEditando}
                  onChange={handleFolio}
                  onKeyDown={(e) => handleEnterButton(e)}
                  value={selectedTramite?.tramite ? selectedTramite?.tramite : folio}
                />
              )}
            </Box>
          </Grid>
          <Grid size={4}>
            <FirstComponent value={dayjs(selectedTramite?.fecha)} label="Fecha" />
          </Grid>
        </Grid>

        <br />

        {/* Ivas, Precintos,$ */}
        <Grid container spacing={1}>
          <Grid size={4}>
            {/* <ComponenteLista titulo="Sucursal" /> */}
            <ComponenteListaDinamica
              label="Sucursal"
              onChange={handleSucursalSelected}
              instruccionSQL="combo_sucursales"
              value={selectedTramite?.sucursal ? selectedTramite?.sucursal : sucursal}
              valueKey="sucursal"
              labelKey="nombre_sucursal"
              retornaObjeto={false}
              parametros={{
                '@cCentro': "'      1'"
              }}
              lEditando={!lEditando}
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
                          //onChange={setClave}
                          onChange={handleClaveSelected}
                          instruccionSQL="SELECT DISTINCT nombre_clave, clave_pedimento FROM Claves_Pedimentos ORDER BY nombre_clave"
                          value={selectedTramite?.clave_pedimento ? selectedTramite?.clave_pedimento : clave_pedimento}
                          valueKey="clave_pedimento"
                          labelKey="nombre_clave"
                          lEditando={!lEditando}
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
                          disabled={!lEditando}
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
                            open={openBusquedaClientePedimentoModal}
                            onClose={() => setOpenBusquedaClientePedimentoModal(false)}
                            onOpen={() => setOpenBusquedaClientePedimentoModal(true)}
                            onSelectedRow={handleRowSelectClientePedimento}
                            value={
                              selectedTramite?.ctePedimento
                                ? `${selectedTramite?.id_cliente_pedimento}-${selectedTramite.ctePedimento}`
                                : selectedTramite?.nombre_cliente_pedimento
                                  ? `${selectedTramite?.cliente_pedimento} - ${selectedTramite?.nombre_cliente_pedimento}`
                                  : clienteFolioPedimento != ''
                                    ? clienteFolioPedimento
                                    : ''
                            }
                            editando={!lEditando}
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
                      <Grid size={12}>
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
                            open={openBusquedaClienteFacturaModal}
                            onClose={() => setOpenBusquedaClienteFacturaModal(false)}
                            onOpen={() => setOpenBusquedaClienteFacturaModal(true)}
                            onSelectedRow={handleRowSelectClienteFacturacion}
                            value={
                              selectedTramite?.cteFacturacion
                                ? `${selectedTramite?.id_cliente_factura} - ${selectedTramite.cteFacturacion}`
                                : selectedTramite?.nombre_cliente_factura
                                  ? `${selectedTramite?.cliente_factura} - ${selectedTramite?.nombre_cliente_factura}`
                                  : clienteFolioFacturacion != ''
                                    ? clienteFolioFacturacion
                                    : ''
                            }
                            editando={!lEditando}
                            label="Cliente - Factura"
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
                            selectedTramite?.tipo_pago_impuestos?.includes('Financiado')
                              ? 'Financiado'
                              : selectedTramite?.tipo_pago_impuestos?.includes('Anticipo')
                                ? 'Anticipo'
                                : selectedTramite?.tipo_pago_impuestos?.includes('Transferencia')
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
                        <RowRadioButtonsGroup
                          titulo="Forma de Pago"
                          valor1="Transferencia de Cuenta"
                          valor2="Cheque"
                          value={formaPago}
                          onChange={handleFormaPago}
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
                      <Grid size={12}>
                        <br></br>
                        <ComponenteListaDinamica
                          label="Chequera"
                          onChange={handleChequeraSelected}
                          instruccionSQL="Combo_Chequeras"
                          value={selectedTramite?.chequera ? selectedTramite?.chequera : chequera}
                          valueKey="chequera"
                          labelKey="nombre_chequera"
                          retornaObjeto={false}
                          lEditando={!lEditando}
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
        <DataTable
          datos={selectedTramite?.history ? selectedTramite?.history : gastos}
          flag={selectedTramite?.history ? 'Gastos' : ''}
          onRowSelect={handleRowSelectGastos}
        />
      </Box>

      <Divider sx={{ my: 2 }} />
      {/* <Box sx={{ mt: 2 }}>
        <Typography variant="h4">Análisis de IA</Typography>
        <br />
        {cargandoIA ? (
          <Typography>Cargando análisis, por favor espera...</Typography>
        ) : (
          // <Typography sx={{ whiteSpace: 'pre-wrap' }}>{analisisIA}</Typography>
          <ReactMarkdown>
            {analisisIA}
          </ReactMarkdown>
        )}
      </Box> */}
      <br />
      <Stack direction="row">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex' }}>
            <Autoriza
              txtBoton="Autorizar Gastos"
              FolioAutorizacion="861"
              Tabla="Tramites_Aduanales"
              Folio={folio}
              Componente="est-cambios-tramites-aduanales"
              Color="success"
              onSelectRow={handleRowSelect}
              open={openAutoriza}
              onClose={() => {
                setOpenAutoriza(false);
              }}
              onOpen={() => {
                // La validación previa va aquí, justo antes de abrir la modal
                if (handleProcesoPrevio()) {
                  setOpenAutoriza(true); // Solo abre el modal si la validación es exitosa
                }
              }}
              onProcesoPosterior={handleProcesoPosterior}
            />
            &nbsp;
            {/* <Button variant="outlined" onClick={handleNuevo} color="primary">
              Nuevo Gasto
            </Button> */}
            <AltaYCambiosAGastosNoDeducibles
              open={openAltaYCambiosAGastosNoDeduciblesModal}
              onOpen={() => {
                //Si el tramite contiene Gastos No Deducibles
                // handleNuevo()
                setOpenAltaYCambiosAGastosNoDeduciblesModal(true);
              }}
              onClose={() => setOpenAltaYCambiosAGastosNoDeduciblesModal(false)}
              tramiteInfo={selectedTramite ? selectedTramite : {mensaje: "Información faltante"}}
            />
            &nbsp;
            <Button variant="outlined" onClick={handleCambiar} color="warning">
              Cambiar Gasto
            </Button>
            &nbsp;
            <Autoriza
              txtBoton="Borrar Gasto"
              FolioAutorizacion="1190"
              Tabla="Tramites_Aduanales"
              Folio={folio}
              Componente="est-cambios-tramites-aduanales"
              Color="error"
              onSelectRow={handleRowSelect}
              open={openAutorizaBorrar}
              onOpen={() => {
                // La validación previa va aquí, justo antes de abrir la modal
                if (handleProcesoPrevioBorrarGasto()) {
                  setOpenAutorizaBorrar(true); // Solo abre el modal si la validación es exitosa
                }
              }}
              onClose={() => {
                setOpenAutorizaBorrar(false);
              }}
              //onOpen={() => setOpenAutorizaBorrar(true)}
              onProcesoPosterior={handleProcesoPosterior}
            />
          </Box>
          <Box>
            {/* ⭐️ ESTE ES EL BOTÓN CORRECTO PARA ABRIR EL MODAL */}
            <Button variant="text" onClick={handleOpenHistoriaTramitesModal} color="success">
              Historia Trámite
            </Button>
            {/* ⭐️ ESTA ES LA LLAMADA CORRECTA AL COMPONENTE */}
            <HistoriaTramites
              open={openHistoriaTramitesModal}
              onClose={handleCloseHistoriaTramitesModal}
              gastosRow={gastosRowSelected}
              idTramite={folio}
            />
          </Box>
        </Box>
      </Stack>
      <br />
      <Stack direction="row">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex' }}>
            <Autoriza
              txtBoton="Borrar Trámite Aduanal"
              FolioAutorizacion="861"
              Tabla="Tramites_Aduanales"
              Folio={folio}
              Componente="est-cambios-tramites-aduanales"
              Color="error"
              onSelectRow={handleRowSelect}
              open={openAutorizaBorrarTA}
              onClose={() => {
                setOpenAutorizaBorrarTA(false);
              }}
              onOpen={() => {
                // La validación previa va aquí, justo antes de abrir la modal
                if (handleProcesoPrevioBorrarTA()) {
                  setOpenAutorizaBorrarTA(true); // Solo abre el modal si la validación es exitosa
                }
              }}
              onProcesoPosterior={handleProcesoPosteriorBorrarTA}
            />
          </Box>
        </Box>

        {/* <div>
            <Typography variant="h5">Modificación de Trámite #{folio}</Typography>
            
            <FileUploader onFileProcessed={handleFileAnalysis} />
            
            {analisisResultado && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', border: '1px solid #ddd' }}>
                <Typography variant="subtitle1">Datos Extraídos por IA (Revisar):</Typography>
                <pre>{JSON.stringify(analisisResultado, null, 2)}</pre>
              </Box>
            )}

          </div> */}
      </Stack>
      <Divider sx={{ my: 2 }} />
      {/* Botones */}
      <Stack direction="row">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box>
            <Button variant="contained" disabled={lEditando} onClick={handleIniciar}>
              Iniciar
            </Button>
            <Button variant="contained" disabled={!lEditando} onClick={handleGuardar}>
              Guardar
            </Button>
            {/* Botón de Gemini */}
            {/* <Button
              variant="contained"
              onClick={() => handleAnalisisIA('gemini')}
              disabled={cargandoIA || !selectedTramite}
              color="primary"
            >
              {cargandoIA ? 'Analizando...' : 'Analizar con Gemini'}
            </Button>
            &nbsp; */}
            {/* Nuevo botón de ChatGPT */}
            {/* <Button variant="contained" onClick={() => handleAnalisisIA('gpt')} disabled={cargandoIA || !selectedTramite} color="primary">
              {cargandoIA ? 'Analizando...' : 'Analizar con ChatGPT'}
            </Button> */}
            <Button variant="contained" disabled={!lEditando} onClick={handleCancelar} color="secondary">
              Cancelar
            </Button>
          </Box>
          <Box></Box>
        </Box>
      </Stack>
    </div>
  );
};

// Exportacion de componente EstCambiosTramitesAduanales
export default EstCambiosTramitesAduanales;
