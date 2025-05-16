import { createBrowserRouter } from "react-router-dom";
import CadastroUsuario from "../paginas/Cadastro/CadastrarUsuario";
import VisualizarUsuarios from "../paginas/Cadastro/VisualizarUsuarios";
import MenuUsuarios from "../paginas/Menu";
import Login from "../paginas/Login";
import VerificarLogin from "../paginas/VerificarLogin";

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
    element: <Login />
  },
  {
    path: "/verificar-login",
    element: <VerificarLogin />
  },
]);
