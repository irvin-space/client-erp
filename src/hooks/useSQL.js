import { useState } from 'react';
import { mensajes } from '../utils/mensajes.js'; // Asegúrate de que la ruta sea correcta

const API_URL = 'http://localhost:3001/ejecuta';

const useSQL = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeFetch = async (instruccionSQL, parametros) => {
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
        mensajes('error', 'Error durante registro de autorización');
        return { success: false, data: responseData }; // Devuelve un objeto con el estado
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
  };

  return { data, loading, error, executeFetch };
};

export default useSQL;