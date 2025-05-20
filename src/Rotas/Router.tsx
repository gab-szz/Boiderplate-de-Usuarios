import { createBrowserRouter } from "react-router-dom";
import CadastroUsuario from "../paginas/Cadastro/CadastrarUsuario";
import VisualizarUsuarios from "../paginas/Cadastro/VisualizarUsuarios";
import MenuUsuarios from "../Paginas/Menu";
import Login from "../Paginas/Autenticacao/Login";
import VerificarLogin from "../Paginas/Autenticacao/VerificarLogin";

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
