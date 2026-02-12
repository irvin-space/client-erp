import { lazy } from 'react';

// project imports
import Loadable from '../components/Loadable';
import DashboardLayout from '../layout/Dashboard';
import PagesLayout from '../layout/Pages';
import SimpleLayout from '../layout/Simple';


import { SimpleLayoutType } from '../config';


//Componentes
import EstTramitesAduanales from '@/components/estaciones/est_tramites_aduanales';
import EstCambiosTramitesAduanales from '../components/estaciones/est-cambios-tramites-aduanales'
import EstDesktop from '../components/estaciones/est-desktop';
import FileToJson from '@/components/estaciones/file-to-json';

//Pages
import TrazabilidadDePagos from '../components/estaciones/trazabilidad-de-pagos';
import DashboardTrazabilidadPagos from '../components/dashboards/dashboard-trazabilidad-pagos';
import DashboardTrazabilidadFacturas from '../components/dashboards/dashboard-trazabilidad-facturas';
import TrazabilidadDeFacturas from '@/components/estaciones/trazabilidad-de-facturas';
import FacturasDeClientesEntreFechas from '@/components/estaciones/FacturasDeClientesEntreFechas';
import EstFacturacionTramites from '@/components/estaciones/EstFacturacionTramites';
import EstFacturasDeTramitesAduanales from '@/components/estaciones/EstFacturasDeTramitesAduanales';
import EstFlujoDeEfectivoWeb from '@/components/estaciones/EstFlujoDeEfectivoWeb';

//Chatbot UI
import ChatbotUI from '../components/comun/ChatbotUI'; // Importa el componente ChatbotUI si es necesario

// pages routing
const MaintenanceError = Loadable(lazy(() => import('../pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('../pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('../pages/maintenance/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('../pages/maintenance/coming-soon')));

const AppContactUS = Loadable(lazy(() => import('../pages/contact-us')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('../pages/extra-pages/sample-page')));

//renderizar - sample page 2
const SamplePage2 = Loadable(lazy(() => import('../pages/extra-pages/sample-page2')))

// ==============================|| MAIN ROUTING ||============================== //



const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
         /* {
           path: 'sample-page',
           element: <SamplePage />
            //element: <EstCambiosTramitesAduanales/>
         }, */
        {
          path: 'user-page',
          element: <EstDesktop/>
        },
        {
          path: 'est-cambios-tramites-aduanales',
          //element: <EstTramitesAduanales/>
          element: <EstCambiosTramitesAduanales/>
        },
        {
          path: 'trazabilidad-de-pagos',
          //element:<FacturasDeClientesEntreFechas/>
          //element: <EstCambiosTramitesAduanales/>
          element: <TrazabilidadDePagos/>
        },
        {
          path: 'trazabilidad-de-facturas',
          element: <TrazabilidadDeFacturas/>
        },
        {
          path: 'dashboard-trazabilidad-pagos',
          element: <DashboardTrazabilidadPagos/>
        },
        {
          path: 'dashboard-trazabilidad-facturas',
          element: <DashboardTrazabilidadFacturas />
        },
        {
          path: 'facturas-de-clientes-entre-fechas',
          element: <FacturasDeClientesEntreFechas/>
        },
        {
          path: 'est-tramites-aduanales',
          element: <EstTramitesAduanales/>
        },
        {
          path: 'file-to-json',
          element: <FileToJson/>
        },
        {
          path: 'chatbot-ui',
          element: <ChatbotUI/>
        },
        {
          path: 'sample-page2', 
          element: <SamplePage2/>
        },
        {
          path: 'est-flujos-de-efectivo-web',
          element: <EstFlujoDeEfectivoWeb />
        },
        {
          path: 'est-facturas-de-tramites-aduanales',
          element: <EstFacturasDeTramitesAduanales />
        },
        {
          path: 'est-facturacion-tramites',
          element: <EstFacturacionTramites />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'coming-soon',
          //element: <MaintenanceComingSoon />
          //element: <EstFacturacionTramites />
          //element: <EstFacturasDeTramitesAduanales />
          //element: <EstFlujoDeEfectivoWeb />
        }
      ]
    },
    {
      path: '/maintenance',
      element: <PagesLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        }
      ]
    },
    {
      path: '/',
      element: <SimpleLayout layout={SimpleLayoutType.SIMPLE} />,
      children: [
        {
          path: 'contact-us',
          element: <AppContactUS />
        }
      ]
    }
  ]
};

export default MainRoutes;
