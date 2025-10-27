import React from 'react';
import { useState } from 'react';

//MUI
//Componentes para tabla MUI
import { DataGrid } from '@mui/x-data-grid';
//Componentes generales MUI
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

//Componentes propios del proyecto
import MonedaFormatoMiles from './MonedaFormatoMiles.jsx';

//Idioma para tabla
import { esES } from '@mui/x-data-grid/locales';

//Ant Design
import { FilterOutlined, CheckCircleOutlined, CheckCircleTwoTone } from '@ant-design/icons';

//Componente MuiTablaBase
//Ejemplo de como utilizar:
{
  /* <MuiTablaBase
          tieneSeleccion={true} //Valor puede ser true o false
          idPropiedad={''}
          datos=[{},{},{},{},{}]
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
            { propiedad: 'test10', encabezadoTitulo: 'prueba10'}
          ]}
        /> */
}
const MuiTablaBase = ({ estructuraEncabezados, datos, onSelectRow, seleccionable = false, idPropiedad = 'id' }) => {
  const [selectedRowId, setSelectedRowId] = useState(null);

  const encabezados = estructuraEncabezados.map((item) => {
    const calculatedFlex = item.encabezadoTitulo.length > 15 ? 2 : 1;

    return { field: item.propiedad, headerName: item.encabezadoTitulo, flex: calculatedFlex };
  });

  if (seleccionable) {
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
        // Use the same ID logic as DataGrid
        const rowId = params.row[idPropiedad]; // e.g., factura
        const isSelected = selectedRowId === rowId;

        const handleSelect = () => {
          const newSelectedId = isSelected ? null : rowId;
          setSelectedRowId(newSelectedId);

          // 👉 Log the factura or whatever you want
          console.log('Selected row factura:', params.row.factura);

          // Optional: Call a callback if provided
          if (onSelectRow) {
            onSelectRow(params.row);}
          // } else if (onDeselectRow && isSelected) {
          //   onDeselectRow(params.row);
          // }
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
              aria-label={isSelected ? `Deseleccionar ${params.row.factura}` : `Seleccionar ${params.row.poliza}`}
              color="success"
              size="medium"
              sx={{ width: '100%', height: '100%' }}
            >
              {isSelected ? <CheckCircleTwoTone fontSize="large" /> : <CheckCircleOutlined fontSize="large" />}
            </IconButton>
          </Box>
        );
      }
    };

    encabezados.push(columnaSeleccion);
  }

  return (
    //Altura default altura 400 -->   <Paper sx={{ height: 400, width: '100%' }}>
    <Paper sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        sx={{ '& .MuiDataGrid-columnHeader': { backgroundColor: 'primary.dark', color: 'primary.contrastText' } }}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        columns={encabezados}
        rows={datos}
        getRowId={(row) => row[idPropiedad]}
      />
    </Paper>
  );
};

//Exportar componente
export default MuiTablaBase;
