// src/services/usuarioService.ts
import { api } from "./api";
import { Usuario } from "../types/Usuario";

/**
 * Busca todos os usuários cadastrados no backend.
 */
export async function listarUsuarios(): Promise<Usuario[]> {
  const resposta = await api.get("/usuarios/");
  return resposta.data.dados ?? [];
}

/**
 * Atualiza os dados de um usuário com base no ID.
 */
export async function atualizarUsuario(
  id: number,
  dados: Partial<Omit<Usuario, "id" | "data_criacao">>
): Promise<Usuario> {
  const resposta = await api.put(`/usuarios/${id}`, dados);
  return resposta.data.dados;
}

/**
 * Remove um usuário com base no ID.
 */
export async function excluirUsuario(id: number): Promise<void> {
  await api.delete(`/usuarios/${id}`);
}
