import React, { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';
// import ManageUser from '../views/AllPage/ManagePatient';
// import Managecontent from 'views/AllPage/ManageContent';
// import Managebroadcast from 'views/AllPage/ManageBroadcast';
// import DeleteUser from 'views/AllPage/DeletedUsers';
// import ManageCategory from 'views/AllPage/ManageCategory';
// import ViewUsers from 'views/AllPage/ViewPatient';
// import ManageBanner from 'views/AllPage/ManageBanner';
// import ManageContact from 'views/AllPage/ManageContact';
// import Reply from 'views/AllPage/SendReply';
// import Report from 'views/AllPage/CustomerReport';
// import ManageBooking from 'views/AllPage/ManageBooking';
// import ViewBooking from 'views/AllPage/ViewBooking';
// import UserAnaReport from 'views/AllPage/AnalyticsReport';

const DashboardDefault = Loadable(lazy(() => import('../views/Dashboard')));

// const UtilsTypography = Loadable(lazy(() => import('../views/Utils/Typography')));

// const SamplePage = Loadable(lazy(() => import('../views/SamplePage')));
import Profile from 'views/AllPage/Profile';
import { APP_PREFIX_PATH } from "../config";
import ManagePatient from '../views/AllPage/ManagePatient';
import ViewPatient from 'views/AllPage/ViewPatient';
// import PatientReport from 'views/AllPage/MedicationReport';
import MedicationReport from 'views/AllPage/MedicationReport';
import AdverseReport from 'views/AllPage/AdverseReport';
import MeasurementReport from 'views/AllPage/MeasurementReport';
import LabReportTabular from 'views/AllPage/LabReportTabular';
import SharedTabularData from 'views/AllPage/SharedTabularData';
import ManageFaq from 'views/AllPage/ManageFaq';
import ManageContact from 'views/AllPage/ManageContact';
import Reply from 'views/AllPage/SendReply';
// import { Reply } from '@mui/icons-material';


// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: APP_PREFIX_PATH + '/',
  element: <MainLayout />,
  children: [

    {
      path: APP_PREFIX_PATH + '/dashboard/',
      element: <DashboardDefault />
    },

    {
      path: APP_PREFIX_PATH + '/manage-user/userlist/view_user/:user_id',
      element: <ViewPatient />
    },

    // {
    //   path: APP_PREFIX_PATH + '/manage-patients',
    //   element: <ManagePatient />
    // },
    {
      path: APP_PREFIX_PATH + '/patients',
      element: <ManagePatient />
    },
    {
      path: APP_PREFIX_PATH + '/manage-faq',
      element: <ManageFaq />
    },
    {
      path: APP_PREFIX_PATH + '/manage-contact-us',
      element: <ManageContact />
    },
    {
      path: APP_PREFIX_PATH + '/send-reply',
      element: <Reply />
    },
    {
      path: APP_PREFIX_PATH + '/tabular-report/patient-report',
      element: <MedicationReport />
    },
    {
      path: APP_PREFIX_PATH + '/tabular-report/adverse-report',
      element: <AdverseReport />
    },
    {
      path: APP_PREFIX_PATH + '/tabular-report/measurement-report',
      element: <MeasurementReport />
    },
    {
      path: APP_PREFIX_PATH + '/tabular-report/lab-report',
      element: <LabReportTabular />
    },
    {
      path: APP_PREFIX_PATH + '/tabular-report/shared-report',
      element: <SharedTabularData />
    },
    {
      path: APP_PREFIX_PATH + '/profile',
      element: <Profile />
    },


  ]
};

export default MainRoutes;

// const MainRoutes = {
//   path: APP_PREFIX_PATH, // parent path
//   element: <MainLayout />,
//   children: [

//     { path: 'dashboard', element: <DashboardDefault /> },

//     { path: 'manage-user/userlist/view_user/:user_id', element: <ViewPatient /> },

//     { path: 'manage-patients', element: <ManagePatient /> },
//     { path: 'manage-faq', element: <ManageFaq /> },
//     { path: 'manage-contact-us', element: <ManageContact /> },
//     { path: 'send-reply', element: <Reply /> },

//     { path: 'tabular-report/patient-report', element: <MedicationReport /> },
//     { path: 'tabular-report/adverse-report', element: <AdverseReport /> },
//     { path: 'tabular-report/measurement-report', element: <MeasurementReport /> },
//     { path: 'tabular-report/lab-report', element: <LabReportTabular /> },
//     { path: 'tabular-report/shared-report', element: <SharedTabularData /> },

//     { path: 'profile', element: <Profile /> },

//   ]
// };

// export default MainRoutes;
