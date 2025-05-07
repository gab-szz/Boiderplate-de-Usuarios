import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    Stack,
    Text,
    useToast,
  } from "@chakra-ui/react";
  import { FaUser, FaLock, FaBuilding } from "react-icons/fa";
  import { useState } from "react";
  
  function Login() {
    const [empresa, setEmpresa] = useState("");
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const toast = useToast();
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
  
      toast({
        title: "Login enviado",
        description: `Empresa: ${empresa}, Usuário: ${usuario}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    };
  
    return (
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        bgGradient="linear(to-br, blue.200, blue.600)"
        fontFamily="'Segoe UI', sans-serif"
      >
        <Box
          bg="white"
          p={8}
          borderRadius="xl"
          boxShadow="lg"
          width="100%"
          maxW="400px"
          transition="all 0.3s ease"
          _hover={{
            transform: "translateY(-6px)",
            boxShadow: "2xl",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={5}>
              <Heading
                size="lg"
                textAlign="center"
                color="gray.700"
                fontWeight="bold"
              >
                UniWays
              </Heading>

              {/* 
              <FormControl isRequired>
                <FormLabel>Sigla empresa</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaBuilding} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    placeholder="Ex: DAC"
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                  />
                </InputGroup>
              </FormControl>
              */}
  
              <FormControl isRequired>
                <FormLabel>Usuário</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaUser} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    placeholder="Digite seu usuário"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                  />
                </InputGroup>
              </FormControl>
  
              <FormControl isRequired>
                <FormLabel>Senha</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaLock} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </InputGroup>
              </FormControl>
  
              <Button type="submit" colorScheme="blue" w="full">
                ENTRAR
              </Button>
            </Stack>
          </form>
  
          <Box textAlign="center" fontSize="sm" mt={6} color="gray.600">
            <Text>
              Powered by <strong style={{ color: "#222" }}>Gest+ Tecnologia</strong>
            </Text>
            <Text>Versão (BETA) 0.9</Text>
          </Box>
        </Box>
      </Flex>
    );
  }
  
  export default Login;