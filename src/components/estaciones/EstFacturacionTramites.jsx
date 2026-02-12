import React, { useState, useEffect } from 'react';

import { jsPDF } from 'jspdf';

//Mui
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

import dayjs from 'dayjs';

//Componentes propios del proyecto
import ConceptosDeFacturacion from '../servicios/ConceptosDeFacturacion';
import RadioButtonsGroup from '../componentesBase/RadioButtonsGroup';
import FirstComponent from '../componentesBase/FirstComponent';
import TasaDeIVA from '../componentesBase/TasaDeIVA';
import BusquedaDeClientes from '../servicios/busqueda-de-clientes';
import BusquedaDeClaveUsoCFDI from '../servicios/BusquedaDeClaveUsoCFDI';
import ComponenteListaDinamica from '../componentesBase/ComponenteLIstaDinamica';
import TipoDeCambio from '../componentesBase/TipoDeCambio';
import MuiTablaBase from '../componentesBase/MuiTablaBase';
import AltaDeDomicilios from '../componentesBase/AltaDeDomicilios';
import TramitesAduanalesAFacturar from '../componentesBase/TramitesAduanalesAFacturar';
import MetodoDePagoModal from '../componentesBase/MetodoDePagoModal';
import FacturaDeCliente from '../componentesBase/FacturasDeCliente';
import ComponenteListaNoDinamica from '../componentesBase/ComponenteListaNoDinamica';

import useSQL from '@/hooks/useSQL';
import useAuth from '@/hooks/useAuth';

//Componente EstFacturacionTramites
const EstFacturacionTramites = () => {
  const [factura, setFactura] = useState('');
  const [datosConsultaFactura, setDatosConsultaFactura] = useState('');
  const [facturacion, setFacturacion] = useState('Normal');
  const [numeroDecliente, setNumeroDeCliente] = useState(null);
  const [dataDeCliente, setDataDeCliente] = useState('');
  const [cliente, setCliente] = useState('');
  const [tipoDeCambio, setTipoDeCambio] = useState('');
  const [tasaImpuesto, setTasaImpuesto] = useState(1);
  const [tasaImpuestoOtro, setTasaImpuestoOtro] = useState(0);
  const [moneda, setMoneda] = useState('');
  const [remesa, setRemesa] = useState('');
  const [claveCFDI, setClaveCFDI] = useState('');
  const [descripcionCFDI, setDescripcionCFDI] = useState('');
  const [metodoDePago, setMetodoDePago] = useState('');
  const [proyecto, setProyecto] = useState('');
  const [domicilio, setDomicilio] = useState(158);
  const [sucursal, setSucursal] = useState('');

  const [openConceptosDeFactura, setOpenConceptosDeFactura] = useState(false);
  const [openBusquedaClientePedimentoModal, setOpenBusquedaClientePedimentoModal] = useState(false);
  const [openBusquedaDeClaveUsoCFDIModal, setOpenBusquedadeClaveUsoCFDIModal] = useState(false);

  const [ingresosAgencia, setIngresosAgencia] = useState([]);
  const [gastosCliente, setGastosCliente] = useState([]);
  const [importeGastosPorCuentaDelCliente, setImporteGastosPorCuentaDelCliente] = useState(0);


  const [isCreatingFactura,setIsCreatingFactura] = useState(false)







  const { executeFetch } = useSQL();
  const {user} = useAuth()

  useEffect(() => {
    const fetchClienteData = async () => {
      const { success, data } = await executeFetch(
        'SELECT cliente,sucursal,nombre_cliente,rfc,clave_vieja FROM Clientes WHERE cliente = 48'
      );
      if (success) {
        console.log('prd');
        console.log(data);
        // const dataInfoStructure = ` ${data[0][0].nombre_cliente.trim()} ${data[0][0].cliente} ${data[0][0].clave_vieja} ${data[0][0].rfc} `;
        const dataInfoStructure = `${data[0][0].cliente} - ${data[0][0].nombre_cliente.trim()}`;
        setDataDeCliente(dataInfoStructure);
      }
    };

    if (datosConsultaFactura?.cliente) {
      fetchClienteData();
    }
  }, [datosConsultaFactura]);

  // useEffect(()=>{
  //   console.log("when i mount, or when i update")
  //   console.log(dataDeCliente)
  // },[dataDeCliente])

  const handleIniciar = async (e) => {
    console.log(factura)
    if (!factura) {
      console.log('No existe valor de factura, se intentara crear factura');
      //Verifica la sucursal del usuario y la asigna
      console.log(user)
      let userSucursal = user.sucursal.trim()
      setSucursal(userSucursal)
      //Se activa modo creacion de factura
      setIsCreatingFactura(true)
    } else {
      console.log('Iniciar...');
      // Default export is a4 paper, portrait, using millimeters for units

      console.log('Consultando...', typeof factura, Number(factura), typeof Number(factura));

      const { success, data } = await executeFetch('Carga_Factura_Tramite', {
        factura: factura
      });

      const handleTasaDecimalAOpcion = async (valorDecimal) => {
        let opcionMapeada = 0;
        const { success, data } = await executeFetch('Combo_Tasas_Ivas', { otros: 1, soloActivas: 1 });
        if (success) {
          if (data[0].length > 0) {
            let valorIvaConvertida = (valorDecimal * 100).toFixed(2);
            const foundOptionObject = data[0].find((item, index, array) => {
              let cleanRetreivedTasaIVA = item.tasa_iva.trim();
              if (cleanRetreivedTasaIVA === valorIvaConvertida) {
                return item;
              }
            });
            opcionMapeada = foundOptionObject.folio;
          }
        }
        return opcionMapeada;
      };

      if (success) {
        console.log(data[0][0]);
        console.log(data);
        setDatosConsultaFactura(data[0][0]);
        if (data[0][0].tasa_impuesto) {
          let opcionParaTasaDeIVA = await handleTasaDecimalAOpcion(data[0][0].tasa_impuesto);
          setTasaImpuesto(opcionParaTasaDeIVA);
        }
        setMoneda(data[0][0].moneda.trim());
        setIngresosAgencia(data[1]);
        setGastosCliente(data[2]);
        setRemesa(data[0][0].tipo_pedimento.trim());
        if (data[0][0].factura_electronica) {
          setFacturacion('Electrónica');
        } else {
          setFacturacion('Normal');
        }
        setProyecto(data[0][0].proyecto_cliente);
        console.log('data2 importe', data[2].importe);
        if (data[2].length > 0) {
          const importes = data[2].map((item, index, array) => {
            return item.importe;
          });
          console.log('importes', importes);
          let total = 0;
          importes.forEach((item) => (total = total + item));
          console.log(total);
          setImporteGastosPorCuentaDelCliente(total);
        }
      }
    }
  };

  const handleFacturacion = (e) => {
    if (datosConsultaFactura.factura_electronica) {
      setFacturacion('Electrónica');
    } else {
      setFacturacion('Normal');
    }
  };

  const handleMoneda = (e) => {
    console.log('moneda display here');
    console.log(e.target.value);
    setMoneda(e.target.value);
  };

  const handleRemesa = (e) => {
    console.log('remesa display here');
    console.log(e.target.value);
    setRemesa(e.target.value);
  };

  const handleMetodoDePago = (e) => {
    console.log('!aqui!', e);
    setMetodoDePago(e);
  };

  const handleFactura = (e) => {
    console.log(factura);
    console.log('factura is changing', e.target.value);
    setFactura(e.target.value);
  };

  const handleTasaDeIVA = (e) => {
    console.log('tasas', e);
    setTasaImpuesto(e);
  };

  const handleSelectedCliente = (e) => {
    console.log('handleSelectedCliente...');
    console.log(e);
    setCliente(` ${e.nombre_cliente.trim()} ${e.cliente} ${e.clave_anterior} ${e.rfc.trim()} `);
    setOpenBusquedaClientePedimentoModal(false);
  };

  const handleProyecto = (e) => {
    console.log('proyecto', e);
  };

  const handleDomicilio = (e, a, b) => {
    console.log('domicilio infdo', e);
    console.log('domicilio infdo', a);
    console.log('domicilio infdo', b);
    setDomicilio(a);
  };

  const handleTipoDeCambio = (e) => {
    setDatosConsultaFactura('');
    console.log('fdfd', e);
    console.log(e);
    let te = e;
    console.log(te);
    setTipoDeCambio(te);
  };

  const handleSucursal = (e, y) => {
    console.log('handle sucursal', e);
    console.log('handle sucursal...', y);
    setSucursal(e);
  };

  const handleSeleccionCFDI = (e) => {
    console.log('descripcion CFDI', e);
    setClaveCFDI(e.clave);
    setOpenBusquedadeClaveUsoCFDIModal(false);
    setDescripcionCFDI(e.descripcion);
  };

  const handleVistaPrevia = () => {
    // Default export is a4 paper, portrait, using millimeters for units
    const doc = new jsPDF();
    doc.text('Hello world!', 10, 10);
    doc.save('a4.pdf');
  };

  const handleCancelar = (e) => {
    console.log('cancelar click');
    setDatosConsultaFactura('');
    setIngresosAgencia([]);
    setGastosCliente([]);
  };

  const handleGuardar = (e) => {
    console.log("Se procedera a guardar los valores capturados")
    console.log(e)
  }

  return (
    <Paper square={false} elevation={4} sx={{ p: 4 }}>
      <Box sx={{ backgroundColor: '' }}>
        <Grid container spacing={1.5}>
          {/* Titulo */}
          <Grid size={12}>
            <Typography variant="h2">Facturación de Trámites Aduanales</Typography>
            <Divider />
          </Grid>
          {/* Factura, Fiscal, Cambiar Folio, Cambiar Tipo, Estado Actual */}
          <Grid container size={12} spacing={2} sx={{ backgroundColor: '', alignItems: 'center' }}>
            <Grid container size={6} sx={{ alignItems: 'center' }}>
              <Grid size={4}>
                <ConceptosDeFacturacion
                  onChange={handleFactura}
                  onClose={() => setOpenConceptosDeFactura(false)}
                  onOpen={() => setOpenConceptosDeFactura(true)}
                  open={openConceptosDeFactura}
                  label={'Factura'}
                  value={factura}
                />
              </Grid>
              <Grid size={4}>
                <TextField label={'Fiscal'} margin="normal" value={datosConsultaFactura ? datosConsultaFactura.fiscal : ''} />
              </Grid>
              <Grid size={3}>
                <Button fullWidth variant="contained">
                  Cambiar Folio
                </Button>
              </Grid>
            </Grid>
            <Grid container size={6} sx={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: '' }}>
              <Grid size={4}>
                <TextField value={datosConsultaFactura ? datosConsultaFactura.estado_actual : ''} label={'Estado Actual'} margin="normal" />
              </Grid>
            </Grid>
          </Grid>
          {/* Facturacion, Fecha, Cambiar Fecha */}
          <Grid container size={12} spacing={2} sx={{ backgroundColor: '' }}>
            <Grid container size={8} sx={{ backgroundColor: '', alignItems: 'center' }}>
              <Grid size={6}>
                <RadioButtonsGroup
                  onChange={(e) => handleFacturacion(e)}
                  label={'Facturación'}
                  values={['Normal', 'Electrónica']}
                  direction={'row'}
                  value={facturacion}
                />
              </Grid>
              <Grid size={2.3}>
                <Button fullWidth variant="contained">
                  Cambiar Tipo
                </Button>
              </Grid>
            </Grid>
            <Grid size={2} sx={{ backgroundColor: '' }}>
              <FirstComponent label={'Fecha'} value={datosConsultaFactura ? dayjs(datosConsultaFactura.fecha_factura) : dayjs()} />
            </Grid>
            <Grid size={2} sx={{ backgroundColor: '', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Button fullWidth variant="contained">
                Cambiar Fecha
              </Button>
            </Grid>
          </Grid>
          {/* Cliente, Tipo Cambio, Cambiar */}
          <Grid container size={12} spacing={2} sx={{ backgroundColor: '', alignItems: 'center' }}>
            <Grid size={4}>
              <BusquedaDeClientes
                editando={false}
                open={openBusquedaClientePedimentoModal}
                onClose={() => setOpenBusquedaClientePedimentoModal(false)}
                onOpen={() => setOpenBusquedaClientePedimentoModal(true)}
                value={datosConsultaFactura?.cliente ? dataDeCliente : cliente}
                onSelectedRow={handleSelectedCliente}
              />
            </Grid>
            <Grid container size={8} spacing={2} sx={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: '' }}>
              <Grid size={3}>
                {/* <TipoDeCambio  valorTipoDeCambio={datosConsultaFactura ? datosConsultaFactura.tipo_cambio : ''} /> */}
                <ComponenteListaDinamica
                  label="Tipo de cambio"
                  instruccionSQL={'COMBO_TIPOS_CAMBIO'}
                  parametros={{}}
                  valueKey={'nTipo_Cambio'}
                  labelKey={'cTipo_Cambio'}
                  value={tipoDeCambio}
                  // retornaObjeto={true}
                  onChange={(e) => handleTipoDeCambio(e)}
                />
              </Grid>
              <Grid size={3}>
                <TextField label="Valor Tipo de cambio" value={datosConsultaFactura?.tipo_cambio ?? tipoDeCambio} />
              </Grid>
              <Grid size={2}>
                <Button fullWidth variant="contained">
                  Cambiar
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {/* No, CA, RFC */}
          <Grid container size={12} spacing={2} sx={{ backgroundColor: '' }}>
            <Grid size={4}>{/* <TextField label="No. - CA - R.F.C." fullWidth /> */}</Grid>
            <Grid container size={8} justifyContent={'flex-end'}>
              <Grid size={3}>
                <ComponenteListaNoDinamica value={moneda} onChange={handleMoneda} label="Moneda" etiquetas={['MXP', 'USCY']} />
              </Grid>
            </Grid>
          </Grid>
          {/* Domiciliio,Tasa IVA */}
          <Grid container size={12} spacing={2} sx={{ backgroundColor: '' }}>
            <Grid container size={6}>
              <Grid size={8}>
                <ComponenteListaDinamica
                  key={`domicilio-${datosConsultaFactura?.cliente ?? 'initial'}`}
                  label="Domicilio"
                  instruccionSQL={'COMBO_DOMICILIOS'}
                  parametros={{ tabla: "'clientes'", clave: `${datosConsultaFactura?.cliente}` ?? '', tipo: "'%'" }}
                  valueKey={'domicilio'}
                  labelKey={'direccion'}
                  // onChange={handleDomicilio}
                  onChange={(value, fullObject) => {
                    console.log('Selected ID:', value); // "11"
                    console.log('Full address object:', fullObject); // {domicilio: "11", direccion: "..."}
                    setDomicilio('hdhd'); // Store primitive ID
                    // ✅ FIXED TYPO: was "e.lodalidad" (invalid property)
                  }}
                  retornaObjeto={false}
                  value={datosConsultaFactura?.domicilio_cliente}
                />
              </Grid>
              <Grid size={4}>
                <AltaDeDomicilios isEnable={true} />
              </Grid>
            </Grid>
            <Grid container size={6} justifyContent={'flex-end'}>
              <Grid size={4}>{/* <ComponenteListaDinamica label="Tasa de IVA" /> */}</Grid>
              <Grid size={8}>
                <TasaDeIVA optionValue={tasaImpuesto} onChange={handleTasaDeIVA} textFieldValue={tasaImpuestoOtro.toFixed(2)} />
                {/* <TextField label={'Otro (%)'} fullWidth /> */}
              </Grid>
            </Grid>
          </Grid>
          {/* Remesa, Comentarios, Uso de CFDI*/}
          <Grid container size={12} spacing={2} sx={{ backgroundColor: '' }}>
            <Grid container size={6}>
              <Grid size={4}>
                {/* <ComponenteListaDinamica label="Remesa" /> */}
                <ComponenteListaNoDinamica
                  value={remesa}
                  onChange={handleRemesa}
                  label="Remesa"
                  etiquetas={['Importación', 'Exportación', 'Rectificación', 'Indemnización', 'Otros']}
                />
              </Grid>
              <Grid size={4}>
                <TextField value={datosConsultaFactura ? datosConsultaFactura.comentarios : ''} label="Comentarios" fullWidth />
              </Grid>
            </Grid>
            <Grid container size={6} justifyContent={'flex-end'}>
              {/* FALTA CREAR ESTE COMPONENTE BUSCADOR DE CFDI */}
              <Grid size={12}>
                {/* <ConceptosDeFacturacion label={'Uso de CFDI'} /> */}
                <BusquedaDeClaveUsoCFDI
                  open={openBusquedaDeClaveUsoCFDIModal}
                  onClose={() => setOpenBusquedadeClaveUsoCFDIModal(false)}
                  onOpen={() => {
                    setDatosConsultaFactura('');
                    setOpenBusquedadeClaveUsoCFDIModal(true);
                  }}
                  editando={false}
                  onSelectRow={(e) => handleSeleccionCFDI(e)}
                  value={datosConsultaFactura?.clave_uso_cfdi ? datosConsultaFactura?.clave_uso_cfdi : claveCFDI}
                  valueCFDIDescription={descripcionCFDI}
                />
              </Grid>
            </Grid>
          </Grid>
          {/* Proyecto, Descripcion */}
          <Grid container size={12} spacing={2} sx={{ backgroundColor: '' }}>
            <Grid container size={6}>
              <Grid size={4}>
                <ComponenteListaDinamica
                  instruccionSQL={'Trae_Proyectos_Cliente'}
                  parametros={{ cliente: `150`, factura: `605000`, otro: `0` }} //Modify hardcoded
                  valueKey={'proyecto'}
                  labelKey={'nombre_proyecto'}
                  value={proyecto}
                  onChange={handleProyecto}
                  label="Proyecto"
                />
              </Grid>
            </Grid>
            <Grid container size={6} justifyContent={'flex-end'}>
              <Grid size={8}>{/* <TextField label="Descripción CFDI" fullWidth /> */}</Grid>
            </Grid>
          </Grid>
          {/* Sucursal, F.Pago, (F.Pago) */}
          <Grid container size={12} spacing={2} sx={{ backgroundColor: '' }}>
            <Grid container size={6}>
              <Grid size={4}>
                <ComponenteListaDinamica
                  value={datosConsultaFactura ? datosConsultaFactura.sucursal.trim() : sucursal }
                  instruccionSQL={'combo_sucursales'}
                  valueKey={'sucursal'}
                  labelKey={'nombre_sucursal'}
                  parametros={{
                    '@cCentro': "'      1'"
                  }}
                  label="Sucursal"
                  onChange={handleSucursal}
                />
              </Grid>
            </Grid>
            <Grid container size={6} justifyContent={'flex-end'}>
              <Grid size={4}>{/* <ComponenteListaDinamica label="F.Pago" /> */}</Grid>
              <Grid size={4}>
                <MetodoDePagoModal isEnable={true} />
              </Grid>
            </Grid>
          </Grid>
          {/* Tramites Facturar, Distribucion de Proyectos, Metodo Pago*/}
          <Grid container size={12} spacing={2} sx={{ backgroundColor: '', mb: 8 }}>
            <Grid container size={6}>
              <Grid size={4}>
                <TramitesAduanalesAFacturar isEnable={true} />
              </Grid>
              <Grid size={5}>
                <Button variant="contained" fullWidth>
                  Distribución de Proyectos
                </Button>
              </Grid>
            </Grid>
            <Grid container size={6} justifyContent={'flex-end'}>
              <Grid size={6}>
                <ComponenteListaDinamica
                  onChange={handleMetodoDePago}
                  value={metodoDePago}
                  label="Método Pago"
                  instruccionSQL={'SELECT * FROM Formas_Pago'}
                  labelKey={'forma_pago'}
                  valueKey={'idForma_pago'}
                />
              </Grid>
            </Grid>
          </Grid>
          {/* Ingresos Agencia Aduanal */}
          <Grid container size={12} spacing={2} sx={{ backgroundColor: '', mb: 4 }}>
            <Grid size={12}>
              <Typography variant="h4">Ingresos Agencia Aduanal</Typography>
              <MuiTablaBase
                estructuraEncabezados={[
                  { propiedad: 'tramite', encabezadoTitulo: 'Trámite' },
                  { propiedad: 'concepto', encabezadoTitulo: 'Concepto' },
                  { propiedad: 'nombre', encabezadoTitulo: 'Nombre Concepto' },
                  { propiedad: 'moneda', encabezadoTitulo: 'Moneda' },
                  { propiedad: 'cantidad', encabezadoTitulo: 'Cant.' },
                  { propiedad: 'importe', encabezadoTitulo: 'Importe M.N.' },
                  { propiedad: 'importe_me', encabezadoTitulo: 'Importe M.E.' }
                ]}
                datos={ingresosAgencia}
                idPropiedad="concepto"
              />
            </Grid>
          </Grid>
          {/* Gastos por cuenta del cliente */}
          <Grid container size={12} spacing={2} sx={{ backgroundColor: '', mb: 8 }}>
            <Grid size={12}>
              <Typography variant="h4">Gastos por cuenta del cliente</Typography>
              <MuiTablaBase
                estructuraEncabezados={[
                  { propiedad: 'tramite', encabezadoTitulo: 'Trámite' },
                  { propiedad: 'concepto', encabezadoTitulo: 'Concepto' },
                  { propiedad: 'nombre', encabezadoTitulo: 'Nombre Concepto' },
                  { propiedad: 'moneda', encabezadoTitulo: 'Moneda' },
                  { propiedad: 'cantidad', encabezadoTitulo: 'Cant.' },
                  { propiedad: 'importe', encabezadoTitulo: 'Importe M.N.' },
                  { propiedad: 'importe_me', encabezadoTitulo: 'Importe M.E.' }
                ]}
                datos={gastosCliente}
                idPropiedad="concepto"
              />
            </Grid>
          </Grid>
          {/* Aplicar Anticipo, Aplicados, Por Aplicar */}
          <Grid container size={12} sx={{ backgroundColor: '' }}>
            <Grid container size={6} sx={{ backgroundColor: '' }}>
              <Grid size={4}>
                <Button variant="contained" fullWidth>
                  Aplicar Anticipo
                </Button>
                <Button variant="contained" sx={{ mt: 1, display: 'none' }} fullWidth>
                  Aplicar GXCC
                </Button>
              </Grid>
              <Grid size={4}>
                <TextField label="Aplicados" fullWidth />
                <TextField label="Aplicados" sx={{ mt: 1, display: 'none' }} fullWidth />
              </Grid>
              <Grid size={4}>
                <TextField label="Por Aplicar" fullWidth />
                <TextField label="Por Aplicar" sx={{ mt: 1, display: 'none' }} fullWidth />
              </Grid>
            </Grid>
            <Grid container size={6} justifyContent={'flex-end'}>
              <Grid size={4}>
                <TextField label="Importe" fullWidth value={importeGastosPorCuentaDelCliente} />
                <TextField label="Total" fullWidth />
              </Grid>
            </Grid>
          </Grid>
          {/* Gastos ya pagados, Documentos Relacionados */}
          <Grid container size={12}>
            <Grid container size={6}>
              <Grid size={12} sx={{ backgroundColor: '' }}>
                <Box sx={{ backgroundColor: '', height: '100%' }} alignItems={'center'}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip label="" sx={{ width: '50px', borderRadius: '10%', mr: 1, height: '20px', backgroundColor: 'lightgray' }} />
                    <Typography variant="h6">Gastos ya pagados</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Grid container size={6} justifyContent={'flex-end'}>
              <Grid container size={5}>
                {/* <Button variant="contained">Documentos Relacionados</Button> */}
                {/* <FacturaDeCliente isEnable={true}/> */}
              </Grid>
            </Grid>
          </Grid>

          {/* Botones Iniciar, Cancelar, Autorizar, Visa Previa, Pedimento Ppal */}
          <Grid container size={12} spacing={2} sx={{ backgroundColor: '' }}>
            <Grid container size={6}>
              <Grid size={2}>
                <Button disabled={isCreatingFactura} onClick={(e, b) => handleIniciar(e)} variant="contained" fullWidth>
                  Iniciar
                </Button>
              </Grid>
              <Grid size={2}>
                <Button disabled={!isCreatingFactura} onClick={(e) => handleGuardar(e)} variant="contained" fullWidth>
                  Guardar
                </Button>
              </Grid>
              <Grid size={4}>
                <Button onClick={(e) => handleCancelar(e)} color="secondary" variant="contained" fullWidth>
                  Cancelar
                </Button>
              </Grid>
              <Grid size={4}>
                <Button variant="contained" fullWidth>
                  Autorizar
                </Button>
              </Grid>
            </Grid>
            <Grid container size={6} justifyContent={'flex-end'}>
              <Grid size={4}>
                <Button onClick={() => handleVistaPrevia} variant="contained" fullWidth>
                  Vista Previa
                </Button>
              </Grid>
              <Grid size={4}>
                <Button variant="contained" fullWidth>
                  Pedimento Ppal
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

//Exportar componente
export default EstFacturacionTramites;
