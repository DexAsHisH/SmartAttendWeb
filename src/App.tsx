import {
  RouterProvider,
} from "react-router-dom";
import { privateRoutes, publicRoutes } from "./Routes";
import './App.scss'
import { isAuthenticatedSelector } from "./store/authentication/selector";
import { useSelector } from "react-redux";


export const App = () => {

  const isAuthenticated = useSelector(isAuthenticatedSelector);

  return (
   
    isAuthenticated? 
    <RouterProvider router={privateRoutes} /> :  <RouterProvider router={publicRoutes} /> 
  )
}
