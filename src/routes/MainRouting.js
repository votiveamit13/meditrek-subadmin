// import React, { lazy } from 'react';
// import { Route } from 'react-router-dom';
// import Loadable from 'component/Loadable';

import Login from 'views/Login';
import ForgotPassword from 'views/AllPage/ForgotPassword';
import ResetPassword from 'views/AllPage/ResetPassword';
import OTPVerify from 'views/Login/otpverify';
import { APP_PREFIX_PATH } from "../config";



// ==============================|| MAIN ROUTES ||============================== //

const Routes = {
  path: APP_PREFIX_PATH+'/',
  children: [
    {
        path: APP_PREFIX_PATH+'/',
        element: <Login />
      },
    
    {
      path: APP_PREFIX_PATH+'/login',
      element: <Login />
    },
    {
      path: APP_PREFIX_PATH+'/verify-otp',
      element: <OTPVerify />
    },
    {
      path: APP_PREFIX_PATH+'/forgot-password',
      element: <ForgotPassword />
    },
    {
      path: APP_PREFIX_PATH+'/reset-password',
      element: <ResetPassword />
    }
  ]
};

export default Routes;
