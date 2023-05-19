import {
  RouterProvider,
} from "react-router-dom";
import { privateRoutes, publicRoutes } from "./Routes";
import './App.scss'


export const App = () => {

  const isAuthenticated = true

  return (
   
    isAuthenticated? 
    <RouterProvider router={privateRoutes} /> :  <RouterProvider router={publicRoutes} /> 

  )
}
