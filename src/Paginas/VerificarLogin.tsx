// src/paginas/VerificarLogin.tsx
import { Box, Heading, Text } from "@chakra-ui/react";
import { useSessaoUsuario } from "../context/SessaoUsuarioContext";

const VerificarLogin = () => {
  const { usuarioEstaLogado } = useSessaoUsuario();

  return (
    <Box p={6}>
      <Heading size="md">Verificação de Login</Heading>
      <Text mt={4}>
        {usuarioEstaLogado ? "Usuário está logado ✅" : "Usuário não está logado ❌"}
      </Text>
    </Box>
  );
};

export default VerificarLogin;
