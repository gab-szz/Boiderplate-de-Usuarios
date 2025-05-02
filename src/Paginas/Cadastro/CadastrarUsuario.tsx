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
  import { api } from "../../services/api";
  import { useNavigate } from "react-router-dom";
  import { mostrarToast } from "../../utils/toastUtils";
  import { BotaoFormulario } from "../../components/ui/BotaoFormulario";

  // Componente principal
  function CadastroUsuario() {
    const navigate = useNavigate();

    // Estados para armazenar os dados do formulário
    const [nome, setNome] = useState("");
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [perfil, setPerfil] = useState("");

    // Estado de carregando do botão
    const [carregando, setCarregando] = useState(false);
  
    /**
     * Estado que armazena a lista de usuários cadastrados.
     * Tipado como um array de objetos com nome, login, senha e perfil.
     * Isso simula um "banco de dados em memória".
     */
  
    // Toast é um aviso visual temporário (tipo alerta)
    const toast = useToast();
  
    /**
     * Função chamada ao clicar em "Salvar Usuário"
     */
    async function handleSalvar() {
      if (!nome || !login || !senha || !perfil) {
        toast({
          title: "Atenção.",
          status: "warning",
          description: `Preencha todos os campos.`,
          isClosable: true,
        });
        return;
      }

      setCarregando(true); // ⬅️ Início do carregamento
    
      try {
        const resposta = await api.post("/usuarios/", {
          nome,
          login,
          senha,
          perfil
        });

        console.log(resposta.data)
    
        const { status, mensagem } = resposta.data;

        mostrarToast(toast, status, mensagem); // ⬅️ Usa função utilitária

        if (status === "success") {
          // limpa formulário
          setNome("");
          setLogin("");
          setSenha("");
          setPerfil("");
        }
    
      } catch (erro: unknown) {
        console.error("Erro no POST /usuarios/:", erro);
        toast({
          title: "Erro ao salvar.",
          status: "error",
          description: erro?.response?.data?.mensagem || "Erro desconhecido.",
          isClosable: true,
        });
      } finally {
        setCarregando(false); // ⬅️ Fim do carregamento
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
                <FormLabel>Nome</FormLabel>
                <Input
                  placeholder="Digite o nome completo"
                  value={nome}
                  onChange={(evento) => setNome(evento.target.value)}
                  size="sm"
                />
              </FormControl>
  
              {/* Campo Login */}
              <FormControl isRequired>
                <FormLabel>Login</FormLabel>
                <Input
                  placeholder="Digite o login"
                  value={login}
                  onChange={(evento) => setLogin(evento.target.value)}
                  size="sm"
                />
              </FormControl>
  
              {/* Campo Senha */}
              <FormControl isRequired>
                <FormLabel>Senha</FormLabel>
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
                <FormLabel>Perfil</FormLabel>
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
  