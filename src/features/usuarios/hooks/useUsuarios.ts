import { useState, useEffect, useCallback } from "react";
import { Usuario } from "./types";
import {
  listarUsuarios as apiListar,
  atualizarUsuario as apiAtualizar,
  excluirUsuario as apiExcluir,
} from "../services/usuarioService";

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<{ coluna: keyof Usuario | null; direcao: "asc" | "desc" }>({ coluna: null, direcao: "asc" });

  // busca inicial
  useEffect(() => {
    apiListar()
      .then(setUsuarios)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ordenação
  const ordenarPor = useCallback((col: keyof Usuario) => {
    setSort(({ coluna, direcao }) => ({
      coluna: col,
      direcao: coluna === col && direcao === "asc" ? "desc" : "asc",
    }));
  }, []);

  const usuariosOrdenados = [...usuarios].sort((a, b) => {
    if (!sort.coluna) return 0;
    const va = a[sort.coluna], vb = b[sort.coluna];
    if (typeof va === "string" && typeof vb === "string") {
      return sort.direcao === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    }
    if (typeof va === "number" && typeof vb === "number") {
      return sort.direcao === "asc" ? va - vb : vb - va;
    }
    return 0;
  });

  // exclusão
  const excluir = useCallback(async (id: number) => {
    await apiExcluir(id);
    setUsuarios(u => u.filter(x => x.id !== id));
  }, []);

  // atualização
  const atualizar = useCallback(async (id: number, dados: Partial<Usuario>) => {
    const updated = await apiAtualizar(id, dados);
    setUsuarios(u => u.map(x => (x.id === updated.id ? updated : x)));
    return updated;
  }, []);

  return {
    usuarios: usuariosOrdenados,
    loading,
    sort,
    ordenarPor,
    excluir,
    atualizar,
  };
}
