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
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Flex,
  } from "@chakra-ui/react";
  import { useState } from "react";
  
  // Componente principal
  function CadastroUsuario() {
    // Estados para armazenar os dados do formulário
    const [nome, setNome] = useState("");
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [perfil, setPerfil] = useState("");
  
    /**
     * Estado que armazena a lista de usuários cadastrados.
     * Tipado como um array de objetos com nome, login, senha e perfil.
     * Isso simula um "banco de dados em memória".
     */
    const [usuarios, setUsuarios] = useState<
      { nome: string; login: string; senha: string; perfil: string }[]
    >([]);
  
    // Toast é um aviso visual temporário (tipo alerta)
    const toast = useToast();
  
    /**
     * Função chamada ao clicar em "Salvar Usuário"
     */
    function handleSalvar() {
      // Validação: impede cadastro se houver campos vazios
      if (!nome || !login || !senha || !perfil) {
        toast({
          title: "Atenção.",
          status: "warning",
          description: `Preencha todos os campos.`,
          isClosable: true,
        });
        return;
      }
  
      const novoUsuario = { nome, login, senha, perfil };
  
      /**
       * Aqui usamos a versão funcional do setUsuarios:
       * prevUsuarios é o valor atual do estado (React passa automaticamente).
       * Criamos uma nova lista usando spread [...], garantindo imutabilidade.
       */
      setUsuarios((prevUsuarios) => [...prevUsuarios, novoUsuario]);
  
      // Mostra uma notificação de sucesso
      toast({
        title: "Usuário salvo com sucesso!",
        status: "success",
        isClosable: true,
      });
  
      // Limpa os campos do formulário
      setNome("");
      setLogin("");
      setSenha("");
      setPerfil("");
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
              <Button
                colorScheme="blue"
                onClick={handleSalvar}
                width="full"
                mt={4}
                size="sm"
              >
                Salvar Usuário
              </Button>
            </VStack>
          </Box>
  
          {/* Tabela com usuários cadastrados */}
          <Box
            bg="white"
            p={6}
            borderRadius="xl"
            boxShadow="lg"
            width="100%"
            maxW="600px"
            overflowX="auto"
          >
            <Heading as="h2" size="lg" mb={6} textAlign="center" color="gray.700">
              Usuários Cadastrados
            </Heading>
  
            <Table size="sm" variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Nome</Th>
                  <Th>Login</Th>
                  <Th>Perfil</Th>
                </Tr>
              </Thead>
              <Tbody>
                {usuarios.length === 0 ? (
                  // Caso não haja usuários, exibe mensagem
                  <Tr>
                    <Td colSpan={3} textAlign="center" color="gray.500">
                      Nenhum usuário cadastrado ainda.
                    </Td>
                  </Tr>
                ) : (
                  // Caso haja, mapeia e renderiza cada linha
                  usuarios.map((usuario, index) => (
                    <Tr key={index}>
                      <Td>{usuario.nome}</Td>
                      <Td>{usuario.login}</Td>
                      <Td>{usuario.perfil}</Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </Box>
        </Flex>
      </Box>
    );
  }
  
  export default CadastroUsuario;
  