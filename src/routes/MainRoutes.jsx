import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import PagesLayout from 'layout/Pages';
import SimpleLayout from 'layout/Simple';


import { SimpleLayoutType } from 'config';


//Componentes
import EstCambiosTramitesAduanales from '../components/estaciones/est-cambios-tramites-aduanales'

// pages routing
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon')));

const AppContactUS = Loadable(lazy(() => import('pages/contact-us')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

//renderizar - sample page 2
const SamplePage2 = Loadable(lazy(() => import('pages/extra-pages/sample-page2')))

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        // {
        //   path: 'sample-page',
        //   element: <SamplePage />
        //   // element: <EstCambiosTramitesAduanales/>
        // },
        {
          path: 'user-page',
          element: <EstCambiosTramitesAduanales/>
        },
        {
          path: 'sample-page2', 
          element: <SamplePage2/> //Ejemplos de componentes para pantalla de Auditoria de Trazabilidad - Deposito # 167957
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
