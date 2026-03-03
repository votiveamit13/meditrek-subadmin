import React from 'react';
import { lazy } from 'react';

// project imports
import Loadable from 'component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
// import Profile from 'views/AllPage/Profile';
import { APP_PREFIX_PATH } from "../config";

const AuthLogin = Loadable(lazy(() => import('../views/Login')));
const AuthRegister = Loadable(lazy(() => import('../views/Register')));

// ==============================|| AUTHENTICATION ROUTES ||============================== //

const AuthenticationRoutes = {
  path: APP_PREFIX_PATH+'/',
  element: <MinimalLayout />,
  children: [
    {
      path: APP_PREFIX_PATH+'/application/login',
      element: <AuthLogin />
    },
    {
      path: APP_PREFIX_PATH+'/application/register',
      element: <AuthRegister />
    }
  ]
};

export default AuthenticationRoutes;
