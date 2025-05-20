import axios from "axios";
import { Usuario } from "../../../types/Usuario";

const API_URL = "http://localhost:8000/usuarios";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Função para buscar todos os usuários cadastrados na API.
 *
 * @returns {Promise<Usuario[]>} Uma lista com todos os usuários recebidos.
 * @throws {Error} Caso a resposta não esteja no formato esperado ou a requisição falhe.
 */
export async function listarUsuarios(): Promise<Usuario[]> {
  try {
    const { data } = await api.get("/");
    if (!Array.isArray(data.dados)) {
      console.error("Formato inesperado em listarUsuarios:", data);
      throw new Error("A resposta da API não contém uma lista de usuários.");
    }
    return data.dados;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Erro em listarUsuarios:", err?.response?.data || err);
    throw new Error("Erro ao buscar usuários");
  }
}

/**
 * Atualiza um usuário na API a partir do seu ID.
 *
 * @param id      ID do usuário a ser atualizado
 * @param dados   Parciais de `Usuario` com os campos que serão alterados
 * @returns       O usuário atualizado
 * @throws {Error} Caso a resposta não seja a esperada ou ocorra erro de requisição
 */
export async function atualizarUsuario(
  id: number,
  dados: Partial<Usuario>
): Promise<Usuario> {
  try {
    const { data } = await api.put(`/${id}`, dados);
    if (data.status !== "success" || typeof data.dados !== "object") {
      console.error("Resposta inesperada em atualizarUsuario:", data);
      throw new Error(data.mensagem || "Resposta inesperada ao atualizar usuário");
    }
    return data.dados;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Erro em atualizarUsuario:", err?.response?.data || err);
    const msg = err.response?.data?.mensagem || "Erro ao atualizar usuário";
    throw new Error(msg);
  }
}

/**
 * Exclui um usuário a partir do seu ID.
 *
 * @param id      ID do usuário a ser removido
 * @returns       O objeto de retorno completo da API (status, mensagem, dados)
 * @throws {Error} Caso ocorra falha na exclusão
 */
export async function excluirUsuario(
  id: number
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ status: string; mensagem: string; dados: any }> {
  try {
    const { data } = await api.delete(`/${id}`);
    return data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Erro em excluirUsuario:", err?.response?.data || err);
    const msg = err.response?.data?.mensagem || "Erro ao excluir usuário";
    throw new Error(msg);
  }
}

/**
 * Cria um novo usuário na API.
 *
 * @param dados   Parciais de `Usuario` contendo os campos para criação
 * @returns       O usuário criado
 * @throws {Error} Com a mensagem da API e, em `error.errors`, lista de erros de campo
 */
export async function adicionarUsuario(
  dados: Partial<Usuario>
): Promise<Usuario> {
  try {
    const { data } = await api.post("/", dados);

    if (data.status !== "success" || typeof data.dados !== "object") {
      // API devolveu status error ou formato inesperado
      const e = new Error(data.mensagem || "Erro ao criar usuário");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e as any).errors = data.dados; // lista de { campo, mensagem, tipo }
      throw e;
    }

    return data.dados;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Erro em adicionarUsuario:", err?.response?.data || err);
    // Se vier erro da resposta HTTP
    if (err.response?.data) {
      const apiData = err.response.data;
      const e = new Error(apiData.mensagem || "Erro ao criar usuário");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e as any).errors = apiData.dados;
      throw e;
    }
    throw new Error(err.message || "Erro ao criar usuário");
  }
}

/**
 * Tenta logar o usuário na API.
 *
 * @param usuario  - nome/login do usuário
 * @param senha    - senha do usuário
 * @returns        O objeto completo retornado pela API: { status, mensagem, dados? }
 * @throws         Em caso de falha HTTP ou de rede
 */
export async function logarUsuario(
  login: string,
  senha: string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ status: string; mensagem: string; dados?: any }> {
  try {
    const { data } = await api.post("/login", { login, senha });

    console.log(data)
    // aqui 'data.status' é 'success' ou 'error'
    return data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Erro em logarUsuario:", err);
    // Pode lançar para o componente tratar
    throw err;
  }
}

