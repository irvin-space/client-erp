import React, { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

import useSQL from '../../hooks/useSQL.js';

//MUI
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import ReactMarkdown from 'react-markdown';

//Ant design
import {
  DollarCircleOutlined,
  DatabaseOutlined,
  DollarOutlined,
  FileTextOutlined,
  NumberOutlined,
  ProfileOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';

//Componentes propios del proyecto
import MainCard from '../MainCard.jsx';
import ReportCard from '../cards/estadisticas/ReportCard.jsx';
import GraficoDePastel from '../cards/estadisticas/GraficoDePastel.jsx';
import GraficoDeBarras from '../cards/estadisticas/GraficoDeBarras.jsx';
import LineaDelTiempo from '../componentesBase/LineaDelTiempo.jsx';
import DataTable from '../componentesBase/DataTable3.jsx';
import TablaBase from '../componentesBase/TablaBase.jsx';

import { mensajes } from '../../utils/mensajes.js';

//React MarkDoown
import ReactMarkdown from 'react-markdown';

//Componente
const DashboardTrazabilidadPagos = () => {
  const [cargandoIA, setCargandoIA] = useState(false);
  const [analisisIA, setAnalisisIA] = useState('');

  const [folioDepositoAConsultar, setFolioDepostioAConsultar] = useState(0);
  const [facturasRelacionadasUnicas, setFacturasRelacionadasUnicas] = useState(0);
  const [totalDistribuido, setTotalDistribuido] = useState(0);
  const [informacionDelDeposito, setInformacionDelDeposito] = useState({});
  const [filasDocumentosRelacionados,setFilasDocumentosRelacionados] = useState([])

  const location = useLocation();

  const { executeFetch, data, loading, error } = useSQL();

  const traerInfoDeDeposito = async () => {
    const objetoParametros = {
      '@nFicha_Deposito': `'${folioDepositoAConsultar}'` //167443 `'${folioDepositoAConsultar}'`
    };

    const { data, success } = await executeFetch('Trazabilidad_Pagos2', objetoParametros);
    console.log(success);
    if (success) {
      // console.log(data[0][0]);
      console.log('facturas relacionadas');
      console.log('abcabc',data)
      console.log(data[0]);
      setFilasDocumentosRelacionados(data[1])
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
    }
  };

  //useEffect al montarse el componente
  useEffect(() => {
    const { rowInfo } = location.state || {};

    console.log('Received rowInfo:', rowInfo);
    setFolioDepostioAConsultar(rowInfo.ficha_deposito);
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
    const promptAI = '**TAREA DE ANÁLISIS FINANCIERO ADUANAL** ' +

                  'Analiza detalladamente los datos de este trámite aduanal. Revisa exhaustivamente los **ingresos y gastos**.' +

                  '**Objetivos del Análisis:**' +
                  '1.  **Inconsistencias:** Identifica cualquier patrón irregular o datos faltantes.' +
                  '2.  **Discrepancias:** Señala gastos que sean inusualmente altos o bajos en comparación con la media, o discrepancias en las fechas de registro.' +

                  '**FORMATO DE SALIDA REQUERIDO:**' +
                  'Tu respuesta debe ser estructurada usando **Markdown** estricto para asegurar un formato profesional y legible.' +

                  '--- '+
                  '# 📊 [NOMBRE O FOLIO DEL TRÁMITE] - Resumen de Auditoría Aduanal' +
                  '---' +

                  '## 🔍 Hallazgos Clave'+
                  '* **Identificación de Anomalías:** Usa **negritas** para destacar cualquier monto o fecha crítica. '+
                  '* **Listado:** Usa una lista con viñetas para presentar los 3-5 hallazgos más importantes. Incluye un **Emoji** relevante (e.g., ⚠️ para advertencia, ✅ para conformidad).' +

                  '## 📈 Análisis Financiero y de Consistencia'+
                  '* **Ingresos/Gastos:** Ofrece una breve comparación y un balance.' +
                  '* **Gastos Atípicos:** Si encuentras gastos inusuales, usa un subtítulo con `### Gasto con Alerta: [NOMBRE DEL GASTO]`.' +

                  '## ✅ Recomendación y Siguiente Paso'+
                  '* **Título Principal:** Usa **Markdown** para un título claro.' +
                  '* **Acción:** Proporciona una **recomendación clara y concisa** para el siguiente paso en el proceso de auditoría o corrección.';
    // Elige la URL del endpoint según el servicio que se le pasó como argumento
    const endpointURL = servicio === 'gemini' ? 'http://localhost:3001/analisis-ia' : 'http://localhost:3001/analisis-ia-gpt';

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

  return (
    <Box sx={{ backgroundColor: '' }}>
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
            <Grid sx={{ height: '100%' }} size={{ sm: 12, lg: 4 }}>
              {/* Card 1 */}
              <MainCard sx={{ height: '100%', '&:hover': { boxShadow: 15 } }} title="Resumen del Depósito">
                <Stack spacing={1}>
                  <ReportCard
                    primary={
                      informacionDelDeposito?.importe_ficha_deposito ? `$${informacionDelDeposito?.importe_ficha_deposito.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} MXN` : 'N/A'
                    }
                    secondary="Importe total depositado"
                    color="secondary.main"
                    iconPrimary={DollarOutlined}
                  />
                  <ReportCard
                    primary={facturasRelacionadasUnicas ? facturasRelacionadasUnicas : 'N/A' }
                    secondary="Facturas relacionadas"
                    color="secondary.main"
                    iconPrimary={NumberOutlined}
                  />
                  <ReportCard
                    primary={ informacionDelDeposito?.importe_ficha_deposito ?`$${informacionDelDeposito?.saldo_actual.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} MXN` : 'N/A'}
                    secondary="Saldo actual"
                    color="secondary.main"
                    iconPrimary={DollarOutlined}
                    bgColoR={'#2636eaff'}
                  />
                </Stack>
              </MainCard>
            </Grid>
            <Grid sx={{ height: '100%' }} size={{ sm: 12, lg: 4 }}>
              {/* Card 2 */}
              <MainCard sx={{ height: '100%', '&:hover': { boxShadow: 15 } }} title="Distribución">
                <Stack spacing={1}>
                  <GraficoDePastel cantidad1={totalDistribuido} cantidad2={informacionDelDeposito?.importe_ficha_deposito} />
                </Stack>
              </MainCard>
            </Grid>
            <Grid sx={{ height: '100%' }} size={{ sm: 12, lg: 4 }}>
              {/* Card 3 */}
              <MainCard sx={{ height: '100%', '&:hover': { boxShadow: 15 } }} title="Documentos Clave">
                <Stack spacing={1}>
                  <ReportCard
                    primary={informacionDelDeposito?.anticipo_cliente ? informacionDelDeposito?.anticipo_cliente : 'N/A'}
                    secondary="Documento cliente"
                    color="secondary.main"
                    iconPrimary={FileTextOutlined}
                  />
                  <ReportCard
                    primary={informacionDelDeposito?.poliza ? informacionDelDeposito?.poliza : 'N/A'}
                    secondary="Póliza ContPaq"
                    color="secondary.main"
                    iconPrimary={ProfileOutlined}
                  />
                  <ReportCard
                    primary={
                      informacionDelDeposito?.numero_exportado_poliza_factura
                        ? informacionDelDeposito?.numero_exportado_poliza_factura
                        : 'N/A'
                    }
                    secondary="Folio CONTPAQ"
                    color="secondary.main"
                    iconPrimary={DatabaseOutlined}
                  />
                </Stack>
              </MainCard>
            </Grid>
          </Grid>
        </Box>
        {/* Analisis de consistencia */}
        <Box sx={{ backgroundColor: '' }} component="section">
          <Box>
            <Typography variant="h3">Análisis de Consistencia</Typography>
          </Box>
          <br />
          <Grid container spacing={2}>
            <Grid size={12}>
              <GraficoDeBarras
                data={[
                  informacionDelDeposito?.saldo_actual,
                  facturasRelacionadasUnicas,
                  totalDistribuido,
                  informacionDelDeposito?.importe_ficha_deposito
                ]}
              />
            </Grid>
            {/* <Grid size={8}>...</Grid> */}
          </Grid>
        </Box>
        {/* Documentos Relacionados */}
        <Box component="section">
          <Box>
            <Typography variant="h3">Documentos Relacionados</Typography>
          </Box>
          <br />
          <Grid container spacing={2}>
            <Grid size={12}>
              <Box sx={{ backgroundColor: 'yellow' }}>
                {/* <DataTable rowsArray={[]} /> */}
                <TablaBase
                  columnsConfig={[
                    { headerName: 'Folio', field: 'factura' },
                    { headerName: 'Fiscal', field: 'fiscal' },
                    { headerName: 'Fecha', field: 'fecha_factura' },
                    { headerName: 'UUID', field: 'uuid_funcion' },
                    { headerName: 'Importe de Factura', field: 'total_factura' },
                    { headerName: 'Saldo actual de Factura', field: 'saldo_actual_factura', },
                    { headerName: 'Póliza', field: 'poliza' }
                  ]}
                  data={filasDocumentosRelacionados}
                />
              </Box>
            </Grid>
            {/* <Grid size={12}>
              <Typography>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus neque atque beatae itaque placeat dicta ullam laboriosam
                aliquid voluptatum quaerat saepe, excepturi sequi repudiandae debitis deleniti molestias eum ratione sunt.
              </Typography>
            </Grid> */}
          </Grid>
        </Box>
        {/* Secuencia de Eventos */}
        <Box component="section">
          <Box>
            <Typography variant="h3">Secuencia de Eventos</Typography>
          </Box>
          <br />
          <Grid container spacing={2}>
            <Grid size={6}>
              <LineaDelTiempo />
            </Grid>
            {/* <Grid size={6}>...</Grid> */}
          </Grid>
        </Box>
        <br />
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

          <Button variant="contained" onClick={() => handleAnalisisIA('gemini')} disabled={cargandoIA} color="primary">
            {cargandoIA ? 'Analizando...' : 'Analizar con IA'}
          </Button>

          <Box sx={{ mt: 2 }}>
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
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

//Exportar componente
export default DashboardTrazabilidadPagos;
