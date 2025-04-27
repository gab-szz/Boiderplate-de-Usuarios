import {
  Flex, HStack, Heading, IconButton, Button, Text, Stack,
  Menu, MenuButton, MenuList, MenuItem,
  Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent,
  useDisclosure, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box, Link
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { useRef } from "react";



interface User {
  nome: string;
  modulos: string[];
}

interface NavbarProps {
  user: User;
}

export function Navbar({ user }: NavbarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Flex bg="gray.800" px={6} py={2} align="center" justify="space-between">
        <HStack spacing={6} align="center">
          <IconButton
            ref={btnRef}
            onClick={onOpen}
            icon={<FaBars color="white" />}
            aria-label="Abrir menu lateral"
            variant="ghost"
            _hover={{ bg: "gray.700" }}
            _focus={{ bg: "gray.700" }}
            _active={{ bg: "gray.700" }}
            transition="background 0.2s ease"
          />

          <Heading as="h1" size="md" color="white">
            UniWays
          </Heading>

          {user.modulos.includes("crm") && (
            <Menu>
              <MenuButton
                as={Button}
                size="sm"
                variant="ghost"
                color="white"
                _hover={{ bg: "gray.700" }}
                _focus={{ bg: "gray.700" }}
                _active={{ bg: "gray.700" }}
                transition="background 0.2s ease"
              >
                CRM
              </MenuButton>
              <MenuList>
                <MenuItem>Novo Pedido</MenuItem>
                <MenuItem>Importação</MenuItem>
              </MenuList>
            </Menu>
          )}

          {user.modulos.includes("locadora") && (
            <Menu>
              <MenuButton
                as={Button}
                size="sm"
                variant="ghost"
                color="white"
                _hover={{ bg: "gray.700" }}
                _focus={{ bg: "gray.700" }}
                _active={{ bg: "gray.700" }}
                transition="background 0.2s ease"
              >
                Locação
              </MenuButton>
              <MenuList>
                <MenuItem>Novo Pedido</MenuItem>
                <MenuItem>Histórico de Pedidos</MenuItem>
                <MenuItem>Histórico de Orçamentos</MenuItem>
                <MenuItem>Relatórios</MenuItem>
              </MenuList>
            </Menu>
          )}

          {user.modulos.includes("consulta_sefaz") && (
            <Menu>
              <MenuButton
                as={Button}
                size="sm"
                variant="ghost"
                color="white"
                _hover={{ bg: "gray.700" }}
                _focus={{ bg: "gray.700" }}
                _active={{ bg: "gray.700" }}
                transition="background 0.2s ease"
              >
                Sefaz
              </MenuButton>
              <MenuList>
                <MenuItem>Monitoramento</MenuItem>
                <MenuItem>Parâmetros</MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>

        <HStack spacing={4}>
          <Text color="white" fontWeight="bold">
            {user.nome}
          </Text>
          <Button size="sm" variant="outline" colorScheme="red">
            Sair
          </Button>
        </HStack>
      </Flex>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Opções</DrawerHeader>
          <DrawerBody>
            <Stack spacing={4}>
              <Button variant="ghost" w="full" justifyContent="flex-start">
                Sobre o UniWays
              </Button>
              <Button variant="ghost" w="full" justifyContent="flex-start">
                Contato
              </Button>

              <Accordion allowToggle>
                <AccordionItem border="none">
                  <AccordionButton
                    as={Button}
                    variant="ghost"
                    w="full"
                    justifyContent="flex-start"
                    _hover={{ bg: "gray.100" }}
                    _focus={{ bg: "gray.100" }}
                    _active={{ bg: "gray.100" }}
                    transition="background 0.2s ease"
                  >
                    <Box flex="1" textAlign="left">
                      Configurações
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>

                  <AccordionPanel pb={4}>
                    <Stack pl={4} spacing={2} align="start">
                      <Link href="/parametros">Parâmetros do Sistema</Link>
                      <Link href="/alterar-senha">Alterar Senha</Link>
                      <Link href="/cadastrar-usuario">Cadastrar Usuário</Link>
                      <Link href="/gerenciar-usuarios">Gerenciar Usuários</Link>
                    </Stack>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
