import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import Paper from '@mui/material/Paper';

import { useState, useEffect } from 'react';
import { bgcolor } from '@mui/system';

const columnsA = [
  // { field: 'tramite_aduana', headerName: 'Concepto', flex: .5, align: 'right', headerAlign: 'right' },
  { field: 'concepto', headerName: 'Concepto', flex: .5, align: 'right', headerAlign: 'right' },
  // { field: 'nombre_concepto', headerName: 'Nombre Concepto', flex: 1, align: 'left' },
  { field: 'descripcion', headerName: 'Nombre Concepto', flex: 1, align: 'left' },
  { field: 'moneda', headerName: 'Moneda', flex: .6, align: 'left', headerAlign: 'left' },
  {
    field: 'importe',
    headerName: 'Importe',
    type: 'number',
    flex: .6,
    align: 'right'
  },
  {
    field: 'importe_me',
    headerName: 'Importe M.E',
    description: 'This column has a value getter and is not sortable.',
    sortable: true,
    flex: .7,
    align: 'right',
    headerAlign: 'right'
    // valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`
  },
  { field: 'factura', headerName: 'Factura', align: 'right', flex: .8, headerAlign: 'right' }
];


const columnsB = [
  { field: 'tramite_aduana', headerName: 'Concepto', flex: .5, align: 'right', headerAlign: 'right' },
  { field: 'nombre_concepto', headerName: 'Nombre Concepto', flex: 1, align: 'left' },
  { field: 'moneda', headerName: 'Moneda', flex: .6, align: 'left', headerAlign: 'left' },
  {
    field: 'importe',
    headerName: 'Importe',
    type: 'number',
    flex: .6,
    align: 'right'
  },
  {
    field: 'importe_me',
    headerName: 'Importe M.E',
    description: 'This column has a value getter and is not sortable.',
    sortable: true,
    flex: .7,
    align: 'right',
    headerAlign: 'right'
    // valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`
  },
  { field: 'factura', headerName: 'Factura', align: 'right', flex: .8, headerAlign: 'right' }
];

const rows = [
  { id: 5, tramite_aduana: 1, moneda: 'Snow', nombre_concepto: 'Jon', importe: 35, importe_me: 5 },
  { id: 5, tramite_aduana: 1, moneda: 'Snow', nombre_concepto: 'Jon', importe: 35, importe_me: 5 },
  { id: 5, tramite_aduana: 2, moneda: 'Lannister', nombre_concepto: 'Cersei', importe: 42, importe_me: 5 },
  { id: 5, tramite_aduana: 3, moneda: 'Lannister', nombre_concepto: 'Jaime', importe: 45, importe_me: 5 },
  { id: 5, tramite_aduana: 4, moneda: 'Stark', nombre_concepto: 'Arya', importe: 16, importe_me: 5 },
  { id: 5, tramite_aduana: 5, moneda: 'Targaryen', nombre_concepto: 'Daenerys', importe: null, importe_me: 5 },
  { id: 5, tramite_aduana: 6, moneda: 'Melisandre', nombre_concepto: null, importe: 150, importe_me: 5 },
  { id: 5, tramite_aduana: 7, moneda: 'Clifford', nombre_concepto: 'Ferrara', importe: 44, importe_me: 5 },
  { id: 5, tramite_aduana: 8, moneda: 'Frances', nombre_concepto: 'Rossini', importe: 36, importe_me: 5 },
  { id: 5, tramite_aduana: 9, moneda: 'Roxie', nombre_concepto: 'Harvey', importe: 65, importe_me: 5 }
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable({ datos, flag }) {
  const [arregloIngresos, setArregloIngresos] = useState([]);

  useEffect(() => {
    if (datos) {
      if (flag == 'Ingresos') {
        console.log(datos);
        let ingresosFiltrados = datos.filter((item) => {
          return item.naturaleza === 'Ingresos';
        });
        let ingresosConID = ingresosFiltrados.map((item) => {
          return {
            ...item,
            importe_me: (Math.floor(item.importe_me * 100) / 100).toFixed(2),
            importe: (Math.floor(item.importe * 100) / 100).toFixed(2),
            id: Math.floor(Math.random() * 100)
          };
        });
        console.log('ingresos con id', ingresosConID);
        setArregloIngresos(ingresosConID);
      } else if (flag == 'Gastos') {
        console.log(datos);
        let ingresosFiltrados = datos.filter((item) => {
          return item.naturaleza === 'Gastos';
        });
        let ingresosConID = ingresosFiltrados.map((item) => {
          return {
            ...item,
            importe_me: (Math.floor(item.importe_me * 100) / 100).toFixed(2),
            importe: (Math.floor(item.importe * 100) / 100).toFixed(2),
            id: Math.floor(Math.random() * 100)
          };
        });
        console.log('ingresos con id', ingresosConID);
        setArregloIngresos(ingresosConID);
      } else if (flag !== 'Ingresos' && flag !== 'Gastos'){
        const datosDeIngresosConID = datos.map((item)=>{
          return {
            ...item,
            importe_me: (Math.floor(item.importe_me * 100) / 100).toFixed(2),
            importe: (Math.floor(item.importe * 100) / 100).toFixed(2),
            id: Math.floor(Math.random() * 100)
          }
        })
        setArregloIngresos(datosDeIngresosConID)
      }
    }
  }, [datos]);

  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={arregloIngresos}
        columns={flag !== 'Ingresos' && flag !== 'Gastos' ? columnsA : columnsB}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        // checkboxSelection
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        sx={{
          border: 0,
          '& .MuiDataGrid-cell': {
            py: 0 // Reduce vertical padding in cells
            // px: 1,   // Reduce horizontal padding in cells
          },
          '& .MuiDataGrid-columnHeader': {
            py: 0.5, // Reduce vertical padding in header
            px: 1, // Reduce horizontal padding in header,
            backgroundColor: 'primary.darker',
            color: 'primary.lighter'
          }
        }}
      />
    </Paper>
  );
}
