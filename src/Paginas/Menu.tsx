import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function MenuUsuarios() {
  const navigate = useNavigate();

  return (
    <Box minH="100vh" bg="gray.100" p={6}>
      <Flex direction="column" gap={4} align="center" justify="center" mt={20}>
        <Heading mb={6} color="gray.700">
          Menu de Usuários
        </Heading>

        <Button colorScheme="blue" width="200px" onClick={() => navigate("/cadastro")}>
          Cadastrar Usuário
        </Button>

        <Button colorScheme="teal" width="200px" onClick={() => navigate("/visualizar")}>
          Visualizar Usuários
        </Button>
      </Flex>
    </Box>
  );
}

export default MenuUsuarios;
