import React, { useEffect, useState, useCallback, useMemo } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import useSQL from '../../hooks/useSQL.js';
import useDocumentDisplay from '../../hooks/useDocumentDisplay.js';

import * as XLSX from 'xlsx';

//MUI
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';

//Ant design
import {
  EyeOutlined,
  DatabaseOutlined,
  DollarOutlined,
  FileTextOutlined,
  NumberOutlined,
  ProfileOutlined,
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
import GraficoDeBarras from '../cards/estadisticas/GraficoDeBarras.jsx';
import LineaDelTiempo3 from '../componentesBase/LineaDelTiempo3.jsx';
import DataTable from '../componentesBase/DataTable3.jsx';
import TablaBase from '../componentesBase/TablaBase.jsx';

import MonedaFormatoMiles from '../componentesBase/MonedaFormatoMiles.jsx';

import { mensajes } from '../../utils/mensajes.js';

import ReactMarkdown from 'react-markdown';
import TablaColapsableTrazabilidadDashboard from '../componentesBase/TablaColapsableTrazabilidadDashboard.jsx';


//Componente
const DashboardTrazabilidadPagos = () => {
  const { displayDocument, isLoading, error } = useDocumentDisplay();
  const [isInfoLoading, setIsInfoLoading] = useState(true);
  const navigate = useNavigate();
  const [cargandoIA, setCargandoIA] = useState(false);
  const [jsonIA, setJsonIA] = useState(true);
  const [analisisIA, setAnalisisIA] = useState('');
  const [eventos, setEventos] = useState([]);

  const [folioDepositoAConsultar, setFolioDepostioAConsultar] = useState(0);
  const [facturasRelacionadasUnicas, setFacturasRelacionadasUnicas] = useState(0);
  const [totalDistribuido, setTotalDistribuido] = useState(0);
  const [informacionDelDeposito, setInformacionDelDeposito] = useState({});
  const [filasDocumentosRelacionados, setFilasDocumentosRelacionados] = useState([]);

  const location = useLocation();

  const { executeFetch, data, loading } = useSQL();

  // ✅ SOLUCIÓN MÁS PROBABLE (Desestructuración)
  //const { GoogleGenAI } = require("@google/genai"); 
  

  // ... luego en tu código:
  //ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const traerInfoDeDeposito = async () => {
    const objetoParametros = {
      '@nFicha_Deposito': `'${folioDepositoAConsultar}'` //167443 `'${folioDepositoAConsultar}'`
    };

    const { data, success } = await executeFetch('Trazabilidad_Pagos2', objetoParametros);
    console.log(success);
    console.log(isLoading);
    if (success) {
      setJsonIA(data[2][0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);

      const filasDocumentosRelacionadosConGxcc = data[1].map((item) => {
        const itemsGxcc = data[4].filter((gxccItem) => gxccItem.tramite === item.tramite_aduanal);

        // Transforma los elementos coincidentes al formato deseado de gxcc
        const formattedGxcc = itemsGxcc.map((gxccItem) => ({
          'Fact. Prov': gxccItem.factura_prov, // Mapea factura_prov
          Concepto: gxccItem.concepto, // Mapea concepto
          'Nombre Concepto': gxccItem.nombre?.trim(), // Mapea nombre (y opcionalmente elimina espacios en blanco)
          'Tipo ': gxccItem.extension,
          Acción: gxccItem.documento // Mapea documento a Pdf (o cualquier propiedad que contenga el enlace/archivo PDF)
          // Puedes agregar más mapeos aquí si es necesario desde gxccItem
        }));

        // Devuelve el elemento original con la propiedad 'gxcc' añadida
        return {
          ...item, // Extiende las propiedades originales
          gxcc: formattedGxcc // Agrega el nuevo array gxcc
        };
      });

      setFilasDocumentosRelacionados(filasDocumentosRelacionadosConGxcc); // Establece los datos modificados

      // setFilasDocumentosRelacionados(data[1])
      console.log('abcabc', data[4]);
      // console.log('filasModificadas1',filasDocumentosRelacionadosModificado)
      console.log('complementos', data[4]);
      console.log('eventos para timeline', data[3]);

      setEventos(data[3]);

      let cantidadesTotalDistribuido = data[0].map((item) => {
        return item.total_movimiento;
      });
      console.log('sumatoria = ', cantidadesTotalDistribuido);
      const sumatoriaCantidadTotalDistribuido = cantidadesTotalDistribuido.reduce((acumulador, sigValor) => acumulador + sigValor, 0);
      console.log('sumatoria', sumatoriaCantidadTotalDistribuido);
      setTotalDistribuido(sumatoriaCantidadTotalDistribuido);
      let totalFacturasRelacionadasEncontradas = data[0].map((item) => {
        return item.factura;
      });
      console.log(totalFacturasRelacionadasEncontradas);
      const facturasNoRepetidas = [...new Set(totalFacturasRelacionadasEncontradas)];
      const cantidadFacturasNoRepetidas = facturasNoRepetidas.length;
      console.log(facturasNoRepetidas.length);
      setFacturasRelacionadasUnicas(cantidadFacturasNoRepetidas);
      setInformacionDelDeposito(data[0][0]);
      setIsInfoLoading(false);
    }
  };

  //useEffect al montarse el componente
  useEffect(() => {
    const { rowInfo } = location.state || {};

    console.log('Received rowInfo:', rowInfo);
    if (rowInfo?.ficha_deposito) {
      setFolioDepostioAConsultar(rowInfo.ficha_deposito);
    } else {
      //No existe ficha de deposito,redirecciona a pantalla trazabilidad de pagos
      navigate('/trazabilidad-de-pagos');
    }
  }, []);

  //useEffect al montarse el componente
  useEffect(() => {
    if (folioDepositoAConsultar) {
      traerInfoDeDeposito();
    }
  }, [folioDepositoAConsultar]);

  const formatFecha = (isoString) => {
    if (!isoString) return '';
    const [year, month, day] = isoString.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  };

  const handleAnalisisIA = async (servicio) => {
    if (!folioDepositoAConsultar) {
      mensajes('aviso', 'Debes seleccionar un trámite para analizar.');
      return;
    }

    // setServicioIA(servicio); // Si decides usar los botones de radio, no necesitas esta línea
    setCargandoIA(true);
    console.log('iaiaia', folioDepositoAConsultar);
    const Params = {
      ficha_deposito: folioDepositoAConsultar
    };
    const instruccionSQL = 'Trazabilidad_Pagos2'; // El mismo SP que usas en handleFetch
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


  const handleVerFactura = useCallback((documento)=>{
     console.log('hello World desde dashboard trazabilidad')
          console.log(documento.factura)
          console.log(documento)
          const rowInfo = {factura:documento.factura}
          navigate('/dashboard-trazabilidad-facturas', { state: { rowInfo } });
  },[])


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

          <Button
            onClick={()=>handleVerFactura(documento)} // ¡Usa la nueva función!
            variant="text"
            size="small"
            title={`Ver Dashboard de Factura ${documento.factura}`}
            disabled={!(documento.factura > 0 && documento.tipo == 'Factura')}
            style={{
              color: documento.factura > 0  && documento.tipo == 'Factura'? '#94d400ff' : '#BDBDBD'
            }}
          >
            <EyeOutlined style={{ fontSize: '18px' }} />
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
      console.log('rowdatagxcc',rowData)
      console.log(rowData.Extensión)
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
      // cntDoctos: 'test1'
      // Acciones no se exporta
    };

    const dataToExport = filasDocumentosRelacionados.map((row) => ({
      ...row,
      // Formatea números si es necesario (opcional)
      total_factura: Number(row.total_factura),
      saldo_actual_factura: Number(row.saldo_actual_factura),
      total_movimiento: Number(row.total_movimiento)
    }));
    // Extrae solo las columnas que queremos, mapeadas a nombres amigables
  
    const worksheetData = dataToExport.map((row) => {
      // console.log('Data to export map', row);
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
    XLSX.writeFile(workbook, `Documentos_Relacionados_Deposito_${folioDepositoAConsultar}.xlsx`);
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
        <Typography variant="h2">Dashboard de Trazabilidad</Typography>
        <br />
        <Divider />
        <br />
        {/* Reporte */}
        <Stack sx={{ backgroundColor: '' }} spacing={4}>
          {/* Encabezado */}
          <Box>
            <Typography variant="h3" align="center">
              Trazabilidad de Depósito #<span>{informacionDelDeposito?.ficha_deposito}</span>
            </Typography>
            <Typography variant="h5" align="center">
              Cliente: <span>{informacionDelDeposito?.cliente_factura}</span> | Fecha:{' '}
              <span>{formatFecha(informacionDelDeposito?.fecha_deposito_documento)}</span>
            </Typography>
          </Box>
          {/* Cards */}
          <Box sx={{ backgroundColor: '', height: '100%' }} component="section">
            <Grid sx={{ height: '100%' }} container spacing={2}>
              <Grid sx={{ height: '100%', width: '100%' }} size={{ sm: 12, md: 12, lg: 4 }}>
                {/* Card 1 */}
                <MainCard sx={{ height: '100%', '&:hover': { boxShadow: 15 } }} title="Resumen del Depósito">
                  <Stack spacing={1}>
                    <ReportCard
                      primary={
                        informacionDelDeposito?.importe_ficha_deposito ? (
                          <MonedaFormatoMiles
                            moneda={'MXN'}
                            cantidad={informacionDelDeposito?.importe_ficha_deposito}
                            etiquetaHTML={'h3'}
                          />
                        ) : (
                          'N/A'
                        )
                      }
                      secondary="Importe total depositado"
                      color="secondary.main"
                      iconPrimary={DollarOutlined}
                    />
                    <ReportCard
                      //primary={facturasRelacionadasUnicas ? facturasRelacionadasUnicas : 'N/A'}
                      primary={informacionDelDeposito?.cntDoctos}
                      secondary="Documentos relacionados"
                      color="secondary.main"
                      iconPrimary={NumberOutlined}
                    />
                    <ReportCard
                      primary={
                        informacionDelDeposito?.importe_ficha_deposito ? (
                          <MonedaFormatoMiles moneda={'MXN'} cantidad={informacionDelDeposito?.saldo_actual} etiquetaHTML={'h3'} />
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
                    <GraficoDePastel cantidad1={totalDistribuido} cantidad2={informacionDelDeposito?.importe_ficha_deposito} />
                  </Stack>
                </MainCard>
              </Grid>
              <Grid sx={{ height: '100%', width: '100%' }} size={{ sm: 12, md: 12, lg: 4 }}>
                {/* Card 3 */}
                <MainCard sx={{ height: '100%', '&:hover': { boxShadow: 15 } }} title="Documentos Clave">
                  <Stack spacing={1}>
                    <ReportCard
                      primary={informacionDelDeposito?.anticipo_cliente ? informacionDelDeposito?.anticipo_cliente : 'N/A'}
                      secondary="Anticipo de Cliente"
                      color="secondary.main"
                      iconPrimary={FileTextOutlined}
                    />
                    <ReportCard
                      primary={informacionDelDeposito?.poliza_ficha ? informacionDelDeposito?.poliza_ficha : 'N/A'}
                      secondary="Póliza ContPaq"
                      color="secondary.main"
                      iconPrimary={ProfileOutlined}
                    />
                    <ReportCard
                      primary={informacionDelDeposito?.numero_exportado_ficha ? informacionDelDeposito?.numero_exportado_ficha : 'N/A'}
                      secondary="Folio CONTPAQ"
                      color="secondary.main"
                      iconPrimary={DatabaseOutlined}
                    />
                  </Stack>
                </MainCard>
              </Grid>
            </Grid>
          </Box>
          <Divider />
          {/* Analisis de consistencia */}
          <Box sx={{ backgroundColor: '' }} component="section">
            <Box>
              <Typography variant="h3">Análisis de Consistencia</Typography>
            </Box>
            <br />
            <Grid container spacing={2}>
              <Grid sx={{ overflow: 'visible' }} size={12}>
                {typeof informacionDelDeposito?.importe_ficha_deposito === 'number' && (
                  <GraficoDeBarras
                    data={[
                      informacionDelDeposito.cntDoctos,
                      informacionDelDeposito.saldo_actual,
                      totalDistribuido,
                      informacionDelDeposito.importe_ficha_deposito
                    ]}
                    valorMaximoEjeY={Number(informacionDelDeposito.importe_ficha_deposito)}
                  />
                )}
              </Grid>
              {/* <Grid size={8}>...</Grid> */}
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
              sx={{ marginTop: '4px', marginBottom: '12px' }}
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
                <TablaColapsableTrazabilidadDashboard
                  data={filasDocumentosRelacionados}
                  columnsConfig={columnsConfig2}
                  onPdfIconClick={handleShowPDFGXCCIntegrado}
                />
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
              <Typography variant="h4">Análisis de IA</Typography>
              <br />
              {cargandoIA ? (
                <Typography>Cargando análisis, por favor espera...</Typography>
              ) : (
                // <Typography sx={{ whiteSpace: 'pre-wrap' }}>{analisisIA}</Typography>
                <ReactMarkdown>{analisisIA}</ReactMarkdown>
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
export default DashboardTrazabilidadPagos;
