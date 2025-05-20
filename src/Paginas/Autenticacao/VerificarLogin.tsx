// src/paginas/VerificarLogin.tsx
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useSessaoUsuario } from "../../context/SessaoUsuarioContext";
import { useNavigate } from "react-router-dom";

const VerificarLogin = () => {
  const navigate = useNavigate();
  const { usuarioEstaLogado } = useSessaoUsuario();

  return (
    <Box p={6} textAlign={"center"}>
      <Heading size="md">Verificação de Login</Heading>
      <Text mt={4}>
        {usuarioEstaLogado ? "Usuário está logado ✅" : "Usuário não está logado ❌"}
      </Text>
      <Button colorScheme="gray" size="sm" onClick={() => navigate("/") }>
        Voltar
      </Button>
    </Box>
  );
};

export default VerificarLogin;
