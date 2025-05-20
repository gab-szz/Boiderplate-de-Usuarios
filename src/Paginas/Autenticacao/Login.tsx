// src/paginas/Login.tsx
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
  useToast
} from "@chakra-ui/react";
import { FaUser, FaLock } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSessaoUsuario } from "../../context/SessaoUsuarioContext"

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useSessaoUsuario();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!usuario.trim() || !senha.trim()) {
      toast({
        title: "Preencha usuário e senha",
        status: "warning",
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const resposta = await login(usuario, senha);

      if (resposta.status === "success") {
        toast({
          title: "Login bem-sucedido",
          description: resposta.mensagem,
          status: "success",
          isClosable: true,
        });
        navigate("/", { replace: true });
      } else {
        toast({
          title: "Falha no login",
          description: resposta.mensagem,
          status: "error",
          isClosable: true,
        });
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast({
        title: "Erro de conexão",
        description: err.message || "Tente novamente mais tarde.",
        status: "error",
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient="linear(to-br, blue.200, blue.600)"
    >
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="lg"
        maxW="400px"
        w="100%"
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={5}>
            <Heading size="lg" textAlign="center" fontWeight="bold">
              Login
            </Heading>

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

            <Button
              type="submit"
              colorScheme="blue"
              w="full"
              isLoading={loading}
            >
              ENTRAR
            </Button>
          </Stack>
        </form>

        <Box textAlign="center" fontSize="sm" mt={6} color="gray.600">
          <Text>
            Powered by <strong>Gest+ Tecnologia</strong>
          </Text>
          <Text>Versão (BETA) 0.9</Text>
        </Box>
      </Box>
    </Flex>
  );
}
