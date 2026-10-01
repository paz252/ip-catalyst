import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { MainLayout } from 'src/layouts/main';

// import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------
// Main
// const InnovationPage = lazy(() => import('src/pages/innovation'));

// Medical
const MedicalTechnologyPage = lazy(() => import('src/pages/innovation/med/medical-technology'));
const BiotechnologyPage = lazy(() => import('src/pages/innovation/med/biotechnology'));
const BioAnalysisPage = lazy(
  () => import('src/pages/innovation/med/analysis-of-biological-materials')
);

// ICT
const ComputerTechnologyPage = lazy(() => import('src/pages/innovation/ict/computer-technology'));
const DigitalCommunicationPage = lazy(
  () => import('src/pages/innovation/ict/digital-communication')
);
const TelecommunicationsPage = lazy(() => import('src/pages/innovation/ict/telecommunications'));
const BasicCommunicationProcessesPage = lazy(
  () => import('src/pages/innovation/ict/basic-communication-processes')
);
const ItMethodsForManagementPage = lazy(
  () => import('src/pages/innovation/ict/it-methods-for-management')
);
const AudioVisualTechnologyPage = lazy(
  () => import('src/pages/innovation/ict/audio-visual-technology')
);

// Electrical / Electronics
const ElectricalEnergyPage = lazy(
  () => import('src/pages/innovation/elec/electrical-machinery-apparatus-energy')
);
const SemiconductorsPage = lazy(() => import('src/pages/innovation/elec/semiconductors'));

// Mechanical / Industrial
const MachineToolsPage = lazy(() => import('src/pages/innovation/mech/machine-tools'));
const EnginesPage = lazy(() => import('src/pages/innovation/mech/engines-pumps-turbines'));
const SpecialMachinesPage = lazy(() => import('src/pages/innovation/mech/other-special-machines'));
const ControlPage = lazy(() => import('src/pages/innovation/mech/control'));
const TextilePaperPage = lazy(() => import('src/pages/innovation/mech/textile-paper-machines'));
const MechanicalElementsPage = lazy(() => import('src/pages/innovation/mech/mechanical-elements'));
const ThermalProcessesPage = lazy(
  () => import('src/pages/innovation/mech/thermal-processes-apparatus')
);
const TransportPage = lazy(() => import('src/pages/innovation/mech/transport'));

// Materials / Chemical / Nano
const MetallurgyPage = lazy(() => import('src/pages/innovation/mat/materials-metallurgy'));
const PolymersPage = lazy(
  () => import('src/pages/innovation/mat/macromolecular-chemistry-polymers')
);
const CoatingPage = lazy(() => import('src/pages/innovation/mat/surface-technology-coating'));
const ChemicalEngineeringPage = lazy(() => import('src/pages/innovation/mat/chemical-engineering'));
const NanoTechnologyPage = lazy(
  () => import('src/pages/innovation/mat/micro-structural-nano-technology')
);
const BasicChemistryPage = lazy(() => import('src/pages/innovation/mat/basic-materials-chemistry'));
const EnvironmentalTechnologyPage = lazy(
  () => import('src/pages/innovation/mat/environmental-technology')
);

// Measurement / Optical
const MeasurementPage = lazy(() => import('src/pages/innovation/opt/measurement'));
const OpticsPage = lazy(() => import('src/pages/innovation/opt/optics'));

// Other
const OtherTechnologyPage = lazy(() => import('src/pages/innovation/other/other-technology'));
// ----------------------------------------------------------------------

export const innovationRoutes = [
  {
    // element: (
    //   <Suspense fallback={<SplashScreen />}> 
    //     <Outlet />
    //   </Suspense>
    // ),
    path: 'innovation',
    element: (
      <Suspense>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </Suspense>
    ),

    children: [
      // Medical
      {
        path: 'med',
        // element: <Outlet />,
        children: [
          { path: 'tech', element: <MedicalTechnologyPage /> },
          { path: 'biotech', element: <BiotechnologyPage /> },
          { path: 'bio-analysis', element: <BioAnalysisPage /> },
        ],
      },

      // ICT
      {
        path: 'ict',
        // element: <Outlet />,
        children: [
          { path: 'computers', element: <ComputerTechnologyPage /> },
          { path: 'communication', element: <DigitalCommunicationPage /> },
          { path: 'telecom', element: <TelecommunicationsPage /> },
          { path: 'basic-communication', element: <BasicCommunicationProcessesPage /> },
          { path: 'it-methods', element: <ItMethodsForManagementPage /> },
          { path: 'audio-visual-tech', element: <AudioVisualTechnologyPage /> },
        ],
      },

      // Electrical / Electronics
      {
        path: 'elec',
        // element: <Outlet />,
        children: [
          { path: 'energy', element: <ElectricalEnergyPage /> },
          { path: 'semiconductors', element: <SemiconductorsPage /> },
        ],
      },

      // Mechanical / Industrial
      {
        path: 'mech',
        element: <Outlet />,
        children: [
          { path: 'tools', element: <MachineToolsPage /> },
          { path: 'engines', element: <EnginesPage /> },
          { path: 'special-machines', element: <SpecialMachinesPage /> },
          { path: 'control', element: <ControlPage /> },
          { path: 'textile-paper-machines', element: <TextilePaperPage /> },
          { path: 'mechanical-elements', element: <MechanicalElementsPage /> },
          { path: 'thermal', element: <ThermalProcessesPage /> },
          { path: 'transport', element: <TransportPage /> },
        ],
      },

      // Materials / Chemical / Nano
      {
        path: 'mat',
        // element: <Outlet />,
        children: [
          { path: 'metals', element: <MetallurgyPage /> },
          { path: 'polymer-chemistry', element: <PolymersPage /> },
          { path: 'coating', element: <CoatingPage /> },
          { path: 'chemical-engineering', element: <ChemicalEngineeringPage /> },
          { path: 'nano-tech', element: <NanoTechnologyPage /> },
          { path: 'basic-materials-chemistry', element: <BasicChemistryPage /> },
          { path: 'env-tech', element: <EnvironmentalTechnologyPage /> },
        ],
      },

      // Optical
      {
        path: 'opt',
        // element: <Outlet />,
        children: [
          { path: 'measurement', element: <MeasurementPage /> },
          { path: 'optics', element: <OpticsPage /> },
        ],
      },

      {
        path: 'other',
        // element: <Outlet />,
        children: [{ path: 'other-tech', element: <OtherTechnologyPage /> }],
      },
    ],
  },
];
