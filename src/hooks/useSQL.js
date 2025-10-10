import { useState, useCallback } from 'react';
import { mensajes } from '../utils/mensajes.js'; 

const API_URL = VITE_URL_ENVIRONMENT + '/ejecuta';

const useSQL = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🏆 CORRECCIÓN CLAVE: Usar useCallback para la estabilidad
  const executeFetch = useCallback(async (instruccionSQL, parametros, esAutorizacion) => {
    // Las funciones de setState (setData, setLoading, setError) son estables, 
    // por lo que no necesitan ir en las dependencias de useCallback.
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruccionSQL,
          parametros
        }),
      });

      if (!response.ok) {
        throw new Error('La respuesta de la red no fue exitosa.');
      }

      const responseData = await response.json();
      setData(responseData);

      // Lógica de validación de tu código original
      if (responseData[0] && responseData[0].length === 0) {
        if (esAutorizacion) {
          mensajes('error', 'Error durante registro de autorización');
          
        }
        else {  
          mensajes('info', 'Consulta realizada');
        }
        return { success: false, data: responseData }; 
      }

      return { success: true, data: responseData };

    } catch (e) {
      console.error("Error al ejecutar la consulta:", e);
      setError(e.message);
      mensajes('error', `Error en la comunicación con el servidor: ${e.message}`);
      return { success: false, data: null };
      
    } finally {
      setLoading(false);
    }
  }, []); // 👈 ¡DEPENDENCIAS VACÍAS! Esto garantiza que executeFetch sea la misma función siempre.

  return { data, loading, error, executeFetch };
};

export default useSQL;