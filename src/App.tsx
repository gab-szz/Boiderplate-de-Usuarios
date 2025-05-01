//import { Box, List, ListItem, Heading, Text } from "@chakra-ui/react";
//import UniWaysNavbar from "./components/NavBar/NavBar"; 
import { RouterProvider } from "react-router-dom";
//import CadastroUsuario from "./Pages/CadastrarUsuario";
import { router } from "./Rotas/Router";


function App() {
  /*
  const user = {
    nome: "Gabriel",
    modulos: ["crm", "locadora", "consulta_sefaz"]
  };
  */

  return (
    <RouterProvider router={router} />
  );
}

export default App;
