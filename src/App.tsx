import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useDisclosure,
  useToast,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
} from "@chakra-ui/react";
import { FaUser, FaLock, FaBuilding, FaBars } from "react-icons/fa";
import { useState, useRef } from "react";

function LoginWithNavbar() {
  const [empresa, setEmpresa] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);

  const user = {
    nome: "Gabriel",
    modulos: ["crm", "locadora", "consulta_sefaz"]
  };

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
    <Box minH="100vh" bg="gray.100">
      {/* Navbar com menus de módulo e drawer lateral */}
      <Flex bg="gray.800" px={6} py={3} align="center" justify="space-between">
        <HStack spacing={6} align="center">
          <IconButton
            ref={btnRef}
            onClick={onOpen}
            icon={<FaBars color="white" />} // ❯ deixa o ícone branco
            aria-label="Abrir menu lateral"
            variant="ghost"
            _hover={{ bg: "gray.700" }}
          />

          <Heading as="h1" size="md" color="white">
            UniWays
          </Heading>

          {/* Módulos visíveis na navbar */}
          {user.modulos.includes("crm") && (
            <Menu>
              <MenuButton as={Button} size="sm" variant="ghost" color="white" _hover={{ bg: "gray.700" }}>
                CRM
              </MenuButton>
              <MenuList>
                <MenuItem>Pedidos</MenuItem>
                <MenuItem>Importação</MenuItem>
              </MenuList>
            </Menu>
          )}

          {user.modulos.includes("locadora") && (
            <Menu>
              <MenuButton as={Button} size="sm" variant="ghost" color="white" _hover={{ bg: "gray.700" }}>
                Locação
              </MenuButton>
              <MenuList>
                <MenuItem>Novo Pedido</MenuItem>
                <MenuItem>Histórico de Pedidos</MenuItem>
                <MenuItem>Orçamentos</MenuItem>
                <MenuItem>Relatórios</MenuItem>
              </MenuList>
            </Menu>
          )}

          {user.modulos.includes("consulta_sefaz") && (
            <Menu>
              <MenuButton as={Button} size="sm" variant="ghost" color="white" _hover={{ bg: "gray.700" }}>
                Sefaz
              </MenuButton>
              <MenuList>
                <MenuItem>Monitoramento</MenuItem>
                <MenuItem>Parâmetros</MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>

        {/* Nome e sair */}
        <HStack spacing={4}>
          <Text color="white" fontWeight="bold">
            {user.nome}
          </Text>
          <Button size="sm" variant="outline" colorScheme="red">
            Sair
          </Button>
        </HStack>
      </Flex>

      {/* Drawer lateral apenas para opções gerais */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Opções</DrawerHeader>
          <DrawerBody>
            <Stack spacing={4}>
              <Button variant="ghost" w="full">Sobre o UniWays</Button>
              <Button variant="ghost" w="full">Contato</Button>
              <Button variant="ghost" w="full">Alterar senha</Button>
              <Button variant="ghost" w="full">Cadastrar usuário</Button>
              <Button variant="ghost" w="full">Gerenciar usuários</Button>
              <Button variant="ghost" w="full">Parâmetros do Sistema</Button>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Conteúdo Principal */}
      <Flex align="center" justify="center" mt={12}>
        <Box
          bg="white"
          p={8}
          borderRadius="lg"
          boxShadow="lg"
          width="100%"
          maxW="400px"
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={5}>
              <Heading
                size="lg"
                textAlign="center"
                color="gray.700"
                fontWeight="bold"
              >
                Login - UniWays
              </Heading>

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
        </Box>
      </Flex>
    </Box>
  );
}

export default LoginWithNavbar;