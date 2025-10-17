import React from 'react';
import {useState} from 'react'

//MUI
//Componentes para tabla MUI
import { DataGrid } from '@mui/x-data-grid';
//Componentes generales MUI
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

//Componentes propios del proyecto
import MonedaFormatoMiles from './MonedaFormatoMiles.jsx'

//Idioma para tabla
import { esES } from '@mui/x-data-grid/locales';

//Ant Design
import { FilterOutlined, CheckCircleOutlined, CheckCircleTwoTone } from '@ant-design/icons';

//Componente MuiTablaBase
//Ejemplo de como utilizar:
{/* <MuiTablaBase
          tieneSeleccion={true} //Valor puede ser true o false
          estructuraEncabezados={[
            { propiedad: 'test1', encabezadoTitulo: 'prueba1abcdefghijklmnopqrstuvwxyz' },
            { propiedad: 'test2', encabezadoTitulo: 'prueba2' },
            { propiedad: 'test3', encabezadoTitulo: 'prueba3' },
            { propiedad: 'test4', encabezadoTitulo: 'prueba4' },
            { propiedad: 'test5', encabezadoTitulo: 'prueba5' },
            { propiedad: 'test6', encabezadoTitulo: 'prueba6' },
            { propiedad: 'test7', encabezadoTitulo: 'prueba7' },
            { propiedad: 'test8', encabezadoTitulo: 'prueba8' },
            { propiedad: 'test9', encabezadoTitulo: 'prueba9' },
            { propiedad: 'test10', encabezadoTitulo: 'prueba10' }
          ]}
        /> */}
const MuiTablaBase = ({ estructuraEncabezados, seleccionable=false }) => {

  const [selectedRowId, setSelectedRowId] = useState(null);

  // Funcion auxiliar
  const generateRowId = (row) => {
    return row.documento != null ? row.documento : `fallback-${row.ficha_deposito}-${row.nombre_tipo}-fecha`;
  };

  console.log(seleccionable)


  const encabezados = estructuraEncabezados.map((item) => {
    const calculatedFlex = item.encabezadoTitulo.length > 20 ? 2 : 1;

    return { field: item.propiedad, headerName: item.encabezadoTitulo, flex: calculatedFlex};
  });

  if(seleccionable){
    const columnaSeleccion = {
      field: 'seleccion',
      headerName: 'Selección',
      flex: 1,
      minWidth: 100,
      align: 'center',
      filterable: false,
      sortable: false,
      headerAlign: 'center',
      renderCell: (params) => {
        const generatedId = generateRowId(params.row);
        const isSelected = selectedRowId === generatedId;

        const handleSelect = () => {
          setSelectedRowId(generatedId); // guardar id
          if (onSelectRow) {
            onSelectRow(params.row); // pasar data
          }
        };

        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              px: 0,
              py: 0
            }}
          >
            <IconButton
              onClick={handleSelect}
              aria-label={isSelected ? `Deseleccionar ${params.row.nombre_cliente}` : `Seleccionar ${params.row.nombre_cliente}`}
              color="success"
              size="medium"
              sx={{ width: '100%', height: '100%' }}
            >
              {isSelected ? <CheckCircleTwoTone fontSize="large" /> : <CheckCircleOutlined fontSize="large" />}
            </IconButton>
          </Box>
        );
      }
    }

    encabezados.push(columnaSeleccion)
  }

  // const columns = [
  //   { field: 'field', headerName: 'NombreColumna', flex: 1 },
  //   { field: 'field2', headerName: 'NombreColumna2', flex: 1 }
  // ];

  const filas = [
    { id:546, test1: 'Lorem Ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',test2: <MonedaFormatoMiles cantidad={555} />}
  ]

  return (
    //Altura default altura 400 -->   <Paper sx={{ height: 400, width: '100%' }}>
    <Paper sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        sx={{ '& .MuiDataGrid-columnHeader': { backgroundColor: 'primary.dark', color: 'primary.contrastText' } }}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        columns={encabezados}
        // rows={filas}
      />
    </Paper>
  );
};

//Exportar componente
export default MuiTablaBase;
