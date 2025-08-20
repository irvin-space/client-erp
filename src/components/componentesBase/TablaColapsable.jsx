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

function createData2(tramite, fecha, pedimento, tipo, precintos, clave, ctePedimento, impuesto, cteFacturacion, history) {
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
    history
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
        <TableCell align="right" component="th" scope="row">
          {row.tramite}
        </TableCell>
        <TableCell align="left">{row.fecha}</TableCell>
        <TableCell align="left">{row.pedimento}</TableCell>
        <TableCell align="left">{row.tipo}</TableCell>
        <TableCell align="right">{row.precintos}</TableCell>
        <TableCell align="left">{row.clave}</TableCell>
        <TableCell align="left">{row.ctePedimento}</TableCell>
        <TableCell align="right">{row.impuesto}</TableCell>
        <TableCell align="left">{row.cteFacturacion}</TableCell>

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
                    <TableCell align="left">Nombre</TableCell>
                    <TableCell align="left">Tipo</TableCell>
                    <TableCell align="left">Moneda</TableCell>
                    <TableCell align="right">Importe</TableCell>
                    <TableCell align="right">Importe ME</TableCell>
                    <TableCell align="right">Factura</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((history) => (
                    <TableRow key={history.tramite}>
                      <TableCell align="left" component="th" scope="row">
                        {history.nombre_concepto}
                      </TableCell>
                      <TableCell align="left">{history.naturaleza}</TableCell>
                      <TableCell align="left">{history.moneda}</TableCell>
                      <TableCell align="right">{history.importe}</TableCell>
                      <TableCell align="right">{history.importe_me}</TableCell>
                      <TableCell align="right">{history.factura}</TableCell>
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

// ROW PROPTYPES 2
// Row.propTypes = {
//   row: PropTypes.shape({
//     tramite: PropTypes.number.isRequired,
//     fecha: PropTypes.number.isRequired,
//     pedimento: PropTypes.number.isRequired,
//     tipo: PropTypes.number.isRequired,
//     history: PropTypes.arrayOf(
//       PropTypes.shape({
//         amount: PropTypes.number.isRequired,
//         customerId: PropTypes.string.isRequired,
//         date: PropTypes.string.isRequired
//       })
//     ).isRequired,
//     clave: PropTypes.string.isRequired,
//     ctePedimento: PropTypes.number.isRequired,
//     impuesto: PropTypes.number.isRequired,
//     cteFacturacion: PropTypes.number.isRequired,
//     isSelected: PropTypes.bool.isRequired,
//     onSelect: PropTypes.func.isRequired
//   }).isRequired
// };

const TablaColapsable = ({ datos, datos2, onSelectRow }) => {
  const [selectedRow, setSelectedRow] = React.useState(null);

  const handleSelect = (rowName) => () => {
    console.log(rowName);
    // setSelectedRow(rowName);
    onSelectRow(rowName);
  };

  // Agrupar datos2 por tramite_aduanal
  const detailsMap = React.useMemo(() => {
    const map = {};
    datos2.forEach((detail) => {
      const key = detail.tramite_aduana;
      if (!map[key]) map[key] = [];
      map[key].push({
        ...detail,
        nombre_concepto: detail.nombre_concepto?.trim(),
        naturaleza: detail.naturaleza?.trim(),
        moneda: detail.moneda?.trim(),
        factura: detail.factura,
        importe: detail.importe,
        importe_me: detail.importe_me
      });
    });
    return map;
  }, [datos2]);

  // Crear filas con history correcto
  const rows = datos.map((item) => {
    const history = detailsMap[item.tramite_aduana] || [];

    return createData2(
      item.tramite_aduana,
      item.cfecha,
      item.pedimento,
      item.tipo,
      item.precintos,
      item.clave,
      item.cliente_pedimento,
      item.impuesto,
      item.cliente_facturacion,
      history
    );
  });

  console.log('below are the rows shape');

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="right">Trámite</TableCell>
            <TableCell align="left">Fecha</TableCell>
            <TableCell align="left">Pedimento</TableCell>
            <TableCell align="left">Tipo</TableCell>
            <TableCell align="right">Precintos</TableCell>
            <TableCell align="left">Clave</TableCell>
            <TableCell align="left">Cte. Pedimento</TableCell>
            <TableCell align="right">Impuesto</TableCell>
            <TableCell align="left">Cte. Facturación</TableCell>
            <TableCell align="center">Selección</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row) => <Row key={row.tramite} row={row} isSelected={selectedRow === row.tramite} onSelect={handleSelect(row)} />)
          ) : (
            <TableRow>
              <TableCell colSpan={11} align="center">
                <Typography variant="body2" color="textSecondary">
                  No se encontraron trámites
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablaColapsable;
