import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const columns = [
  { field: 'id', headerName: 'Concepto', width: 70,align: 'center'},
  { field: 'firstName', headerName: 'Nombre Concepto', flex:1 ,align: 'center'},
  { field: 'lastName', headerName: 'Moneda', flex:1,align: 'center'},
  {
    field: 'age',
    headerName: 'Cant',
    type: 'number',
    flex:1,
    align: 'center'
  },
  {
    field: 'fullName',
    headerName: 'Importe M.N',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    flex:1,
    align: 'center',
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
  { field: 'lastName', headerName: 'Importe M.E.',align: 'center', flex:1},
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {
  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{
          border: 0,
          '& .MuiDataGrid-cell': {
            py: 0, // Reduce vertical padding in cells
            // px: 1,   // Reduce horizontal padding in cells
          },
          '& .MuiDataGrid-columnHeader': {
            py: 0.5, // Reduce vertical padding in header
            px: 1,   // Reduce horizontal padding in header
          },
        }}
      />
    </Paper>
  );
}
