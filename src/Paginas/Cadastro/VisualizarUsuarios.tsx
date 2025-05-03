import { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

// Importa hook customizado e componentes de tabela/modal
import { useUsuarios } from "../../features/usuarios/hooks/useUsuarios";
import { UsuariosTable } from "../../features/usuarios/components/UsuariosTable";
import { ModalEditarUsuario } from "../../features/usuarios/components/ModalEditarUsuario";
import { Usuario } from "../../features/usuarios/types";

/**
 * Página principal de visualização de usuários cadastrados.
 * Permite ordenar, editar e excluir usuários.
 *
 * @returns JSX da tela com tabela de usuários e modal de edição
 */
export default function VisualizarUsuariosPage() {
  // Hook do React Router para redirecionamento
  const navigate = useNavigate();

  // Hook do Chakra para mostrar mensagens toast
  const toast = useToast();

  // Controle do modal de edição (aberto ou fechado)
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Hook customizado que lida com a lógica de usuários (carregar, excluir, atualizar etc.)
  const { usuarios, loading, sort, ordenarPor, excluir, atualizar } =
    useUsuarios();

  // Armazena o usuário selecionado para edição (ou null)
  const [editing, setEditing] = useState<Usuario | null>(null);

  /**
   * Quando clica em "Editar", define o usuário atual e abre o modal.
   */
  const handleEdit = (u: Usuario) => {
    setEditing(u);
    onOpen();
  };

  /**
   * Quando clica em "Excluir", chama a função do hook
   * e mostra um toast informando o sucesso ou erro.
   */
  const handleDelete = (id: number) => {
    excluir(id)
      .then(() => {
        toast({
          title: "Usuário excluído",
          status: "success",
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: "Erro ao excluir",
          description: err.message,
          status: "error",
          isClosable: true,
        });
      });
  };

  return (
    <Box minH="100vh" bg="gray.100" p={6}>
      <Flex justify="center">
        <Box
          bg="white"
          p={6}
          borderRadius="xl"
          boxShadow="lg"
          maxW="700px"
          width="100%"
        >
          {/* Título principal */}
          <Heading size="lg" mb={6} textAlign="center">
            Usuários Cadastrados
          </Heading>

          {/* Tabela com dados dos usuários */}
          <UsuariosTable
            usuarios={usuarios}
            loading={loading}
            sort={sort}
            onSort={ordenarPor}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Botão para voltar à página anterior */}
          <Button mt={4} width="full" onClick={() => navigate("/")}>
            Voltar
          </Button>
        </Box>
      </Flex>

      {/* Modal de edição de usuário (só aparece se `editing` estiver preenchido) */}
      {editing && (
        <ModalEditarUsuario
          isOpen={isOpen}
          onClose={() => {
            setEditing(null);
            onClose();
          }}
          usuario={editing}
          onAtualizar={(dados) =>
            atualizar(editing.id, dados)
              .then((usuarioAtualizado) => {
                toast({
                  title: "Usuário atualizado",
                  status: "success",
                  isClosable: true,
                });
                setEditing(usuarioAtualizado); // 🔄 Atualiza o state com os novos dados
                onClose(); // 🔒 Fecha o modal
              })
              .catch((err) => {
                toast({
                  title: "Erro ao atualizar",
                  description: err.message,
                  status: "error",
                  isClosable: true,
                });
              })
          }
        />
      )}
    </Box>
  );
}
