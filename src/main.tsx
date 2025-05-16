import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";

import { SessaoUsuarioProvider } from "./context/SessaoUsuarioContext";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <SessaoUsuarioProvider>
        <App />
      </SessaoUsuarioProvider>
    </ChakraProvider>
  </React.StrictMode>
);
