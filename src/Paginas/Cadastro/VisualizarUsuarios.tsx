import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

// Importa hook customizado com lógica dos usuários
import { useUsuarios } from "../../features/usuarios/hooks/useUsuarios";

// Importa componentes visuais da tabela, modal e filtros
import { UsuariosTable } from "../../features/usuarios/components/UsuariosTable";
import { ModalEditarUsuario } from "../../features/usuarios/components/ModalEditarUsuario";
import { FiltrosUsuarios } from "../../features/usuarios/components/FiltrosUsuarios";
import { Usuario } from "../../features/usuarios/types";

export default function VisualizarUsuariosPage() {
  // ← Hook do React Router para redirecionamento de página
  const navigate = useNavigate();

  // ← Hook do Chakra UI para mostrar mensagens toast (tipo alertas)
  const toast = useToast();

  // ← Chakra UI: controle de exibição do modal
  const {
    isOpen: modalAberto,     // ← booleano que diz se o modal está aberto
    onOpen: abrirModal,      // ← função para abrir modal
    onClose: fecharModal,    // ← função para fechar modal
  } = useDisclosure();

  // ← Hook customizado que traz dados da API e funções (ordenar, excluir, atualizar)
  const {
    usuarios,        // ← lista ordenada de usuários
    loading,         // ← booleano que indica se ainda está carregando
    sort,            // ← objeto com { coluna, direcao } da ordenação
    ordenarPor,      // ← função para mudar ordenação
    excluir,         // ← função para excluir usuário
    atualizar,       // ← função para atualizar usuário
  } = useUsuarios();

  // ← Armazena o usuário que está sendo editado (ou null se nenhum)
  const [editing, setEditing] = useState<Usuario | null>(null);

  // ← Armazena os filtros digitados pelo usuário
  const [filtros, setFiltros] = useState({
    codigo: "",
    nome: "",
    status: "",
  });

  // ← Armazena a lista de usuários filtrados (visível na tabela)
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>(usuarios);

  /**
   * useEffect para sincronizar os dados totais da API com os usuários filtrados.
   * Sempre que `usuarios` mudar, copiamos tudo para `usuariosFiltrados` (estado inicial).
   */
  useEffect(() => {
    setUsuariosFiltrados(usuarios);
  }, [usuarios]);

  /**
   * Função chamada ao clicar em "Buscar" nos filtros.
   * Filtra os usuários da lista original com base nos critérios preenchidos.
   */
  const handleBuscar = () => {
    const filtrados = usuarios.filter((usuario) =>
      (filtros.codigo === "" || usuario.id === Number(filtros.codigo)) &&
      (filtros.nome === "" || usuario.nome.toLowerCase().includes(filtros.nome.toLowerCase())) &&
      (filtros.status === "" || usuario.status === filtros.status)
    );

    setUsuariosFiltrados(filtrados); // ← Atualiza a tabela com os resultados filtrados
  };

  /**
   * Quando o botão "Editar" for clicado na tabela:
   * - Salva o usuário atual
   * - Abre o modal de edição
   */
  const handleEdit = (usuario: Usuario) => {
    setEditing(usuario);
    abrirModal();
  };

  /**
   * Quando o botão "Excluir" for clicado:
   * - Chama a API para excluir
   * - Mostra mensagem de sucesso/erro
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
          {/* Título da página */}
          <Heading size="lg" mb={6} textAlign="center">
            Usuários Cadastrados
          </Heading>

          {/* Componente de filtros (collapse com formulário) */}
          <FiltrosUsuarios
            filtros={filtros}
            setFiltros={setFiltros}
            confirmarBusca={handleBuscar}
          />

          {/* Tabela com os dados dos usuários filtrados */}
          <Box overflowX="auto">
            <UsuariosTable
              usuarios={usuariosFiltrados}
              loading={loading}
              sort={sort}
              onSort={ordenarPor}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Box>

          {/* Botão para voltar à página anterior */}
          <Button mt={4} width="full" onClick={() => navigate("/")}>
            Voltar
          </Button>
        </Box>
      </Flex>

      {/* Modal de edição de usuário (só aparece se houver `editing`) */}
      {editing && (
        <ModalEditarUsuario
          modalAberto={modalAberto}
          fecharModal={() => {
            setEditing(null);
            fecharModal();
          }}
          usuario={editing}
          atualizarUsuario={(dados) =>
            atualizar(editing.id, dados)
              .then((usuarioAtualizado) => {
                toast({
                  title: "Usuário atualizado",
                  status: "success",
                  isClosable: true,
                });
                setEditing(usuarioAtualizado); // ← Atualiza o estado com dados atualizados
                fecharModal();                 // ← Fecha o modal
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
