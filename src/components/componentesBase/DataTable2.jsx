import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { esES } from '@mui/x-data-grid/locales';
import { flex } from '@mui/system';
import { isArray } from 'lodash-es';

// const columns = [
//   { field: 'id', headerName: 'ID', width: 70 },
//   { field: 'firstName', headerName: 'First name', width: 130 },
//   { field: 'lastName', headerName: 'Last name', width: 130 },
//   {
//     field: 'age',
//     headerName: 'Age',
//     type: 'number',
//     width: 90,
//   },
//   {
//     field: 'fullName',
//     headerName: 'Full name',
//     description: 'This column has a value getter and is not sortable.',
//     sortable: false,
//     width: 160,
//     valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
//   },
// ];

const columns = [
  { field: 'nombre_comercial', headerName: 'Nombre Comercial', flex: 1.5 },
  { field: 'nombre_cliente', headerName: 'Nombre', flex: 1.5 },
  { field: 'cliente', headerName: 'Clave', flex: 0.4 },
  { field: 'clave_anterior', headerName: 'Clave anterior', flex: 0.6 },
  {
    field: 'rfc',
    headerName: 'RFC',
    type: 'number',
    flex: 0.8
  },
  {
    field: 'agente',
    headerName: 'Agente',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    flex: 0.5
    // valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`
  },
  {
    field: 'age2',
    headerName: 'Nombre Comercial',
    type: 'number',
    flex: 1
  }
];

const rows = [
  {
    nombre: 'DOOREMALEN INDUSTRIES MEXICO, SA DE CV ',
    lastName: 'U100085',
    firstName: '2600',
    age: 'ALE2-00123F-Z9',
    fullName: 'Administrador VITServices',
    age2: 'ALEQUIP SA DE CV'
  },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 }
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable({ datos }) {
  const [arregloDeClientes, setArregloDeClientes] = useState([]);

  useEffect(() => {
    console.log('me he montado o actualizado');
    console.log(datos.length);
    if (datos.length > 0) {
      console.log('datos de cliente arreglo', datos);
      const arregloDeClientesConID = datos[0].map((item) => {
        // console.log("item",item)
        return {
          ...item,
          id: item.cliente,
        };
      });
      console.log("arregloDeclientesConID debajo")
      console.log(arregloDeClientes["0"])
      console.log(arregloDeClientesConID);
      setArregloDeClientes(arregloDeClientesConID);
    }
  }, [datos]);

  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={arregloDeClientes}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 50, 100]}
        checkboxSelection
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        sx={{
          border: 0,
          '& .MuiDataGrid-columnHeader': {
            py: 0.5, // Reduce vertical padding in header
            px: 1, // Reduce horizontal padding in header,
            backgroundColor: 'primary.dark',
            color: 'primary.lighter'
          },
          '& .MuiDataGrid-menuIconButton': {
            color: 'primary.light',
            opacity: 1 // make sure it’s fully visible
          },
          // recolor the sort icon (up/down arrow)
          '& .MuiDataGrid-sortIcon': {
            color: 'primary.light',
            opacity: 1 // ensure it's fully visible
          }
        }}
      />
    </Paper>
  );
}
