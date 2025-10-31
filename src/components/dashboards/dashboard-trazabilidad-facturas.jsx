import React, { useEffect, useState, useCallback, useMemo } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import * as XLSX from 'xlsx';

//MUI
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';

//Ant design
import {
  DollarCircleOutlined,
  DatabaseOutlined,
  DollarOutlined,
  FileTextOutlined,
  NumberOutlined,
  ProfileOutlined,
  UnorderedListOutlined,
  FilePdfOutlined,
  CodeOutlined, // Reemplazo para FileXmlOutlined
  CheckCircleOutlined,
  WarningOutlined,
  FireOutlined as TrendingUp // Renombrado para la Card de distribución
} from '@ant-design/icons';

import LinearProgress from '@mui/material/LinearProgress';

import { FaFolderOpen } from 'react-icons/fa';

// Y si tu botón es de AntD:
//import { Button } from 'antd';

//Componentes propios del proyecto
import MainCard from '../MainCard.jsx';
import ReportCard from '../cards/estadisticas/ReportCard.jsx';
import GraficoDePastel from '../cards/estadisticas/GraficoDePastel.jsx';
// import GraficoDeBarras from '../cards/estadisticas/GraficoDeBarras.jsx';
import LineaDelTiempo2 from '../componentesBase/LineaDelTiempo2.jsx';
import LineaDelTiempo3 from '../componentesBase/LineaDelTiempo3.jsx';
import DataTable from '../componentesBase/DataTable3.jsx';
import TablaBase from '../componentesBase/TablaBase.jsx';
import MuiTablaBase from '../componentesBase/MuiTablaBase.jsx';
import MonedaFormatoMiles from '../componentesBase/MonedaFormatoMiles.jsx';

import useSQL from '../../hooks/useSQL.js';
import useDocumentDisplay from '../../hooks/useDocumentDisplay.js';
import { mensajes } from '../../utils/mensajes.js';

import ReactMarkdown from 'react-markdown';
import TablaColapsableTrazabilidadDashboard from '../componentesBase/TablaColapsableTrazabilidadDashboard.jsx';

//Componente
const DashboardTrazabilidadFacturas = () => {
  const { displayDocument, isLoading, error } = useDocumentDisplay();
  const [isInfoLoading, setIsInfoLoading] = useState(true);
  const navigate = useNavigate();
  const [cargandoIA, setCargandoIA] = useState(false);
  const [jsonIA, setJsonIA] = useState(true);
  const [analisisIA, setAnalisisIA] = useState('');
  const [eventos, setEventos] = useState([]);

  const [facturaAConsultar, setFacturaAConsultar] = useState(0);
  const [facturasRelacionadasUnicas, setFacturasRelacionadasUnicas] = useState(0);
  const [totalDistribuido, setTotalDistribuido] = useState(0);
  const [informacionDeFactura, setInformacionDeFactura] = useState({});
  const [filasDocumentosRelacionados, setFilasDocumentosRelacionados] = useState([]);

  const location = useLocation();

  const { executeFetch, data, loading } = useSQL();

  const traerInfoFactura = async () => {
    const objetoParametros = {
      '@nFactura': `'${facturaAConsultar}'` //167443 `'${facturaAConsultar}'`
    };

    const { data, success } = await executeFetch('Trazabilidad_Pagos_Facturas2', objetoParametros);
    console.log(success);
    console.log(data);
    console.log(isLoading);
    if (success) {
      setJsonIA(data[3][0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);

      //Datos para tabla crear hijos en tabla colapsable
      //   const filasDocumentosRelacionadosConGxcc = data[1].map((item) => {
      //     const itemsGxcc = data[4].filter((gxccItem) => gxccItem.tramite === item.tramite_aduanal);

      //     // Transforma los elementos coincidentes al formato deseado de gxcc
      //     const formattedGxcc = itemsGxcc.map((gxccItem) => ({
      //       'Fact. Prov': gxccItem.factura_prov, // Mapea factura_prov
      //       Concepto: gxccItem.concepto, // Mapea concepto
      //       'Nombre Concepto': gxccItem.nombre?.trim(), // Mapea nombre (y opcionalmente elimina espacios en blanco)
      //       'Extensión': gxccItem.extension,
      //       'Acción': gxccItem.documento // Mapea documento a Pdf (o cualquier propiedad que contenga el enlace/archivo PDF)
      //       // Puedes agregar más mapeos aquí si es necesario desde gxccItem
      //     }));

      //     // Devuelve el elemento original con la propiedad 'gxcc' añadida
      //     return {
      //       ...item, // Extiende las propiedades originales
      //       gxcc: formattedGxcc // Agrega el nuevo array gxcc
      //     };
      //   });
      //   setFilasDocumentosRelacionados(filasDocumentosRelacionadosConGxcc); // Establece los datos modificados
      // setFilasDocumentosRelacionados(data[1])

      // console.log('datos segundo arreglo', data[1]);
      // console.log('filasModificadas1',filasDocumentosRelacionadosModificado)
      //   console.log('complementos', data[4]);
      setFilasDocumentosRelacionados(data[1]);
      // console.log('eventos para timeline', data[2]);

      setEventos(data[2]);

      // let cantidadesTotalDistribuido = data[0].map((item) => {
      //   return item.total_movimiento;
      // });
      // console.log('sumatoria = ', cantidadesTotalDistribuido);
      // const sumatoriaCantidadTotalDistribuido = cantidadesTotalDistribuido.reduce((acumulador, sigValor) => acumulador + sigValor, 0);
      // console.log('sumatoria', sumatoriaCantidadTotalDistribuido);
      // setTotalDistribuido(sumatoriaCantidadTotalDistribuido);
      let totalFacturasRelacionadasEncontradas = data[0].map((item) => {
        return item.factura;
      });
      // console.log(totalFacturasRelacionadasEncontradas);
      const facturasNoRepetidas = [...new Set(totalFacturasRelacionadasEncontradas)];
      const cantidadFacturasNoRepetidas = facturasNoRepetidas.length;
      // console.log(facturasNoRepetidas.length);
      setFacturasRelacionadasUnicas(cantidadFacturasNoRepetidas);
      setInformacionDeFactura(data[0][0]);
      setIsInfoLoading(false);
    }
  };

  useEffect(() => {}, [filasDocumentosRelacionados]);

  //useEffect al montarse el componente
  useEffect(() => {
    const { rowInfo } = location.state || {};

    console.log('Informacion de fila:', rowInfo);
    // console.log(rowInfo.factura);
    // console.log(rowInfo?.factura);
    if (rowInfo?.factura) {
      // console.log('existe factura');
      setFacturaAConsultar(rowInfo.factura);
    } else {
      //No existe ficha de deposito,redirecciona a pantalla trazabilidad de pagos
      //   navigate('/trazabilidad-de-pagos');
      console.log('revisar informacion de factura');
    }
  }, []);

  //useEffect al montarse el componente
  useEffect(() => {
    console.log(facturaAConsultar);
    if (facturaAConsultar) {
      traerInfoFactura();
    }
  }, [facturaAConsultar]);

  const formatFecha = (isoString) => {
    if (!isoString) return '';
    const [year, month, day] = isoString.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  };

  const handleAnalisisIA = async (servicio) => {
    if (!facturaAConsultar) {
      mensajes('aviso', 'Debes seleccionar un trámite para analizar.');
      return;
    }

    // setServicioIA(servicio); // Si decides usar los botones de radio, no necesitas esta línea
    setCargandoIA(true);
    // console.log('factura a consultar', facturaAConsultar);
    const Params = {
      ficha_deposito: facturaAConsultar
    };
    const instruccionSQL = 'Trazabilidad_Pagos_Facturas2'; // El mismo SP que usas en handleFetch
    const parametros = Params; // Usa el folio del trámite seleccionado
    // const promptAI =
    //   'Analiza los datos de este trámite aduanal. Revisa los ingresos y gastos. Identifica cualquier inconsistencia, gasto inusualmente alto o bajo, y discrepancias en las fechas. Dame un resumen claro de los hallazgos y una recomendación para el siguiente paso en el proceso de auditoría.';
    const promptAI =
      '**AUDITORÍA EXPRESS: TRÁMITE ADUANAL**\n\n' +
      'Eres un auditor financiero externo de alto nivel. Analiza exclusivamente los datos aduanales y responde en **Markdown estricto** y ultra-conciso.\n' +
      'Tu audiencia (Alta Dirección/Auditores) requiere identificar el riesgo en menos de 30 segundos. **Máximo 150 palabras totales.**\n\n' +
      '**PREMISAS DE CÁLCULO:**\n' +
      '1. **Ingreso:** Únicamente `importe_ficha_deposito`.\n' +
      '2. **Gasto:** Sumatoria de `total_movimiento`.\n' +
      '3. **Ignorar:** Excluir `folio_CONTPAQ` y `fecha_CONTPAQ`.\n\n' +
      '**ENFOQUE EN RIESGO (Prioridad Máxima):**\n' +
      '1. **Políticas y Exportación:** Verificar si la póliza de la ficha de depósito (`poliza_ficha`) y su exportación (`numero_exportado_poliza_ficha`) existen y coinciden las fechas de registro y exportación.\n' +
      '2. **Discrepancias Monetarias:** Señalar inmediatamente si (Ingreso - Gasto) no coincide con `saldo_actual_ficha`, o si un gasto individual (`total_movimiento`) es atípico.\n' +
      '3. **Cronología Crítica:** Alertar sobre cualquier inversión temporal (ej. Gasto antes de Ingreso) o lapsos de tiempo excesivos (más de 15 días) entre fechas clave.\n' +
      '4. **Todo Bien:** Si no hay riesgos ni anomalías críticas, la primera sección debe ser **una sola oración** indicando conformidad.\n\n' +
      '**FORMATO DE SALIDA (Máximo 2 secciones):**\n' +
      '---\n' +
      '# 🚨 RIESGO AUDITORÍA: [FOLIO/NOMBRE DEL TRÁMITE]\n' +
      '---\n' +
      '## ⚠️ Hallazgos Clave y Puntos de Atención (Lista Concisa)\n' +
      '* **Póliza:** [Estado de las Pólizas y sus Exportaciones. Usar ✅ o ❌]\n' +
      '* **Balance:** [Discrepancia monetaria o conformidad del saldo. Usar el balance numérico clave (e.g., $5,400 de diferencia)]\n' +
      '* **Timing:** [Máximo desfase en días y entre qué fechas. Usar 🗓️]\n' +
      '* **Atípico:** [Gasto inusual si aplica, sino omitir]\n\n' +
      '## 🧭 Recomendación Auditora (Una Sentencia)\n' +
      '[Acción clara y directa: requerir documentación faltante, cerrar trámite o investigar $X.]';

    const promptAIPrueba =
      'AUDITORÍA EXPRESS: FACTURACIÓN Y COBRANZA\n\n' +
      'Eres un auditor financiero externo de alto nivel. Analiza exclusivamente los datos de la factura principal y su array de pagos/aplicaciones (detalle_documentos). Responde en responde en **Markdown estricto** y ultra-conciso. Tu audiencia (Alta Dirección/Auditores) requiere identificar el riesgo en menos de 30 segundos. Máximo 150 palabras totales.\n\n' +
      'PREMISAS DE CÁLCULO:\n' +
      '1. Total Pagado: Sumatoria de importe de todos los objetos en detalle_documentos.\n' +
      '2. Total Factura: Usar total (o total_me si moneda != "MXP").\n' +
      '3. Validación Saldo: Comparar (Total Factura - Total Pagado) con el saldo_actual de la factura.\n\n' +
      'ENFOQUE EN RIESGO (Prioridad Máxima):\n' +
      '1. Discrepancias de Saldo: Señalar inmediatamente si (Total Factura - Total Pagado) NO coincide con saldo_actual. Usar el valor numérico de la diferencia.\n' +
      '2. Póliza Principal: Verificar si la factura principal tiene poliza, numero_exportado y fecha_aplicada (de la póliza) registrados. Usar ✅/❌.\n' +
      '3. Cronología Crítica: Alertar si el lapso entre fecha_factura y el primer fecha_aplicado (del detalle) excede los 15 días o si las fechas de póliza son ilógicas.\n' +
      '4. Total Conformidad: Si no hay riesgos ni anomalías críticas (saldo coincide, póliza existe y es oportuna), la primera sección debe ser una sola oración indicando conformidad.\n\n' +
      'FORMATO DE SALIDA (Máximo 2 secciones):\n' +
      '---\n' +
      '# 🚨 RIESGO AUDITORÍA: [uuid DE LA FACTURA]\n' +
      '---\n' +
      '## ⚠️ Hallazgos Clave y Puntos de Atención (Lista Concisa)\n' +
      '* Balance: [Discrepancia monetaria o conformidad del saldo. Usar el balance numérico clave (e.g., $5,400 de diferencia)]\n' +
      '* Póliza Principal: [Estado de la póliza de la factura principal. Usar ✅ o ❌]\n' +
      '* Timing Aplicación: [Máximo desfase en días (e.g., +21 días) entre facturación y primer pago. Usar 🗓️]\n\n' +
      '## 🧭 Recomendación Auditora (Una Sentencia)\n' +
      '[Acción clara y directa: Cierre conforme, investigar diferencia de $X, o requerir registro contable.]';

    const promptAI2 =
      '**TAREA DE ANÁLISIS FINANCIERO ADUANAL** ' +
      'Analiza detalladamente los datos de este trámite aduanal, arrojando unicamente la información relevante en dos párrafos, ' +
      'teniendo en cuenta que esta información será revisada por alta dirección y auditor externo, es decir, personas con tiempo limitado. ' +
      'Revisa exhaustivamente los **ingresos y gastos**.' +
      'PREMISAS ' +
      '1.- Tener en cuenta que el total distribuído es la sumatoria de total_movimiento, está indicada en pesos. ' +
      ' La comparación de ingresos y gastos se debe basar en unicamente en importe_ficha_deposito como el unico importe de ingresos, ' +
      'y la sumatoria de total_movimiento es el unico elemento a considerar como gasto.  Los otros elementos con importes son solamente referencias. ' +
      '2.- Los elementos folio_CONTPAQ y fecha_CONTPAQ son elementos que no se deben contemplar por el momento, ya que estamos en fase de pruebas con estos elementos' +
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
      '## 📈 Puntos Críticos' +
      '* **Ingresos/Gastos:** Ofrece una breve comparación y un balance.' +
      '* **Gastos Atípicos:** Si encuentras gastos inusuales, usa un subtítulo con `### Gasto con Alerta: [NOMBRE DEL GASTO]`.' +
      '## ✅ Recomendaciones inmediatas' +
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
          promptAI: promptAIPrueba
          //   promptAI: promptAI
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

  const handleViewPDF = useCallback((documento) => {
    // La estructura es documento.pdf.data
    const bufferData = documento.pdf.data; // 👈 Accedemos al array de bytes

    if (!bufferData || bufferData.length === 0) {
      console.error('Los datos binarios del PDF están vacíos.');
      // Notificación de error si usas Notistack
      return;
    }

    // 1. Convertir el array de números (bytes) en un Typed Array (Uint8Array)
    // Esto es el formato binario que el Blob espera.
    const byteArray = new Uint8Array(bufferData);

    // 2. Crear un objeto Blob con el Array Binario
    // Usamos 'application/pdf' como MIME type
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // 3. Crear una URL de objeto temporal
    const url = URL.createObjectURL(blob);

    // 4. Abrir la nueva pestaña
    const newWindow = window.open(url, '_blank');

    // OPCIONAL: Liberación de memoria
    if (newWindow) {
      newWindow.onload = () => {
        URL.revokeObjectURL(url);
      };
    } else {
      console.error('No se pudo abrir la nueva ventana. Verifique el bloqueador de pop-ups.');
    }
  }, []);

  const handleViewXML = useCallback((documento) => {
    // 1. Obtener el contenido del XML
    const xmlContent = documento.xml;

    if (!xmlContent) {
      mensajes('error', "El campo 'documento.xml' está vacío.");
      // Opcional: Mostrar una notificación al usuario (con Notistack, por ejemplo)
      return;
    }

    // 2. Crear un objeto Blob con el contenido XML
    // 'text/xml' es el MIME type correcto para archivos XML.
    const blob = new Blob([xmlContent], { type: 'text/xml' });

    // 3. Crear una URL de objeto temporal
    // Esta URL es un enlace interno que el navegador puede usar para acceder al Blob.
    const url = URL.createObjectURL(blob);

    // 4. Abrir la nueva pestaña
    const newWindow = window.open(url, '_blank');

    // OPCIONAL: Liberar la URL temporal cuando la ventana se cierre (aunque el navegador lo gestiona a menudo)
    if (newWindow) {
      newWindow.onload = () => {
        // No es estrictamente necesario, pero es buena práctica de limpieza
        URL.revokeObjectURL(url);
      };
    } else {
      // En caso de que un bloqueador de pop-ups lo impida
      // console.error("No se pudo abrir la nueva ventana. Verifique el bloqueador de pop-ups.");
      mensajes('error', 'No se pudo abrir la nueva ventana. Verifique el bloqueador de pop-ups.');
    }
  }, []);

  const AccionesCellRenderer = useCallback(
    (documento) => {
      const handleViewFacturaPDF = () => {
        // ...
        displayDocument({
          instruccionSQL: '[Trae_PDF_GXCC]',
          parametros: {
            // ELIMINAR LAS COMILLAS SIMPLES
            '@cExtension': documento.Extensión, // ✅
            '@nFolio': documento.Acción // ✅
          },
          tipoArchivo: 'pdf'
        });
      };

      const handleViewPedimentoRefactored = () => {
        // ...
        displayDocument({
          instruccionSQL: '[Trae_PDF_pedimento_ADN]',
          parametros: {
            // ELIMINAR LAS COMILLAS SIMPLES
            nFolio: `'${documento.id_pedimento}'`
          },
          tipoArchivo: 'pdf'
        });
      };

      return (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button
            //onClick={handleViewFacturaPDF} // ¡Usa la nueva función!
            onClick={() => handleViewPDF(documento)}
            variant="text"
            size="small"
            title={`Ver PDF de Folio ${documento.factura}`}
            disabled={!documento.xml} // Mantenemos la funcionalidad de deshabilitación original
            style={{
              color: documento.xml ? '#E53935' : '#BDBDBD'
            }}
          >
            <FilePdfOutlined style={{ fontSize: '18px' }} />
          </Button>
          <Button
            //onClick={handleViewFacturaXML} // ¡Usa la nueva función!
            onClick={() => handleViewXML(documento)}
            variant="text"
            size="small"
            title={`Ver XML de Folio ${documento.factura}`}
            disabled={!documento.xml}
            style={{
              color: documento.xml ? '#00BCD4' : '#BDBDBD'
            }}
          >
            <CodeOutlined style={{ fontSize: '18px' }} />
          </Button>
          <Button
            onClick={handleViewPedimentoRefactored} // ¡Usa la nueva función!
            variant="text"
            size="small"
            title={`Ver PDF Pedimento`}
            disabled={!(documento.id_pedimento > 0)}
            style={{
              color: documento.id_pedimento > 0 ? '#94d400ff' : '#BDBDBD'
            }}
          >
            <FaFolderOpen style={{ fontSize: '18px' }} />
          </Button>
        </div>
      );
    },
    // Es CRUCIAL que dependa del nuevo hook, no de las funciones eliminadas
    [displayDocument]
  );

  // ... (Asegúrate de que la dependencia del useMemo de columnsConfig también se actualice)
  const columnsConfig = useMemo(
    () => [
      // ...
    ],
    [AccionesCellRenderer] // Correcto: AccionesCellRenderer ya depende de displayDocument
  );

  const handleShowPDFGXCCIntegrado = useCallback(
    async (rowData) => {
      displayDocument({
        instruccionSQL: 'Trae_PDF_GXCC',
        parametros: {
          '@cExtension': `'${rowData.Extensión}'`,
          '@nFolio': `'${rowData.Acción}'`
        },
        tipoArchivo: rowData.Extensión === 'PDF' ? 'pdf' : rowData.Extensión === 'XML' ? 'xml' : 'other'
      });
    },
    [displayDocument]
  );

  // **IMPORTANTE**: Debes asegurarte de pasar `handleShowPDFGXCCIntegrado`
  // como prop al componente `<TablaColapsableTrazabilidadDashboard.jsx>`
  // si es allí donde se usan los botones de acción para los documentos ligados a conceptos.

  // --- Configuración de Columnas para la Tabla ---
  const columnsConfig2 = useMemo(
    () => [
      { headerName: 'Tipo', field: 'tipo' },
      { headerName: 'Folio', field: 'factura' },
      { headerName: 'Fiscal', field: 'fiscal' },
      { headerName: 'Fecha', field: 'fecha_factura' },
      { headerName: 'UUID', field: 'uuid_funcion' },
      { headerName: 'Total', field: 'total_factura', cellRenderer: (row) => <MonedaFormatoMiles cantidad={row.total_factura} /> },
      {
        headerName: 'Saldo Actual',
        field: 'saldo_actual_factura',
        cellRenderer: (row) => <MonedaFormatoMiles cantidad={row.saldo_actual_factura} />
      },
      { headerName: 'Moneda', field: 'moneda' },
      {
        headerName: 'Total Movimiento',
        field: 'total_movimiento',
        cellRenderer: (row) => <MonedaFormatoMiles cantidad={row.total_movimiento} />
      },
      {
        headerName: 'Acciones',
        field: 'acciones_renderer',
        cellRenderer: AccionesCellRenderer,
        sortable: false,
        filterable: false,
        valueGetter: () => null,
        width: 80,
        align: 'center',
        headerAlign: 'center'
      },
      {
        headerName: 'Documentos Ligados a Conceptos de Facturas',
        collapsibleField: 'gxcc',
        onDocumentClick: handleShowPDFGXCCIntegrado // ✅ Usa un nombre claro
      }
    ],
    [AccionesCellRenderer, handleShowPDFGXCCIntegrado]
  );

  const handleExportToExcel = () => {
    if (!filasDocumentosRelacionados || filasDocumentosRelacionados.length === 0) {
      mensajes('aviso', 'No hay datos para exportar.');
      return;
    }

    // Prepara los datos para exportar: mapea solo los campos visibles/exportables
    const headersMap = {
      tipo: 'Tipo',
      factura: 'Folio',
      fiscal: 'Fiscal',
      fecha_factura: 'Fecha',
      uuid_funcion: 'UUID',
      total_factura: 'Total',
      saldo_actual_factura: 'Saldo Actual',
      moneda: 'Moneda',
      total_movimiento: 'Total Movimiento',
      cntDoctos: 'test1'
      // Acciones no se exporta
    };

    const dataToExport = filasDocumentosRelacionados.map((row) => ({
      ...row,
      // Formatea números si es necesario (opcional)
      total_factura: Number(row.total_factura),
      saldo_actual_factura: Number(row.saldo_actual_factura),
      total_movimiento: Number(row.total_movimiento)
    }));
    console.log('data to export', dataToExport);
    // Extrae solo las columnas que queremos, mapeadas a nombres amigables
    const worksheetData = dataToExport.map((row) => {
      console.log('Data to export map', row);
      const mapped = {};
      Object.keys(headersMap).forEach((key) => {
        mapped[headersMap[key]] = row[key];
      });
      return mapped;
    });

    // Creacion de hoja y libro
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Documentos Relacionados');

    // Trigger download
    XLSX.writeFile(workbook, `Documentos_Relacionados_Deposito_${facturaAConsultar}.xlsx`);
  };

  //   const handleShowPDFGXCC = useCallback( async(rowData) => {

  //     const Params = {
  //       cExtension: `'${rowData.Extensión}'`,
  //       nFolio: `'${rowData.Acción}'`

  //     };

  //     const pdfObject = await traePedimento(Params, 'GXCC');

  //     let bufferData, byteArray , blob//, url, newindow
  //     let base64String = null;

  //     if (rowData.Extensión ==='CFDI')
  //     {
  //        bufferData = pdfObject?.data || pdfObject;

  //       if (!bufferData || bufferData.length === 0) {
  //         console.error('Los datos binarios del PDF están vacíos.');
  //         return;
  //       }

  //        byteArray = new Uint8Array(bufferData);

  //        blob = new Blob([byteArray], { type: 'application/pdf' });

  //     } else if(rowData.Extensión !=='CFDI'){

  //       if (typeof pdfObject === 'string') {
  //         base64String = pdfObject;
  //       }// Opción B: Si 'traePedimento' devuelve un objeto y necesitas acceder a una propiedad,
  //       // por ejemplo, si tu DB columna se llama 'PDF_DATA'
  //       else if (pdfObject && pdfObject.PDF_DATA) { // **AJUSTAR ESTE NOMBRE DE PROPIEDAD**
  //           base64String = pdfObject.PDF_DATA;
  //       }
  //       // Opción C: Si viene como un objeto JSON con la estructura del Buffer de Node.js
  //       else if (pdfObject && pdfObject.data) {
  //           // En este caso, si tu backend NO está codificando a Base64 y simplemente
  //           // está serializando el Buffer de Node.js, tendrías que usarlo como array.
  //           // Pero como estamos en la Opción 2, asumiremos que no es el caso.
  //           base64String = pdfObject.data;
  //       }

  //         if (!base64String || typeof base64String !== 'string') {
  //           console.error('No se recibió una cadena Base64 válida. Tipo recibido:', typeof base64String, 'Valor:', base64String);
  //           alert('Error al cargar el archivo. El formato de datos es incorrecto.');
  //           return;
  //       }

  //       // 💡 PASO CLAVE: Decodificar y convertir (esta lógica es correcta si base64String es válida)
  //       try {
  //           const binaryString = atob(base64String);

  //           const bufferData = new Uint8Array(binaryString.length);
  //           for (let i = 0; i < binaryString.length; i++) {
  //               bufferData[i] = binaryString.charCodeAt(i);
  //           }

  //           blob = new Blob([bufferData], { type: 'application/pdf' });
  //           } catch (e) {
  //           console.error('Error durante la decodificación Base64 o creación del Blob:', e);
  //           alert('Error de decodificación. Verifique que el servidor envíe Base64 válido.');
  //       }
  //     }
  //     const url = URL.createObjectURL(blob);

  //     const newWindow = window.open(url, '_blank');

  //     if (newWindow) {
  //       newWindow.onload = () => {
  //         URL.revokeObjectURL(url);
  //       };
  //     } else {
  //       console.error('No se pudo abrir la nueva ventana. Verifique el bloqueador de pop-ups.');
  //     }
  // }, []);

  if (!isInfoLoading) {
    return (
      <Box style={{ cursor: cargandoIA ? 'wait' : 'default' }} sx={{ backgroundColor: '' }}>
        <Typography variant="h2">Dashboard de Trazabilidad de Facturas</Typography>
        <br />
        <Divider />
        <br />
        {/* Reporte */}
        <Stack sx={{ backgroundColor: '' }} spacing={4}>
          {/* Encabezado */}
          <Box>
            <Typography variant="h3" align="center">
              Trazabilidad de Factura #<span>{informacionDeFactura?.factura}</span>
            </Typography>
            <Typography variant="h5" align="center">
              Cliente: <span>{informacionDeFactura?.cliente}</span> | Fecha:{' '}
              {/* <span>{formatFecha(informacionDeFactura?.fecha_aplicada)}</span> */}
              <span>{informacionDeFactura?.fecha_factura}</span>
            </Typography>
          </Box>
          {/* Cards */}
          <Box sx={{ backgroundColor: '', height: '100%' }} component="section">
            <Grid sx={{ height: '100%' }} container spacing={2}>
              <Grid sx={{ height: '100%', width: '100%' }} size={{ sm: 12, md: 12, lg: 4 }}>
                {/* Card 1 */}
                <MainCard sx={{ height: '100%', '&:hover': { boxShadow: 15 } }} title="Resumen de la factura">
                  <Stack spacing={1}>
                    <ReportCard
                      primary={
                        informacionDeFactura?.subtotal || informacionDeFactura?.subtotal == 0 ? (
                          <MonedaFormatoMiles
                            moneda={informacionDeFactura?.moneda}
                            cantidad={informacionDeFactura?.subtotal}
                            etiquetaHTML={'h3'}
                          />
                        ) : (
                          'N/A'
                        )
                      }
                      secondary="Subtotal"
                      color="secondary.main"
                      iconPrimary={DollarOutlined}
                    />
                    <ReportCard
                      //primary={facturasRelacionadasUnicas ? facturasRelacionadasUnicas : 'N/A'}
                      primary={
                        informacionDeFactura?.iva ? (
                          <MonedaFormatoMiles
                            moneda={informacionDeFactura?.moneda}
                            cantidad={informacionDeFactura?.iva}
                            etiquetaHTML={'h3'}
                          />
                        ) : (
                          'N/A'
                        )
                      }
                      secondary="IVA"
                      color="secondary.main"
                      iconPrimary={DollarOutlined}
                      etiquetaHtml="h3"
                    />
                    <ReportCard
                      primary={
                        informacionDeFactura?.total ? (
                          <MonedaFormatoMiles
                            moneda={informacionDeFactura?.moneda}
                            cantidad={informacionDeFactura?.total}
                            etiquetaHTML={'h3'}
                          />
                        ) : (
                          'N/A'
                        )
                      }
                      secondary="Total"
                      color="secondary.main"
                      iconPrimary={DollarOutlined}
                      bgColoR={'#2636eaff'}
                    />
                    <ReportCard
                      primary={
                        informacionDeFactura?.total ? (
                          <MonedaFormatoMiles
                            moneda={informacionDeFactura?.moneda}
                            cantidad={informacionDeFactura?.saldo_actual}
                            etiquetaHTML={'h3'}
                          />
                        ) : (
                          'N/A'
                        )
                      }
                      secondary="Saldo actual"
                      color="secondary.main"
                      iconPrimary={DollarOutlined}
                      bgColoR={'#2636eaff'}
                    />
                  </Stack>
                </MainCard>
              </Grid>
              <Grid sx={{ height: '100%', width: '100%' }} size={{ sm: 12, lg: 4 }}>
                {/* Card 2 */}
                <MainCard sx={{ height: '100%', '&:hover': { boxShadow: 15 } }} title="Distribución">
                  <Stack spacing={1}>
                    <GraficoDePastel
                      cantidad1={informacionDeFactura?.iva}
                      cantidad2={informacionDeFactura?.subtotal}
                      cantidad3={informacionDeFactura?.importe_gasto_tramite}
                      moneda={informacionDeFactura?.moneda}
                    />
                  </Stack>
                </MainCard>
              </Grid>
              <Grid sx={{ height: '100%', width: '100%' }} size={{ sm: 12, md: 12, lg: 4 }}>
                {/* Card 3 */}
                <MainCard sx={{ height: '100%', '&:hover': { boxShadow: 15 } }} title="Documentos Clave">
                  <Stack spacing={1}>
                    <ReportCard
                      primary={informacionDeFactura?.fiscal ? informacionDeFactura?.fiscal : 'N/A'}
                      secondary="Fiscal"
                      color="secondary.main"
                      iconPrimary={FileTextOutlined}
                    />
                    <ReportCard
                      sx={{ backgroundColor: 'red' }}
                      primary={informacionDeFactura?.uuid ? informacionDeFactura?.uuid : 'N/A'}
                      secondary="UUID"
                      color="secondary.main"
                      iconPrimary={ProfileOutlined}
                    />
                    <ReportCard
                      primary={informacionDeFactura?.poliza ? informacionDeFactura?.poliza : 'N/A'}
                      secondary="Folio CONTPAQ"
                      color="secondary.main"
                      iconPrimary={DatabaseOutlined}
                    />
                    <ReportCard
                      primary={informacionDeFactura?.poliza ? informacionDeFactura?.poliza : 'N/A'}
                      secondary="Número exportado"
                      color="secondary.main"
                      iconPrimary={DatabaseOutlined}
                    />
                  </Stack>
                </MainCard>
              </Grid>
            </Grid>
          </Box>
          <Divider />

          {/* Documentos Relacionados */}
          <Box component="section">
            <Box>
              <Typography variant="h3">Documentos Relacionados</Typography>
            </Box>

            {/* Boton de exportar */}
            <Button
              sx={{ marginTop: '4px', marginBottom: '12px', display: 'none' }}
              variant="outlined"
              color="primary"
              size="medium"
              onClick={handleExportToExcel}
              disabled={loading}
            >
              Exportar a Excel
            </Button>
            <br />
            <Grid container spacing={2}>
              <Grid size={12}>
                <Box sx={{ backgroundColor: 'gray' }}></Box>
                <br />
                {/* <TablaColapsableTrazabilidadDashboard
                  data={filasDocumentosRelacionados}
                  columnsConfig={columnsConfig2}
                  onPdfIconClick={handleShowPDFGXCCIntegrado}
                /> */}
                {filasDocumentosRelacionados && filasDocumentosRelacionados.length > 0 ? (
                  <MuiTablaBase
                    seleccionable={true} //Valor puede ser true o false
                    encabezadoSeleccionable="Acciones" //Nombre de la columna
                    idPropiedad={'documento'} //Identificador de documentos relacionados
                    datos={filasDocumentosRelacionados}
                    estructuraEncabezados={[
                      { propiedad: 'tipo_movimiento', encabezadoTitulo: 'Movimiento' },
                      { propiedad: 'documento', encabezadoTitulo: 'Documento' },
                      { propiedad: 'fiscal', encabezadoTitulo: 'Fiscal' },
                      { propiedad: 'fecha_documento', encabezadoTitulo: 'Fecha' },
                      { propiedad: 'folio_electronico', encabezadoTitulo: 'Folio Electrónico' },
                      { propiedad: 'importe', encabezadoTitulo: 'Importe', formato: 'moneda' },
                      { propiedad: 'moneda', encabezadoTitulo: 'Moneda' }
                    ]}
                  />
                ) : (
                  <Typography variant="p">No se encontraron documentos relacionados.</Typography>
                )}
              </Grid>
            </Grid>
          </Box>
          <Divider />
          {/* Secuencia de Eventos */}
          <Box component="section">
            <Box>
              <Typography variant="h3">Secuencia de Eventos</Typography>
            </Box>
            <br />
            <Grid container spacing={2}>
              <Grid sx={{ alignItems: 'left', backgroundColor: '' }} size={12}>
                {/* <LineaDelTiempo />*/}
                {/* <LineaDelTiempo2 events={eventos} />  */}
                <LineaDelTiempo3 events={eventos} />
              </Grid>
              {/* <Grid size={6}>...</Grid> */}
            </Grid>
          </Box>
          <br />
          <Divider />
          {/* Analisis IA */}
          <Box align="center" component={'section'}>
            {/* <Button
    variant="outlined"
    sx={{
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: 'primary',
      boxShadow: '0 0 10px primary',
      animation: 'glowWave 2s infinite ease-in-out',
      '@keyframes glowWave': {
        '0%': {
          boxShadow: '0 0 10px #6692da',
        },
        '50%': {
          boxShadow: '0 0 20px  #6692da',
        },
        '100%': {
          boxShadow: '0 0 10px #6692da',
        },
      },
    }}
  >
    Analizar con IA
  </Button> */}

            <Button
              variant="contained"
              onClick={() => handleAnalisisIA('gemini')}
              startIcon={cargandoIA ? <CircularProgress size={20} /> : null}
              disabled={cargandoIA}
              color="primary"
            >
              {cargandoIA ? 'Analizando...' : 'Analizar con IA'}
            </Button>

            <Box sx={{ mt: 2 }}>
              {/* <Typography variant="h4">Análisis de IA</Typography> */}
              <br />
              {cargandoIA ? (
                <Typography>Cargando análisis, por favor espera...</Typography>
              ) : (
                // <Typography sx={{ whiteSpace: 'pre-wrap' }}>{analisisIA}</Typography>
                <Box
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'primary.800' // Dark background from your primary scale
                        : 'primary.50', // Light blue tint for light mode
                    borderRadius: '12px',
                    border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'primary.600' : 'primary.200'}`,
                    p: { xs: 2, sm: 3 },
                    my: 2,
                    boxShadow: (theme) =>
                      theme.palette.mode === 'dark' ? '0px 4px 12px rgba(0, 0, 0, 0.5)' : '0px 4px 12px rgba(0, 52, 93, 0.1)', // Soft shadow using your main blue
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '4px',
                      height: '100%',
                      backgroundColor: 'primary.main' // Vertical accent bar
                    },
                    '& .react-markdown': {
                      fontSize: '0.95rem',
                      color: (theme) => (theme.palette.mode === 'dark' ? 'grey.A100' : 'text.primary'),
                      lineHeight: 1.7
                    },
                    '& .react-markdown h1, & .react-markdown h2': {
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      mb: 1,
                      color: (theme) => theme.palette.primary.main
                    },
                    '& .react-markdown p': {
                      mt: 1,
                      mb: 1.5
                    },
                    '& .react-markdown ul, & .react-markdown ol': {
                      ml: 2.5,
                      mt: 1,
                      mb: 1.5
                    },
                    '& .react-markdown code': {
                      backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100'),
                      px: '6px',
                      py: '2px',
                      borderRadius: '6px',
                      fontSize: '0.9em'
                    },
                    '& .react-markdown pre': {
                      backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50'),
                      p: 2,
                      borderRadius: '8px',
                      overflowX: 'auto',
                      my: 2,
                      fontSize: '0.85rem'
                    }
                  }}
                >
                  <Box sx={{ pl: 1 }}>
                    <Typography
                      variant="h3"
                      component="div"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 600,
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      📊 Análisis IA
                    </Typography>
                    <ReactMarkdown>{analisisIA}</ReactMarkdown>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Stack>
      </Box>
    );
  } else {
    return (
      <>
        <LinearProgress />

        <h2 style={{ textAlign: 'center' }}>Cargando...</h2>
        {/* <Skeleton variant='text'/> */}
        {/* <Skeleton variant="circular" width={40} height={40} /> */}
        {/* <Skeleton variant="rectangular" width={210} height={60} /> */}
        {/* <div style={{display:'flex', alignItems:'center', flexDirection:'column'}}> */}
        {/* <Skeleton variant="rounded" width='50%' height='20vh' /> */}
        {/* <Skeleton variant='text' width='30%'/> */}
        {/* <Skeleton variant='text' width='30%'/> */}
        {/* <Skeleton variant='text' width='30%'/> */}
        {/* </div> */}
      </>
    );
  }
};

//Exportar componente
export default DashboardTrazabilidadFacturas;
