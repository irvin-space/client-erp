import { useState, useCallback } from 'react';
// Asumiendo que esta es tu función para mostrar mensajes
import { mensajes } from '../utils/mensajes.js'; 

// 1. Acceso a variables de entorno (como definimos anteriormente)
// const BASE_URL_DEV = import.meta.env.VITE_DEV_API_URL;
// const BASE_URL_PROD = import.meta.env.VITE_PROD_API_URL;
// const DATA_MODE = import.meta.env.VITE_DATA_MODE || 'DEV'; // Fallback a DEV

    const BASE_URL = import.meta.env.VITE_URL_ENVIRONMENT;

// Elige la URL base según el modo (dev o prod)
const getBaseUrl = () => {
    // if (DATA_MODE === 'PROD' && BASE_URL_PROD) {
    //     return BASE_URL_PROD;
    // }
    // Si es DEV o si PROD no está definida, usamos DEV
    return BASE_URL
};

const API_BASE = getBaseUrl();

const useBackendApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Función principal para manejar peticiones POST
    const postData = useCallback(async (endpoint, data = {}) => {
        setLoading(true);
        setError(null);

        const url = `${API_BASE}${endpoint}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Puedes agregar aquí tokens de autenticación (ej. 'Authorization': 'Bearer ...')
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                // Manejo de errores HTTP (4xx o 5xx)
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor.' }));
                throw new Error(errorData.message || `Error del servidor: ${response.status}`);
            }

            const responseData = await response.json();
            return responseData;

        } catch (e) {
            console.error(`Error en la petición a ${url}:`, e);
            setError(e.message);
            // Muestra una alerta amigable al usuario
            mensajes('error', `Fallo de conexión o API: ${e.message}`); 
            throw e; // Re-lanza el error para que el componente que lo llama pueda manejarlo
        } finally {
            setLoading(false);
        }
    }, []); // Dependencias vacías para asegurar la estabilidad

    // Puedes agregar más funciones aquí (ej. getData, putData, deleteData)
    // ...

    return { 
        loading, 
        error, 
        postData 
    };
};

export default useBackendApi;