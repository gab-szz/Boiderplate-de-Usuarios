import {
  Box,
  Button,
  Heading,
  useToast,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  SkeletonText,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Usuario } from "../../types/Usuario";
import {
  listarUsuarios,
  atualizarUsuario,
  excluirUsuario,
} from "../../services/usuarioService";
import { mostrarToast } from "../../utils/toastUtils";
import ModalEditarUsuario from "../../components/usuarios/ModalEditarUsuario";

/**
 * Tela para visualizar, editar, excluir e ordenar usuários cadastrados.
 * Cada etapa está detalhada em funções com nomes descritivos, facilitando o
 * acompanhamento do fluxo mesmo para quem está começando.
 */
export function VisualizarUsuarios() {
  // --- Configuração inicial e hooks ---
  const navigate = useNavigate();                     // Navegar entre rotas
  const toast = useToast();                           // Mostrar notificações
  const { isOpen, onOpen, onClose } = useDisclosure(); // Controlar modal de edição

  // --- Estados principais ---
  const [listaDeUsuarios, setListaDeUsuarios] = useState<Usuario[]>([]);
  const [estaCarregando, setEstaCarregando] = useState(true);
  const [usuarioSelecionadoParaEdicao, setUsuarioSelecionadoParaEdicao] = useState<Usuario | null>(null);

  // Controle de ordenação: qual coluna e direção
  const [ordenacao, setOrdenacao] = useState<{
    coluna: keyof Usuario | null;
    direcao: "asc" | "desc";
  }>({ coluna: null, direcao: "asc" });

  // --- Passo 1: Carregar usuários ao montar ---
  useEffect(() => {
    async function buscarTodosUsuarios() {
      try {
        const usuariosRecebidos = await listarUsuarios();
        setListaDeUsuarios(usuariosRecebidos);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (erro: any) {
        console.error("Erro ao buscar usuários:", erro);
        toast({
          title: "Falha ao carregar usuários",
          description: erro?.message || "Por favor, tente novamente mais tarde.",
          status: "error",
          isClosable: true,
        });
      } finally {
        setEstaCarregando(false);
      }
    }

    buscarTodosUsuarios();
  }, [toast]);

  // --- Passo 2: Definir como ordenar a lista quando clicar no cabeçalho ---
  function atualizarOrdenacao(colunaClicada: keyof Usuario) {
    setOrdenacao((ordenacaoAtual) => {
      // Se clicar na mesma coluna, inverte a direção
      if (ordenacaoAtual.coluna === colunaClicada) {
        const novaDirecao = ordenacaoAtual.direcao === "asc" ? "desc" : "asc";
        return { coluna: colunaClicada, direcao: novaDirecao };
      }
      // Se for coluna nova, define direção ascendente
      return { coluna: colunaClicada, direcao: "asc" };
    });
  }

  // --- Passo 3: Retornar uma nova lista já ordenada ---
  function obterUsuariosOrdenados(): Usuario[] {
    if (!ordenacao.coluna) {
      return [...listaDeUsuarios];
    }
    // Clone do array para não mutar o original
    const copiaParaOrdenar = [...listaDeUsuarios];
    const { coluna, direcao } = ordenacao;

    copiaParaOrdenar.sort((a, b) => {
      const valorA = a[coluna!];
      const valorB = b[coluna!];

      // Ordenação para strings
      if (typeof valorA === "string" && typeof valorB === "string") {
        if (direcao === "asc") {
          return valorA.localeCompare(valorB);
        } else {
          return valorB.localeCompare(valorA);
        }
      }

      // Ordenação para números
      if (typeof valorA === "number" && typeof valorB === "number") {
        if (direcao === "asc") {
          return valorA - valorB;
        } else {
          return valorB - valorA;
        }
      }

      return 0;
    });

    return copiaParaOrdenar;
  }

  // --- Passo 4: Tratar exclusão de usuário com toast ---
  async function excluirUsuarioDaLista(id: number) {
    try {
      const { status, mensagem } = await excluirUsuario(id);
      mostrarToast(toast, status, mensagem);
      // Remove da lista local
      setListaDeUsuarios((anterior) =>
        anterior.filter((u) => u.id !== id)
      );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (erro: any) {
      console.error("Erro ao excluir usuário:", erro);
      toast({
        title: "Falha ao excluir usuário",
        description: erro?.message || "Por favor, tente novamente.",
        status: "error",
        isClosable: true,
      });
    }
  }

  // --- Passo 5: Iniciar edição abrindo modal ---
  function abrirModalDeEdicao(usuario: Usuario) {
    setUsuarioSelecionadoParaEdicao(usuario);
    onOpen();
  }

  // --- Passo 6: Salvar edição e atualizar lista ---
  async function confirmarEdicao(dadosAtualizados: Partial<Usuario>) {
    if (!usuarioSelecionadoParaEdicao) {
      return;
    }
    try {
      const usuarioAtualizado = await atualizarUsuario(
        usuarioSelecionadoParaEdicao.id,
        dadosAtualizados
      );
      setListaDeUsuarios((anteriores) =>
        anteriores.map((u) =>
          u.id === usuarioAtualizado.id ? usuarioAtualizado : u
        )
      );
      toast({
        title: "Usuário editado",
        status: "success",
        isClosable: true,
      });
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (erro: any) {
      console.error("Erro ao salvar edição:", erro);
      toast({
        title: "Falha ao editar usuário",
        description:
          erro?.response?.data?.mensagem || erro.message || "Erro desconhecido.",
        status: "error",
        isClosable: true,
      });
    }
  }

  // --- Passo 7: Definir o conteúdo da tabela ---
  const usuariosParaExibir = obterUsuariosOrdenados();
  let conteudoTabela;
  if (estaCarregando) {
    // Mostra skeletons enquanto carrega
    conteudoTabela = [...Array(3)].map((_, i) => (
      <Tr key={i}>
        <Td colSpan={4}>
          <SkeletonText noOfLines={1} />
        </Td>
      </Tr>
    ));
  } else if (usuariosParaExibir.length === 0) {
    // Caso não haja usuários
    conteudoTabela = (
      <Tr>
        <Td colSpan={4} textAlign="center">
          Nenhum usuário cadastrado ainda.
        </Td>
      </Tr>
    );
  } else {
    // Exibe cada usuário em uma linha
    conteudoTabela = usuariosParaExibir.map((usuario) => (
      <Tr key={usuario.id}>
        <Td>{usuario.nome}</Td>
        <Td>{usuario.login}</Td>
        <Td>{usuario.perfil}</Td>
        <Td>
          <Button
            size="xs"
            colorScheme="blue"
            onClick={() => abrirModalDeEdicao(usuario)}
          >
            Editar
          </Button>
          <Button
            size="xs"
            colorScheme="red"
            ml={2}
            onClick={() => excluirUsuarioDaLista(usuario.id)}
          >
            Excluir
          </Button>
        </Td>
      </Tr>
    ));
  }

  // --- Renderização final do componente ---
  return (
    <Box minH="100vh" bg="gray.100" p={6}>
      <Flex justify="center">
        <Box bg="white" p={6} borderRadius="xl" boxShadow="lg" maxW="700px" width="100%">
          <Heading size="lg" mb={6} textAlign="center">
            Usuários Cadastrados
          </Heading>

          <Table size="sm" variant="striped">
            <Thead>
              <Tr>
                <Th cursor="pointer" onClick={() => atualizarOrdenacao("nome")}>
                  Nome{" "}
                  {ordenacao.coluna === "nome"
                    ? ordenacao.direcao === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </Th>
                <Th cursor="pointer" onClick={() => atualizarOrdenacao("login")}>
                  Login{" "}
                  {ordenacao.coluna === "login"
                    ? ordenacao.direcao === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </Th>
                <Th cursor="pointer" onClick={() => atualizarOrdenacao("perfil")}>
                  Perfil{" "}
                  {ordenacao.coluna === "perfil"
                    ? ordenacao.direcao === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>{conteudoTabela}</Tbody>
          </Table>

          <Button mt={4} width="full" onClick={() => navigate("/")}>
            Voltar
          </Button>
        </Box>
      </Flex>

      {/* Modal de edição de usuário */}
      {usuarioSelecionadoParaEdicao && (
        <ModalEditarUsuario
          isOpen={isOpen}
          onClose={onClose}
          usuario={usuarioSelecionadoParaEdicao}
          onAtualizar={confirmarEdicao}
        />
      )}
    </Box>
  );
}

export default VisualizarUsuarios;
