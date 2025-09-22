import React from 'react';
import { useState, useEffect } from 'react';
//MUI
import { DataGrid, Toolbar, ToolbarButton, FilterPanelTrigger } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';

//Idioma
import { esES } from '@mui/x-data-grid/locales';

//Ant Design
import { FilterOutlined } from '@ant-design/icons';

const columns = [
  { field: 'cliente_documento', headerName: 'Cliente', flex: 2, height: 500 },
  { field: 'ficha_deposito', headerName: 'Ficha Depósito', flex: 0.5, align: 'right', headerAlign: 'right' },
  { field: 'fecha_deposito_documento', headerName: 'Fecha', flex: 1 },
  {
    field: 'importe_ficha_deposito',
    headerName: 'Importe',
    type: 'number',
    flex: 1,
    align: 'right',
    headerAlign: 'right'
  },
  {
    field: 'saldo_actual_ficha',
    headerName: 'Saldo Actual',
    type: 'number',
    sortable: false,
    flex: 1,
    align: 'right',
    headerAlign: 'right'
  },
  {
    field: 'poliza_ficha',
    headerName: 'Póliza',
    flex: 1,
    align: 'right',
    headerAlign: 'right'
  }
];

// const rows = [
//   {
//     id: 'Cliente A',
//     fecha: '12/1/2025',
//     ficha_deposito: '168305',
//     importe: 275000,
//     saldo_actual: 900,
//     poliza: '654'
//   },
//   {
//     id: 'Cliente B',
//     fecha: '8/8/2025',
//     ficha_deposito: '167957',
//     importe: 370896,
//     saldo_actual: 1000,
//     poliza: '123'
//   },
//   {
//     id: 'Cliente C',
//     fecha: '9/12/2025',
//     ficha_deposito: '168002',
//     importe: 452000,
//     saldo_actual: 2500,
//     poliza: '456'
//   }
// ];

const paginationModel = { page: 0, pageSize: 100 };

function CustomToolbar({ setFilterButton }) {
  return (
    <Toolbar sx={{ height: '80px', display: 'flex', justifyContent: 'left' }}>
      <Tooltip title="Filtros">
        <FilterPanelTrigger render={<ToolbarButton />} ref={setFilterButton}>
          <FilterOutlined fontSize="40px" />
        </FilterPanelTrigger>
      </Tooltip>
    </Toolbar>
  );
}

export default function DataTable({ rowsArray }) {
  const [filterButton, setFilterButton] = useState(null);
  return (
    //Altura default altura 400 -->   <Paper sx={{ height: 400, width: '100%' }}>
    <Paper sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        showToolbar
        slots={{ toolbar: CustomToolbar }}
        slotProps={{
          panel: {
            target: filterButton
          },
          toolbar: { setFilterButton }
        }}
        rows={rowsArray[0]}
        getRowId={(row) => `${row.documento}`}
        columns={columns}
        rowHeight={52} //valor default 52
        initialState={{ pagination: { paginationModel: paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{
          border: 0,
          '& .MuiDataGrid-columnHeader': {
            py: 0.5,
            px: 1,
            backgroundColor: 'primary.dark',
            color: 'primary.lighter'
          }
        }}
      />
    </Paper>
  );
}
