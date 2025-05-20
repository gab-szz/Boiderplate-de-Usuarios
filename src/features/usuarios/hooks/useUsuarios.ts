import { useState, useEffect, useCallback, useMemo } from "react";
import { Usuario } from "../../../types/Usuario";
import {
  listarUsuarios as apiListarUsuarios,
  atualizarUsuario as apiAtualizarUsuarios,
  excluirUsuario as apiExcluirUsuarios,
} from "../services/usuarioService";

/**
 * Hook personalizado para controlar a lógica de usuários:
 * - busca inicial de dados
 * - ordenação por coluna
 * - atualização e exclusão local + via API
 *
 * @returns Um objeto com a lista ordenada, loading, métodos de ordenar, atualizar e excluir
 */
export function useUsuarios() {
  /**
   * Estado local com a lista de usuários trazida da API
   */
  const [listaUsuarios, definirListaUsuarios] = useState<Usuario[]>([]);

  /**
   * Estado que indica se os dados ainda estão sendo carregados
   */
  const [carregando, definirCarregando] = useState(true);

  /**
   * Estado que controla qual coluna está sendo usada para ordenação e a direção
   */
  const [criterioOrdenacao, definirOrdenacao] = useState<{
    coluna: keyof Usuario | null;
    direcao: "asc" | "desc";
  }>({
    coluna: null,
    direcao: "asc",
  });

  /**
   * Passo 1 - useEffect: busca todos os usuários assim que o hook for montado
   */
  useEffect(() => {
    apiListarUsuarios()
      .then((dados) => definirListaUsuarios(dados))        // Preenche o estado com a resposta
      .catch((erro) => console.error(erro))                // Se houver erro, apenas mostra no console
      .finally(() => definirCarregando(false));            // Desativa o loading ao final
  }, []);

  /**
   * Passo 2 - Função para mudar o critério de ordenação da tabela
   * - Se clicar na mesma coluna, inverte a direção
   * - Se for uma nova coluna, começa com "asc"
   */
  const mudarColunaOrdenacao = useCallback((novaColuna: keyof Usuario) => {
    // ← A função recebe o nome da nova coluna clicada (ex: "nome", "login", etc)

    definirOrdenacao((estadoAtual) => { // ← Aqui usamos a forma "funcional" do setState
      //     Isso nos dá acesso ao valor atual da ordenação antes da mudança

      const { coluna: colunaAtual, direcao: direcaoAtual } = estadoAtual; // ← Extrai do estado atual:
      //     - colunaAtual → qual coluna está sendo usada atualmente
      //     - direcaoAtual → "asc" ou "desc"

      const novaDirecao =
        novaColuna === colunaAtual && direcaoAtual === "asc" // ← Regra de alternância:
          ? "desc"
          : "asc";
      //     - Se clicou na mesma coluna e ela já estava em ordem ascendente, então inverte para descendente ("desc")
      //     - Caso contrário (coluna nova ou já estava "desc"), volta para "asc"

      return {
        coluna: novaColuna,       // ← Atualiza a coluna com a recém-clicada
        direcao: novaDirecao,     // ← Usa a direção calculada acima
      };
    }); // ← Isso atualiza o estado com o novo critério de ordenação
    
  }, []); // ← O useCallback com dependências vazias evita recriar essa função em cada render
  

  

  /**
   * Passo 3 - Memoriza uma nova lista de usuários já ordenada
   * - Evita reordenação desnecessária se listaUsuarios ou criterioOrdenacao não mudarem
   */
  const usuariosJaOrdenados = useMemo(() => {
    // ← useMemo memoriza o resultado da função para evitar recalcular em toda renderização
    // ← Só vai reexecutar a ordenação se listaUsuarios ou criterioOrdenacao mudarem

    return [...listaUsuarios].sort((usuarioA, usuarioB) => {
      // ← Clona a lista original com spread operator para manter imutabilidade
      // ← Em seguida, usa .sort() para ordenar os usuários com base na coluna escolhida

      if (!criterioOrdenacao.coluna) return 0;
      // ← Se nenhuma coluna foi selecionada para ordenação, não faz nada (retorna a lista como está)

      const valorA = usuarioA[criterioOrdenacao.coluna];
      const valorB = usuarioB[criterioOrdenacao.coluna];
      // ← Acessa dinamicamente o valor da coluna escolhida em cada usuário
      // ← Ex: se criterioOrdenacao.coluna for "nome", então faz usuarioA.nome e usuarioB.nome

      if (typeof valorA === "string" && typeof valorB === "string") {
        // ← Se os valores da coluna forem strings, faz ordenação alfabética

        return criterioOrdenacao.direcao === "asc"
          ? valorA.localeCompare(valorB)
          : valorB.localeCompare(valorA);
        // ← localeCompare compara strings com suporte a acentos e ordem local (ex: pt-BR)
        // ← Se for ascendente, compara normal. Se for descendente, inverte a ordem
      }

      if (typeof valorA === "number" && typeof valorB === "number") {
        // ← Se os valores forem numéricos, ordena com subtração simples

        return criterioOrdenacao.direcao === "asc"
          ? valorA - valorB
          : valorB - valorA;
        // ← Se for ascendente, menor vem primeiro. Se for descendente, maior vem primeiro
      }

      return 0;
      // ← Se não for string nem number (ex: undefined ou outro tipo), mantém a ordem original
    });
  }, [listaUsuarios, criterioOrdenacao]);
  // ← Dependências do useMemo:
  // ← A ordenação só será recalculada se a lista de usuários ou o critério de ordenação mudar


  /**
   * Passo 4 - Excluir usuário
   * - Chama a API para excluir e remove da lista local
   * 
   * @param id - ID do usuário a ser removido
   */
  const excluirUsuario = useCallback(async (id: number) => {
    await apiExcluirUsuarios(id);
    definirListaUsuarios((usuariosAnteriores) =>
      usuariosAnteriores.filter((usuario) => usuario.id !== id)
    );
  }, []);

  /**
   * Passo 5 - Atualizar usuário
   * - Atualiza o usuário via API
   * - Substitui o item atualizado na lista local
   * 
   * @param id - ID do usuário
   * @param dadosParciais - Campos parciais a serem atualizados
   * @returns {Usuario} o usuário atualizado
   */
  const atualizarUsuario = useCallback(
    async (id: number, dadosParciais: Partial<Usuario>) => {
      const usuarioAtualizado = await apiAtualizarUsuarios(id, dadosParciais);
      definirListaUsuarios((usuariosAnteriores) =>
        usuariosAnteriores.map((usuario) =>
          usuario.id === usuarioAtualizado.id ? usuarioAtualizado : usuario
        )
      );
      return usuarioAtualizado;
    },
    []
  );
  

  /**
   * Exporta o que será usado no componente
   */
  return {
    usuarios: usuariosJaOrdenados,
    loading: carregando,
    sort: criterioOrdenacao,
    ordenarPor: mudarColunaOrdenacao,
    excluir: excluirUsuario,
    atualizar: atualizarUsuario,
  };
}
