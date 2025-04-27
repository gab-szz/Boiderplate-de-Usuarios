import { Box, List, ListItem, Heading, Text } from "@chakra-ui/react";
import UniWaysNavbar from "./components/NavBar/NavBar"; 


function App() {
  const user = {
    nome: "Gabriel",
    modulos: ["crm", "locadora", "consulta_sefaz"]
  };

  return (
    <Box minH="100vh" bg="gray.100" display="flex" flexDirection="column">
      {/* Navbar */}
      <UniWaysNavbar user={user} />

      {/* Main content */}
      <Box as="main" p={2.5} display="flex" flexDirection="column" flex="1">
        <Box
          bg="white"
          p={4}
          pt={10}
          borderRadius="xl"
          boxShadow="lg"
          width="100%"
          flex="1"
          display="flex"
          flexDirection="column"
          alignItems="center" // Alinha os itens no centro horizontalmente
          textAlign="center" // Alinha os itens no centro horizontalmente
          justifyContent="flex-start" // Faz os elementos ficarem alinhados no topo
        >
          <Heading as="h2" size="xl" color="gray.800" mb={2}>
            Bem vindo ao UniWays  
          </Heading>

          <Text fontSize="md" color="gray.500" mb={6}>
            A plataforma que facilita sua gestão!
          </Text>

          <Box
            bg="orange.400"
            color="white"
            fontSize="sm"
            fontWeight="bold"
            px={4}
            py={1}
            borderRadius="full"
            mb={6}
            display="inline-block"
            transition="all 0.5s ease"
            _hover={{
              transform: "translateY(-3.5px)",
              boxShadow: "1xl",
            }}
          >
            🚀 Versão 0.9.1 Beta
          </Box>

          <Box
            bg="gray.50"
            p={6}
            borderRadius="lg"
            maxW="600px"
            textAlign="left"
            boxShadow="md"
            transition="all 0.5s ease"
            _hover={{
              transform: "translateY(-3.5px)",
              boxShadow: "1xl",
            }}
          >
            <Heading as="h3" size="md" mb={4}>
              📢 Novidades da Versão 0.9.1 Beta
            </Heading>

            <List spacing={3}>
              <ListItem>🆕 Todas as telas foram refeitas utilizando uma tecnologia mais moderna, responsiva e escalável.</ListItem>
            </List>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
