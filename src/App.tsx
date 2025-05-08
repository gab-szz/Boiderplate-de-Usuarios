//import { Box, List, ListItem, Heading, Text } from "@chakra-ui/react";
//import UniWaysNavbar from "./components/NavBar/NavBar"; 
import { RouterProvider } from "react-router-dom";
//import CadastroUsuario from "./Pages/CadastrarUsuario";
import { router } from "./rotas/Router";


function App() {

  return (
    <RouterProvider router={router} />
  );
}

export default App;
