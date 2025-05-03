// src/features/usuarios/hooks/useUsuarios.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import { Usuario } from "../types";
import {
  listarUsuarios as apiListar,
  atualizarUsuario as apiAtualizar,
  excluirUsuario as apiExcluir,
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
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  /**
   * Estado que indica se os dados ainda estão sendo carregados
   */
  const [loading, setLoading] = useState(true);

  /**
   * Estado que controla qual coluna está sendo usada para ordenação e a direção
   */
  const [sort, setSort] = useState<{
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
    apiListar()
      .then((data) => setUsuarios(data))       // Preenche o estado com a resposta
      .catch((err) => console.error(err))      // Se houver erro, apenas mostra no console
      .finally(() => setLoading(false));       // Desativa o loading ao final
  }, []);

  /**
   * Passo 2 - Função para mudar o critério de ordenação da tabela
   * - Se clicar na mesma coluna, inverte a direção
   * - Se for uma nova coluna, começa com "asc"
   */
  const ordenarPor = useCallback((col: keyof Usuario) => {
    setSort(({ coluna, direcao }) => ({
      coluna: col,
      direcao: coluna === col && direcao === "asc" ? "desc" : "asc",
    }));
  }, []);

  /**
   * Passo 3 - Memoiza uma nova lista de usuários já ordenada
   * - Evita reordenação desnecessária se usuários ou sort não mudarem
   */
  const usuariosOrdenados = useMemo(() => {
    return [...usuarios].sort((a, b) => {
      if (!sort.coluna) return 0;

      const va = a[sort.coluna];
      const vb = b[sort.coluna];

      if (typeof va === "string" && typeof vb === "string") {
        return sort.direcao === "asc"
          ? va.localeCompare(vb)
          : vb.localeCompare(va);
      }

      if (typeof va === "number" && typeof vb === "number") {
        return sort.direcao === "asc" ? va - vb : vb - va;
      }

      return 0;
    });
  }, [usuarios, sort]);

  /**
   * Passo 4 - Excluir usuário
   * - Chama a API para excluir e remove da lista local
   * 
   * @param id - ID do usuário a ser removido
   */
  const excluir = useCallback(async (id: number) => {
    await apiExcluir(id);
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  }, []);

  /**
   * Passo 5 - Atualizar usuário
   * - Atualiza o usuário via API
   * - Substitui o item atualizado na lista local
   * 
   * @param id - ID do usuário
   * @param dados - Campos parciais a serem atualizados
   * @returns {Usuario} o usuário atualizado
   */
  const atualizar = useCallback(
    async (id: number, dados: Partial<Usuario>) => {
      const updated = await apiAtualizar(id, dados);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === updated.id ? updated : u))
      );
      return updated;
    },
    []
  );

  /**
   * Exporta o que será usado no componente
   */
  return {
    usuarios: usuariosOrdenados,
    loading,
    sort,
    ordenarPor,
    excluir,
    atualizar,
  };
}
