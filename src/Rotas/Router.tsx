import { createBrowserRouter } from "react-router-dom";
import CadastroUsuario from "../Paginas/Cadastro/CadastrarUsuario";
import VisualizarUsuarios from "../Paginas/Cadastro/VisualizarUsuarios";
import MenuUsuarios from "../Paginas/Menu";
import Login from "../Paginas/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MenuUsuarios />,
  },
  {
    path: "/cadastro",
    element: <CadastroUsuario />,
  },
  {
    path: "/visualizar",
    element: <VisualizarUsuarios />,
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/verificar login",
    element: <VisualizarUsuarios />,
  },
]);
