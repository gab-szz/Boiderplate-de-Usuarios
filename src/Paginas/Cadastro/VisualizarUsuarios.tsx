// src/pages/Cadastro/VisualizarUsuarios.tsx
import {
  Box,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  SkeletonText,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Usuario } from "../../types/Usuario";
import { listarUsuarios, atualizarUsuario, excluirUsuario } from "../../services/usuarioService";
import ModalEditarUsuario from "../../components/usuarios/ModalEditarUsuario";


export function VisualizarUsuarios() {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

  useEffect(() => {
    async function carregarUsuarios() {
      try {
        const resposta = await listarUsuarios();
        setUsuarios(resposta);
      } catch (erro) {
        console.error("Erro ao buscar usuários:", erro);
      } finally {
        setCarregando(false);
      }
    }
    carregarUsuarios();
  }, []);

  async function deletarUsuario(id: number) {
    try {
      await excluirUsuario(id);
      toast({ title: "Usuário deletado.", status: "success", isClosable: true });
      setUsuarios((lista) => lista.filter((usuario) => usuario.id !== id));
    } catch (erro) {
      console.error("Erro ao deletar:", erro);
    }
  }

  function iniciarEdicao(usuario: Usuario) {
    setUsuarioEditando(usuario);
    onOpen();
  }

  async function salvarEdicao(dados: Partial<Usuario>) {
    if (!usuarioEditando) return;
  
    try {
      const resposta = await atualizarUsuario(usuarioEditando.id, dados);
      const usuarioAtualizado = resposta;
  
      setUsuarios((usuariosAtuais) =>
        usuariosAtuais.map((usuario) =>
          usuario.id === usuarioAtualizado.id ? usuarioAtualizado : usuario
        )
      );
  
      toast({
        title: "Usuário atualizado com sucesso.",
        status: "success",
        isClosable: true,
      });
  
      onClose();
    } catch (erro) {
      console.error("Erro ao editar:", erro);
  
      toast({
        title: "Erro ao editar usuário.",
        status: "error",
        description:
          erro?.response?.data?.mensagem || erro.message || "Erro desconhecido.",
        isClosable: true,
      });
    }
  }

  let conteudoTabela;
  if (carregando) {
    conteudoTabela = [...Array(3)].map((_, i) => (
      <Tr key={i}><Td colSpan={4}><SkeletonText noOfLines={1} /></Td></Tr>
    ));
  } else if (usuarios.length === 0) {
    conteudoTabela = <Tr><Td colSpan={4} textAlign={"center"}>Nenhum usuário cadastrado ainda.</Td></Tr>;
  } else {
    conteudoTabela = usuarios.map((usuario) => (
      <Tr key={usuario.id}>
        <Td>{usuario.nome}</Td>
        <Td>{usuario.login}</Td>
        <Td>{usuario.perfil}</Td>
        <Td>
          <Button size="xs" colorScheme="blue" onClick={() => iniciarEdicao(usuario)}>Editar</Button>
          <Button size="xs" colorScheme="red" ml={2} onClick={() => deletarUsuario(usuario.id)}>Excluir</Button>
        </Td>
      </Tr>
    ));
  }

  return (
    <Box minH="100vh" bg="gray.100" p={6}>
      <Flex justify="center">
        <Box bg="white" p={6} borderRadius="xl" boxShadow="lg" maxW="700px" width="100%">
          <Heading size="lg" mb={6} textAlign="center">Usuários Cadastrados</Heading>
          <Table size="sm" variant="striped">
            <Thead>
              <Tr>
                <Th>Nome</Th><Th>Login</Th><Th>Perfil</Th><Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>{conteudoTabela}</Tbody>
          </Table>
          <Button mt={4} width="full" onClick={() => navigate("/")}>Voltar</Button>
        </Box>
      </Flex>

      {usuarioEditando && (
        <ModalEditarUsuario
          isOpen={isOpen}
          onClose={onClose}
          usuario={usuarioEditando}
          onAtualizar={salvarEdicao}
        />
      )}
    </Box>
  );
}

export default VisualizarUsuarios;
