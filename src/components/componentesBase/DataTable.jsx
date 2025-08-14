import React from 'react';
import { useEffect, useState } from 'react';

// Material UI
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ComponenteListaDinamica = ({ label = 'Seleccione una opcion', instruccionSQL, parametros, valueKey, labelKey,value, onChange}) => {
  const [options, setOptions] = useState([]);
  // const [value, setValue] = useState('a'); // Estado para el valor seleccionado
  const [loading, setLoading] = useState(true);

  //Llamar a el backend al montar el componente
  useEffect(() => {
    const callBackend = async () => {
      try {
        const response = await fetch('http://localhost:3001/dinamico/lista', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ instruccionSQL: instruccionSQL, parametros: parametros })
        });

        const data = await response.json();
        console.log('🔴 Respuesta completa del backend:', data);
        console.log('🟢 Tipo de data:', typeof data);
        console.log('🟡 Es array?', Array.isArray(data));
        console.log('📦 Primer elemento (si existe):', data[0]);
        console.log(data);

        //Establecer valores dinamicos
        // setValoresDinamicos({...valoresDinamicos,options:data[0]})
        setOptions(data[0]);
        setLoading(false);
      } catch (err) {
        console.log('Error message', err);
      }
    };

    callBackend();
  }, []);

  useEffect(() => {
    console.log('✅ Opciones actualizadas:', options);
  }, [options]);

  const handleChange = (event) => {
    console.log(options);
    console.log(event.target.value);
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="dinamic-simple-select-label">{label}</InputLabel>
      <Select
        labelId="dinamic-simple-select-label"
        id="dinamic-simple-select"
        value={value}
        label={label}
        onChange={handleChange}
        displayEmpty
        style={{backgroundColor:"white"}}
      >
        {loading ? (
          <MenuItem disabled>
            <em>Cargando opciones...</em>
          </MenuItem>
        ) : options.length === 0 ? (
          <MenuItem disabled>
            <em>Sin opciones disponibles</em>
          </MenuItem>
        ) : (
          options.map((item) => {
            const value = item[valueKey] ?? '';
            const label = item[labelKey] ?? '(Sin nombre)';

            return (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            );
          })
        )}
      </Select>
    </FormControl>
  );
};

export default ComponenteListaDinamica;
