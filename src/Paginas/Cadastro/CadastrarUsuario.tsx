import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Heading,
    VStack,
    useToast,
    Flex,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { mostrarToast } from "../../utils/toastUtils";
  import { BotaoFormulario } from "../../components/ui/BotaoFormulario";
import { adicionarUsuario } from "../../features/usuarios/services/usuarioService";

  // Componente principal
  export function CadastroUsuario() {
    const navigate = useNavigate();
    const toast = useToast();
  
    const [nome, setNome] = useState("");
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [perfil, setPerfil] = useState("");
    const [email, setEmail] = useState("");
  
    const [carregando, setCarregando] = useState(false);
  
    /**
     * Dispara a criação de um novo usuário quando clica em Salvar.
     */
    async function handleSalvar() {
      if (!nome || !login || !senha || !perfil || !email) {
        toast({
          title: "Atenção.",
          status: "warning",
          description: "Preencha todos os campos.",
          isClosable: true,
        });
        return;
      }
  
      setCarregando(true);
      try {
        await adicionarUsuario({
          nome,
          login,
          senha,
          perfil,
          email,
        });
  
        // Se chegou aqui, deu certo
        mostrarToast(toast, "success", "Usuário criado com sucesso.");
  
        // limpa formulário
        setNome("");
        setLogin("");
        setSenha("");
        setPerfil("");
        setEmail("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        // Se a API retornou lista de erros de campo:
        if (Array.isArray(err.errors)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          err.errors.forEach((e: any) =>
            toast({
              title: `Erro no campo ${e.campo}`,
              status: "error",
              description: e.mensagem,
              isClosable: true,
            })
          );
        } else {
          // mensagem genérica
          toast({
            title: "Erro ao salvar.",
            status: "error",
            description: err.message || "Erro desconhecido.",
            isClosable: true,
          });
        }
      } finally {
        setCarregando(false);
      }
    }
  
    return (
      <Box minH="100vh" bg="gray.100" p={6}>
        <Flex gap={6} justify="center" align="flex-start" flexWrap="wrap">
          {/* Formulário de Cadastro */}
          <Box
            bg="white"
            p={6}
            borderRadius="xl"
            boxShadow="lg"
            width="100%"
            maxW="450px"
          >
            <Heading as="h2" size="lg" mb={6} textAlign="center" color="gray.700">
              Cadastro de Usuário
            </Heading>
  
            <VStack spacing={4} align="stretch">
              {/* Campo Nome */}
              <FormControl isRequired>
                <FormLabel fontSize={"sm"}>Nome</FormLabel>
                <Input
                  placeholder="Digite o nome completo"
                  value={nome}
                  onChange={(evento) => setNome(evento.target.value)}
                  size="sm"
                />
              </FormControl>
  
              {/* Campo Login */}
              <FormControl isRequired>
                <FormLabel fontSize={"sm"}>Login</FormLabel>
                <Input
                  placeholder="Digite o login"
                  value={login}
                  onChange={(evento) => setLogin(evento.target.value)}
                  size="sm"
                />
              </FormControl>

              {/* Campo Login */}
              <FormControl isRequired>
                <FormLabel fontSize={"sm"}>Email</FormLabel>
                <Input
                  placeholder="Digite o email"
                  type="email"
                  value={email}
                  onChange={(evento) => setEmail(evento.target.value)}
                  size="sm"
                />
              </FormControl>
  
              {/* Campo Senha */}
              <FormControl isRequired>
                <FormLabel fontSize={"sm"}>Senha</FormLabel>
                <Input
                  type="password"
                  placeholder="Digite a senha"
                  value={senha}
                  onChange={(evento) => setSenha(evento.target.value)}
                  size="sm"
                />
              </FormControl>
  
              {/* Campo Perfil (Select) */}
              <FormControl isRequired>
                <FormLabel fontSize={"sm"}>Perfil</FormLabel>
                <Select
                  placeholder="Selecione um perfil"
                  value={perfil}
                  onChange={(evento) => setPerfil(evento.target.value)}
                  size="sm"
                >
                  <option value="admin">Administrador</option>
                  <option value="usuario">Usuário</option>
                  <option value="financeiro">Financeiro</option>
                </Select>
              </FormControl>
  
              {/* Botão de salvar */}
              <BotaoFormulario
                onClick={handleSalvar}
                isLoading={carregando}
              >
                Salvar Usuário
              </BotaoFormulario>

              <Button colorScheme="gray" width="full" size="sm" onClick={() => navigate("/") }>
                Voltar
              </Button>
            </VStack>
          </Box>
        </Flex>
      </Box>
    );
  }
  
  export default CadastroUsuario;
  