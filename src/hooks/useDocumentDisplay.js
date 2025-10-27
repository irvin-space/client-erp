import { useState, useCallback } from 'react';
import { mensajes } from '../utils/mensajes.js';

/**
 * Función mejorada para decodificar Base64 robustamente y abrir el documento.
 * @param {string} base64String - El string Base64 de la respuesta del backend.
 * @param {string} tipoArchivo - 'pdf', 'xml', o 'other'.
 */

/// Archivo: useDocumentDisplay.js (LA VERSIÓN FINAL Y MÁS ROBUSTA)

const openBase64InNewTab = (base64String, tipoArchivo) => {
    
    // Limpieza (debería ser innecesaria si Node.js lo hace, pero es una buena defensa)
    const cleanBase64 = base64String.replace(/\s/g, ''); 

    let mimeType;
    switch (tipoArchivo.toLowerCase()) {
        case 'pdf': mimeType = 'application/pdf'; break;
        case 'xml': mimeType = 'text/xml'; break;
        default: mimeType = 'application/octet-stream'; break;
    }

    // --- FIX CRÍTICO: MANEJO DE ARRAYBUFFER PARA EVITAR ERROR LATIN1 ---
    
    // 1. Decodificación de Base64 a una string binaria (esto usa atob)
    // ESTA ES LA LÍNEA QUE FALLA, PERO LA NECESITAMOS
    const binaryString = atob(cleanBase64); 

    // 2. Creación del Array de Bytes (Uint8Array)
    // Este paso es CRÍTICO para asegurar que los caracteres no-Latin1 se mapeen correctamente
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        // Se usa charCodeAt para obtener el valor ASCII/Byte
        bytes[i] = binaryString.charCodeAt(i);
    }
    
    // 3. Crear el Blob y la URL
    const blob = new Blob([bytes], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);

    const pdfBlob = new Blob([bytes], { 
        type: 'application/pdf' /* <-- ¡ESTE ES EL PUNTO CRÍTICO! */
    });

    // Luego, la URL del objeto es creada:
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // 4. Abrir en una nueva pestaña
    //window.open(blobUrl, '_blank');
    window.open(pdfUrl, '_blank');
};


const useDocumentDisplay = (endpointURL = import.meta.env.VITE_URL_ENVIRONMENT + '/documento/obtener') => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const displayDocument = useCallback(async ({ instruccionSQL, parametros, tipoArchivo }) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(endpointURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    instruccionSQL,
                    parametros,
                    tipoArchivo,
                })
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: No se pudo recuperar el documento(s).`);
            }

            const data = await response.json(); 
            
            // Determinar el MIME Type (si el backend no lo provee, usar el tipoArchivo)
            let mimeType;
            if (data.mimeType) {
                mimeType = data.mimeType;
            } else if (tipoArchivo === 'pdf') {
                mimeType = 'application/pdf';
            } else if (tipoArchivo === 'xml') {
                 mimeType = 'text/xml';
            } else {
                mimeType = 'application/octet-stream';
            }


            if (!data.fileData) {
                mensajes('error', 'El servidor no devolvió datos de archivo (Base64).');
                return;
            }

            // 💡 INVOCA EL MÉTODO DE DESPLIEGUE AQUÍ, DENTRO DEL HOOK
            // Limpia el nombre del archivo si contiene comillas (si se te olvidó limpiarlo en el dashboard)
            const cleanFolio = parametros['@nFolio'] 
                ? String(parametros['@nFolio']).replace(/'/g, '').replace(/ /g, '_')
                : 'sin_folio'; 

            if (data.success && data.fileData) {
                openBase64InNewTab(data.fileData, tipoArchivo); // Asegúrate que data.fileData es el string Base64
                //mensajes('success', 'Documento abierto en una nueva pestaña.');
            }
            else {
                mensajes('error', 'Seguimos presentando errores.');
            }
            

        } catch (err) {
            console.error('Error en displayDocument:', err);
            setError(err.message);
            mensajes('error', `Fallo al abrir el documento: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [endpointURL]);

    return { displayDocument, isLoading, error };
};

export default useDocumentDisplay;