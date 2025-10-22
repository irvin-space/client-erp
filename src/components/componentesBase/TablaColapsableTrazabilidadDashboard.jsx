import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Collapse, IconButton, Box } from '@mui/material';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { toLower } from 'lodash-es';
// Assuming you have an icon imported, e.g., from @mui/icons-material or another source
// import ActionIcon from '@mui/icons-material/YourDesiredIcon'; // Replace with your actual icon

//Ant Design
import { ArrowDownOutlined } from '@ant-design/icons';
import { ArrowUpOutlined } from '@ant-design/icons';
import {FilePdfOutlined} from '@ant-design/icons'

import MonedaFormatoMiles from './MonedaFormatoMiles';

/**
 * @typedef {Object} ColumnConfig
 * @property {string} field - The data field name (e.g., 'tramite').
 * @property {string} headerName - The column header display name (e.g., 'Folio Trámite').
 * @property {Function} [cellRenderer] - Optional custom renderer function for the cell in the main table.
 * @property {string} [collapsibleField] - Optional field name pointing to the nested data array for the collapsible section.
 */

/**
 * @typedef {Object} CustomTableProps
 * @property {Array<Object>} data - Array of data objects to display.
 * @property {Array<ColumnConfig>} columnsConfig - Array defining table columns.
 */

/**
 * Componente de tabla reutilizable con filas colapsables.
 * @param {CustomTableProps} props
 */
const TablaColapsableTrazabilidadDashboard = ({ data, columnsConfig }) => {
  if (!data || data.length === 0 || !columnsConfig || columnsConfig.length === 0) {
    return (
      <Typography variant="h6" align="center" sx={{ my: 4 }}>
        No hay datos para mostrar.
      </Typography>
    );
  }

  const colorAzulMarino = '#00345D';

  // Separate columns into main table columns and potential collapsible column
  const mainColumns = columnsConfig.filter(col => !col.collapsibleField);
  const collapsibleColumn = columnsConfig.find(col => col.collapsibleField);

  // Helper function to render cell content for the MAIN table based on your existing logic
  const renderMainCellContent = (row, col) => {
    if (col.cellRenderer) {
      return col.cellRenderer(row);
    } else if (col.field === 'total_movimiento' || col.field === 'total_factura' || col.field === 'saldo_actual_factura') {
      return <MonedaFormatoMiles cantidad={row[col.field]} etiquetaHTML={'p'} /> ?? 'N/A';
    } else {
      return row[col.field] ?? 'N/A';
    }
  };

  // Helper function to render cell content for the NESTED table inside the collapsible section
  const renderNestedCellContent = (nestedItem, key, rowIndex, nestedIndex) => {
    // Example: Check if the key is 'actions' and render an icon
    if (key === 'Pdf') {
      // You can access the nestedItem to get its specific data if needed
      // e.g., const specificData = nestedItem.someField;
      return (
        <IconButton
          onClick={() => {
            console.log(`Action clicked for row ${rowIndex}, nested item ${nestedIndex}`);
            // Add your specific action logic here
          }}
          aria-label="pdf"
          size="medium"
        >
          <FilePdfOutlined style={{color:'red'}} /> {/* Replace ActionIcon with your chosen icon */}
        </IconButton>
      );
    }
    // For other keys, just display the value
    return nestedItem[key] ?? 'N/A';
  };

  // Sub-component for each row to manage its own open state
  const Row = ({ row, rowIndex }) => {
    const [open, setOpen] = useState(false);

    return (
      <React.Fragment>
        {/* Main Row */}
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          {/* Collapsible Toggle Cell */}
          <TableCell>
            <IconButton
              aria-label={open ? "cerrar fila" : "abrir fila"}
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            </IconButton>
          </TableCell>
          
          {/* Render main data cells */}
          {mainColumns.map((col, colIndex) => (
            <TableCell key={colIndex} align="center">
              {renderMainCellContent(row, col)}
            </TableCell>
          ))}
        </TableRow>

        {/* Collapsible Section Row */}
        <TableRow>
          {/* The cell containing the collapsed content spans all main columns plus the toggle cell */}
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={mainColumns.length + 1}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                {/* Display header for the collapsible section */}
                {collapsibleColumn && (
                  <Typography variant="h6" gutterBottom component="div">
                    {collapsibleColumn.headerName || 'Detalles'}
                  </Typography>
                )}
                
                {/* Check if there's data to display in the collapsible section */}
                {collapsibleColumn && row[collapsibleColumn.collapsibleField] && row[collapsibleColumn.collapsibleField].length > 0 ? (
                  <Table size="small" aria-label={`tabla colapsable de ${collapsibleColumn.headerName || 'fila'}`}>
                    <TableHead>
                      {/* Dynamically generate headers based on keys in the first nested item */}
                      <TableRow>
                        {Object.keys(row[collapsibleColumn.collapsibleField][0]).map((key, idx) => (
                          <TableCell key={idx} align="center">
                            {key.charAt(0).toUpperCase() + key.slice(1)} {/* Simple header from key */}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row[collapsibleColumn.collapsibleField].map((nestedItem, nestedIndex) => (
                        <TableRow key={nestedIndex}>
                          {Object.keys(nestedItem).map((key, valueIndex) => (
                            <TableCell key={valueIndex} align="center">
                              {renderNestedCellContent(nestedItem, key, rowIndex, nestedIndex)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  // If no collapsible data is defined or available, show a placeholder
                  <Typography variant="body2" sx={{ margin: 1, fontStyle: 'italic' }}>
                    {collapsibleColumn ? 'No hay detalles para mostrar.' : 'No hay información adicional.'}
                  </Typography>
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="tabla colapsable">
        <TableHead sx={{ backgroundColor: colorAzulMarino }}>
          <TableRow>
            {/* Empty cell for the collapse icon */}
            <TableCell sx={{ color: 'white', borderBottom: `1px solid ${colorAzulMarino}`, textTransform: 'none' }} />
            
            {/* Render main header cells */}
            {mainColumns.map((col, index) => (
              <TableCell
                key={index}
                align="center"
                sx={{ color: 'white', borderBottom: `1px solid ${colorAzulMarino}`, textTransform: 'none' }}
              >
                <Typography variant="subtitle1">{col.headerName}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <Row key={rowIndex} row={row} rowIndex={rowIndex} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablaColapsableTrazabilidadDashboard;