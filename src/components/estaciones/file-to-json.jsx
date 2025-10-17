import React, { useState, useCallback, useMemo } from 'react';
import { 
    Grid, 
    Typography, 
    ToggleButtonGroup, 
    ToggleButton, 
    Box, 
    FormControl,
    TextField,
    CircularProgress,
    Button,
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useBackendApi from '../../hooks/useBackendApi'; 
import FileUploader from '../componentesBase/FileUploader';
import { useLocation } from 'react-router-dom';


// Componente para visualizar el archivo (PDF o Imagen)
const DocumentViewer = ({ file }) => {
    if (!file) return (
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh', 
            border: '1px solid #ddd', 
            borderRadius: 4
            // bgcolor: '#f0f0f0' 
        }}>
            <Typography variant="h6" color="text.secondary">
                Cargue un documento para la previsualización
            </Typography>
        </Box>
    );

    // Crear la URL de datos a partir de Base64
    const src = `data:${file.mimeType};base64,${file.base64}`;
    const isPDF = file.mimeType.includes('pdf');
    const isImage = file.mimeType.includes('image');

    // Estilo para el contenedor del visor
    const viewerStyle = {
        width: '100%',
        minHeight: '60vh',
        border: '1px solid #ddd',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    };

    return (
        <Box sx={viewerStyle}>
            <Typography variant="h6" sx={{ p: 1, borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
                Documento Original: {file.name}
            </Typography>
            <Box sx={{ p: 1, height: 'calc(60vh - 48px)', overflowY: 'auto' }}>
                {isPDF && (
                    // Usamos un iframe para incrustar el PDF
                    <iframe src={src} title="Documento PDF" style={{ width: '100%', height: '100%', border: 'none' }} />
                )}
                {isImage && (
                    // Usamos img para mostrar la imagen
                    <img 
                        src={src} 
                        alt="Documento para análisis" 
                        style={{ 
                            width: '100%', 
                            height: 'auto', 
                            display: 'block', 
                            borderRadius: '4px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }} 
                    />
                )}
                {!isPDF && !isImage && (
                    <Typography color="error" sx={{ p: 2 }}>
                        Formato de archivo no soportado para previsualización ({file.mimeType}).
                    </Typography>
                )}
            </Box>
        </Box>
    );
};


export default function FileToJson() {
    // Hooks simulados
    const { postData } = useBackendApi();
    const { pathname } = useLocation();
    
    // Estados principales
    const [folio, setFolio] = useState(12); // Valor estático para el demo
    const [archivoVisualizacion, setArchivoVisualizacion] = useState(null); 
    const [analisisResultado, setAnalisisResultado] = useState(null);
    const [tipoDocumento, setTipoDocumento] = useState('Factura'); 
    const [isLoading, setIsLoading] = useState(false);

    // Las instrucciones se definen usando useMemo para garantizar su estabilidad y evitar redeclaraciones
    const instruccionFactura = useMemo(() => 
        `Eres un experto en documentos de **Facturas Comerciales Nacionales (CFDI)**. ` +
        `Tu **ÚNICA** tarea es analizar el documento adjunto y extraer toda la información solicitada en el esquema. ` +
        `Utiliza la sección 'INFORMACIÓN DEL DOCUMENTO' y 'PRODUCTOS' para encontrar los valores. ` +
        `Responde **SOLO** con el objeto JSON que se ajusta exactamente al esquema JSON proporcionado. ` +
        `NO incluyas introducciones, explicaciones, o markdown adicional antes o después del objeto JSON.`, 
    []);

    const instruccionOtro = useMemo(() => 
        `Eres un analista experto de documentos e imágenes. ` +
        `Tu **ÚNICA** tarea es analizar el documento adjunto y extraer toda la información evidente y visual. ` +
        `Dando una explicacion detallada de lo que se observa en la imagen. ` +
        `Responde con un texto descriptivo máximo de 50 palabras destacando solo lo mas relevante. ` +
        `NO debes responder con formato JSON.`, 
    []);

    const [prompt, setPrompt] = useState(instruccionFactura);

    const handleTipoChange = useCallback((event, newTipo) => {
        if (newTipo === null) return; // Evitar deselección
        setTipoDocumento(newTipo);

        // Ajustar Prompt según el tipo de documento
        if (newTipo === 'Invoice') {
            setPrompt(`Eres un experto en documentos de **Facturas Comerciales Internacionales** (Invoices). ` +
                        `Tu **ÚNICA** tarea es analizar el documento adjunto y extraer toda la información solicitada en el esquema. ` +
                        `Utiliza la sección 'DOCUMENT INFO', 'REMIT TO' y 'SHIPPING INFO' para encontrar los valores. ` +
                        `Responde **SOLO** con el objeto JSON que se ajusta exactamente al esquema JSON proporcionado. ` +
                        `NO incluyas introducciones, explicaciones, o markdown adicional antes o después del objeto JSON.`);
        } else if (newTipo === 'Factura') {
            setPrompt(instruccionFactura);
        } else if (newTipo === 'CartaPorte') {
            setPrompt(`Eres un experto en documentos de **Transportistas y Fletes** (Carta Porte). ` +
                        `Tu **ÚNICA** tarea es analizar el documento adjunto y extraer toda la información solicitada en el esquema. ` +
                        `Responde **SOLO** con el objeto JSON que se ajusta exactamente al esquema JSON proporcionado. ` +
                        `NO incluyas introducciones, explicaciones, o markdown adicional antes o después del objeto JSON.`);
        } else if (newTipo === 'OrdenCompra' || newTipo === 'Requisicion') {
            setPrompt(`Eres un experto en documentos de **Compras y Requisiciones**. ` +
                        `Tu **ÚNICA** tarea es analizar el documento adjunto y extraer toda la información solicitada en el esquema. ` +
                        `Responde **SOLO** con el objeto JSON que se ajusta exactamente al esquema JSON proporcionado. ` +
                        `NO incluyas introducciones, explicaciones, o markdown adicional antes o después del objeto JSON.`);
        } else if (newTipo === 'Otro') {
            setPrompt(instruccionOtro);
        }
    }, [instruccionFactura, instruccionOtro]);

    const handleFileAnalysis = async (fileData) => {
        console.log("Paso 1: Archivo recibido para análisis:", fileData);
        
        // 1. GUARDAR EL ARCHIVO PARA VISUALIZACIÓN
        setArchivoVisualizacion(fileData); 
        setAnalisisResultado(null); // Limpiar resultado anterior
        
        // Validar Folio (simulado)
        if (!folio) {
            mensajes('aviso', 'Debes ingresar o seleccionar un Folio de Trámite para analizar el documento.');
            return; 
        }

        setIsLoading(true); // Iniciar carga

        try {
            console.log("Enviando archivo a backend para análisis...");
            const response = await postData('/analizar-documento-gemini', {
                tramite_id: folio, 
                file: fileData, 
                prompt: prompt, 
                tipoDocumento: tipoDocumento 
            });

            if (response.success && response.data) {
                // Si el tipo es 'Otro', la IA devuelve una descripción, no un JSON estructurado
                if (tipoDocumento === 'Otro') {
                    setAnalisisResultado(response.data); 
                } else {
                    setAnalisisResultado(response.data); 
                }
                mensajes('exito', 'Datos extraídos con éxito por la IA.');
            } else {
                mensajes('error', response.message || 'Error desconocido al extraer datos del documento.');
            }

        } catch (error) {
            console.error("Error en la extracción de datos:", error);
            mensajes('error', 'Fallo de comunicación con el servidor de análisis.');
        } finally {
            setIsLoading(false); // Finalizar carga
        }
    };

    // Determinar si el resultado es texto plano (descripción) o JSON (extracción)
    const isDescription = tipoDocumento === 'Otro' && analisisResultado && analisisResultado.description;
    
    // Contenido a mostrar
    const resultadoContent = analisisResultado
        ? (isDescription ? analisisResultado.description : JSON.stringify(analisisResultado, null, 2))
        : 'Cargue un archivo para ver el resultado del análisis de la IA aquí.';

    return (
        // Contenedor principal
        <Box sx={{ px: 2, py: 4,  borderRadius: 2, boxShadow: 3, width: '100%', margin: 'auto', fontFamily: 'Inter' }}>
            
            <Typography variant="h4" gutterBottom sx={{ pl: 2, mb: 4, fontWeight: '700' }}>
                Extractor de PDFs/Imágenes
            </Typography>
            
            <FormControl fullWidth>
                {/* 1. SECCIÓN DE CONFIGURACIÓN (TIPO DE DOCUMENTO Y PROMPT) */}
                <Grid container spacing={4} sx={{ mb: 4, px: 2 }}>
                    
                    <Grid item xs={12}>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: '600' }}>
                            1. Seleccionar Tipo de Documento
                        </Typography>
                        <ToggleButtonGroup
                            value={tipoDocumento} 
                            exclusive
                            onChange={handleTipoChange} 
                            aria-label="tipo"
                            fullWidth
                            sx={{ height: '56px', '& .MuiToggleButton-root': { textTransform: 'none', fontWeight: '500', borderRadius: '8px !important' } }}
                        >
                            <ToggleButton value="Invoice" aria-label="Invoice">
                                <Typography variant="body2">Invoice (Intl)</Typography>
                            </ToggleButton>
                            <ToggleButton value="Factura" aria-label="Factura">
                                <Typography variant="body2">Factura (CFDI)</Typography>
                            </ToggleButton>
                            <ToggleButton value="CartaPorte" aria-label="CartaPorte">
                                <Typography variant="body2">Carta Porte</Typography>
                            </ToggleButton>
                            <ToggleButton value="OrdenCompra" aria-label="OrdenCompra">
                                <Typography variant="body2">Orden de Compra</Typography>
                            </ToggleButton>
                            <ToggleButton value="Otro" aria-label="Otro">
                                <Typography variant="body2">Otro (Descripción)</Typography>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>


                    <Grid item xs={12} container spacing={1} sx={{ mb: 2, width: '100%'}}>
                        <Accordion
                            sx={{ borderRadius: '8px', border: '1px solid #e0e0e0', boxShadow: 'none',width: '100%' }}
                            defaultExpanded
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel-prompt-header">
                                <Typography variant="h5" sx={{ mb: 0, fontWeight: '600',width: '100%' }}>
                                    2. Prompt y Configuración de Análisis
                                </Typography>

                            </AccordionSummary>
                            <AccordionDetails sx={{ pt: 1 }}>
                                <TextField
                                    fullWidth
                                    multiline          
                                    rows={6}           
                                    maxRows={10}       
                                    id="prompt-ia"
                                    label="Instrucciones para la IA (Prompt Editable)"
                                    placeholder="Escribe aquí el prompt detallado para la IA..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    variant="outlined" 
                                    helperText="Este prompt guía a Gemini para la extracción de datos."
                                />
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
                
                {/* 3. SECCIÓN DE CARGA */}
                <Grid container spacing={4} sx={{ px: 2, width: '100%', mb: 4 }}>
                    <Grid item xs={12}>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: '600' }}>
                            3. Cargar Archivo para Análisis
                        </Typography>
                        <FileUploader onFileProcessed={handleFileAnalysis} />
                    </Grid>
                </Grid>

                {/* 4. SECCIÓN DE DEMOSTRACIÓN (SPLIT VIEW) */}
                <Grid container spacing={4} sx={{ px: 2, width: '100%' }}>
                    
                    {/* COLUMNA IZQUIERDA: VISOR DE DOCUMENTOS */}
                    <Grid item xs={12} md={6}>
                        <DocumentViewer file={archivoVisualizacion} />
                    </Grid>

                    {/* COLUMNA DERECHA: RESULTADO DEL ANÁLISIS */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ 
                            width: '100%', 
                            minHeight: '60vh', 
                            border: '1px solid #ddd', 
                            borderRadius: 4, 
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Typography variant="h6" sx={{ p: 1, borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
                                Resultado del Análisis con IA
                            </Typography>
                            
                            <Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto' }}>
                                {isLoading ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '50vh' }}>
                                        <CircularProgress size={60} sx={{ color: '#1976d2' }} />
                                        <Typography variant="body1" sx={{ mt: 2, color: '#1976d2', fontWeight: '500' }}>
                                            Analizando documento con Gemini...
                                        </Typography>
                                    </Box>
                                ) : analisisResultado ? (
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom >
                                            {isDescription ? 'Descripción de Imagen/Documento:' : 'Datos Extraídos (JSON Estructurado):'}
                                        </Typography>
                                        <pre style={{ 
                                            overflowX: 'auto', 
                                            whiteSpace: isDescription ? 'pre-wrap' : 'pre', 
                                            wordBreak: isDescription ? 'break-word' : 'initial',
                                            maxHeight: '100%', 
                                            padding: '10px',
                                            border: '1px solid #ccc',
                                            // backgroundColor: '#fafafa',
                                            borderRadius: '4px',
                                            fontSize: '14px'
                                        }}>
                                            {resultadoContent}
                                        </pre>
                                    </Box>
                                ) : (
                                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                                        Aún no hay resultados. Cargue un archivo para comenzar el análisis.
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                
            </FormControl>
        </Box>
    );
}
