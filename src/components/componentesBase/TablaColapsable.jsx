import React from 'react';

// MUI
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';

//Ant Design
import { ArrowDownOutlined } from '@ant-design/icons';
import { ArrowUpOutlined } from '@ant-design/icons';
import { CheckCircleOutlined } from '@ant-design/icons';
import { CheckCircleTwoTone } from '@ant-design/icons';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function createData(name, calories, fat, carbs, protein, price, clave) {
  return {
    name,
    clave,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1
      }
    ]
  };
}

function createData2(tramite, fecha, pedimento, tipo, precintos, clave, ctePedimento, impuesto, cteFacturacion) {
  return {
    tramite,
    fecha,
    pedimento,
    tipo,
    precintos,
    clave,
    ctePedimento,
    impuesto,
    cteFacturacion,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1
      }
    ]
  };
}

function Row(props) {
  const { row, isSelected, onSelect } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.calories}</TableCell>
        <TableCell align="right">{row.fat}</TableCell>
        <TableCell align="right">{row.carbs}</TableCell>
        <TableCell align="right">{row.protein}</TableCell>
        <TableCell align="right">{row.clave}</TableCell>
        <TableCell align="center">—</TableCell> {/* Placeholder */}
        <TableCell align="center">—</TableCell>
        <TableCell align="center">—</TableCell>
        {/*  Selection Column */}
        <TableCell align="center">
          <IconButton
            onClick={onSelect}
            aria-label={isSelected ? `Deselect ${row.name}` : `Select ${row.name}`}
            color={isSelected ? 'success' : 'default'}
            size="medium"
          >
            {isSelected ? <CheckCircleTwoTone fontSize="large" /> : <CheckCircleOutlined fontSize="large" />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detalle del Trámite
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell align="right">Moneda</TableCell>
                    <TableCell align="right">Importe</TableCell>
                    <TableCell align="right">Importe ME</TableCell>
                    <TableCell align="right">Factura</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">{Math.round(historyRow.amount * row.price * 100) / 100}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    clave: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired
  }).isRequired
};

// ROW PROPTYPES 2
Row.propTypes = {
  row: PropTypes.shape({
    tramite: PropTypes.number.isRequired,
    fecha: PropTypes.number.isRequired,
    pedimento: PropTypes.number.isRequired,
    tipo: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired
      })
    ).isRequired,
    clave: PropTypes.string.isRequired,
    ctePedimento: PropTypes.number.isRequired,
    impuesto: PropTypes.number.isRequired,
    cteFacturacion: PropTypes.number.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired
  }).isRequired
};

const rows = [
  createData('TrámiteA', 159, 6.0, 24, 4.0, 3.99, 123),
  createData('TrámiteB', 237, 9.0, 37, 4.3, 4.99, 123),
  createData('TrámiteC', 262, 16.0, 24, 6.0, 3.79, 123)
];
// tramite, fecha, pedimento, tipo, precintos, clave, ctePedimento, impuesto, cteFacturacion

const TablaColapsable = ({ datos }) => {
  const [selectedRow, setSelectedRow] = React.useState(null);

  const handleSelect = (rowName) => () => {
    setSelectedRow(rowName);
  };

  const newRowsArray = datos.map((item) => {
    createData2(item.tramite_aduana, item.fecha, item.pedimento, item.tipo, item.precintos, item.clave, item.cliente_pedimento)
  });
  

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Trámite</TableCell>
            <TableCell align="right">Fecha</TableCell>
            <TableCell align="right">Pedimento</TableCell>
            <TableCell align="right">Tipo</TableCell>
            <TableCell align="right">Precintos</TableCell>
            <TableCell align="center">Clave</TableCell>
            <TableCell align="center">Cte. Pedimento</TableCell>
            <TableCell align="center">Impuesto</TableCell>
            <TableCell align="center">Cte. Facturación</TableCell>
            <TableCell align="center">Selección</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* {rows.map((row) => (
            <Row key={row.name} row={row} isSelected={selectedRow === row.name} onSelect={handleSelect(row.name)} />
          ))} */}
          {newRowsArray.map((row) => (
            <Row
              key={row.tramite_aduana}
              row={row}
              isSelected={selectedRow === row.tramite_aduana}
              onSelect={handleSelect(row.tramite_aduana)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablaColapsable;
