// src/features/usuarios/services/usuarioService.ts
import { Usuario } from "../types";

/**
 * URL base da API que lida com usuários.
 * Aqui usamos o backend local em desenvolvimento.
 */
const API_URL = "http://localhost:8000/usuarios";

/**
 * Função para buscar todos os usuários cadastrados na API.
 * 
 * @returns {Promise<Usuario[]>} Uma lista com todos os usuários recebidos.
 * @throws {Error} Caso a resposta não esteja no formato esperado ou a requisição falhe.
 */
export async function listarUsuarios(): Promise<Usuario[]> {
  // Etapa 1: faz a requisição GET para a rota /usuarios
  const response = await fetch(API_URL);

  // Etapa 2: checa se a resposta está ok (status HTTP 200–299)
  if (!response.ok) {
    const text = await response.text();
    console.error("Erro na resposta:", text);
    throw new Error("Erro ao buscar usuários");
  }

  // Etapa 3: verifica se o conteúdo é JSON (como esperamos)
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    const text = await response.text();
    console.error("Resposta não é JSON:", text);
    throw new SyntaxError("Resposta inválida: não é JSON");
  }

  // Etapa 4: converte a resposta para JSON
  const json = await response.json();

  // Etapa 5: garante que o campo `dados` seja uma lista
  if (!Array.isArray(json.dados)) {
    console.error("Formato de dados inesperado:", json);
    throw new Error("A resposta da API não contém uma lista de usuários.");
  }

  // Etapa 6: retorna somente o array de usuários
  return json.dados;
}

/**
 * Atualiza um usuário na API a partir do seu ID.
 * 
 * @param id - ID do usuário a ser atualizado
 * @param dados - Campos que serão atualizados (parcial de `Usuario`)
 * @returns {Promise<Usuario>} O usuário atualizado retornado pela API
 * @throws {Error} Caso a resposta não esteja no formato esperado ou ocorra erro de requisição
 */
export async function atualizarUsuario(
  id: number,
  dados: Partial<Usuario>
): Promise<Usuario> {
  // Etapa 1: faz a requisição PUT para a rota /usuarios/:id com os dados atualizados
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  // Etapa 2: se houve erro de status, tenta extrair mensagem
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error((error && error.mensagem) || "Erro ao atualizar usuário");
  }

  // Etapa 3: extrai o corpo da resposta
  const json = await response.json();

  // Etapa 4: verifica se o campo `dados` é um objeto (esperado: o usuário atualizado)
  if (!json.dados || typeof json.dados !== "object") {
    console.error("Resposta inesperada no PUT /usuarios:", json);
    throw new Error("Formato inesperado de resposta ao atualizar usuário");
  }

  // Etapa 5: retorna somente o objeto do usuário
  return json.dados as Usuario;
}

/**
 * Exclui um usuário a partir do seu ID.
 * 
 * @param id - ID do usuário a ser removido
 * @returns {Promise<{ status: string; mensagem: string }>} Mensagem de sucesso da API
 * @throws {Error} Caso a exclusão falhe
 */
export async function excluirUsuario(
  id: number
): Promise<{ status: string; mensagem: string }> {
  // Etapa 1: faz a requisição DELETE para /usuarios/:id
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  // Etapa 2: se houve erro, tenta extrair a mensagem de erro da API
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error((error && error.mensagem) || "Erro ao excluir usuário");
  }

  // Etapa 3: retorna a confirmação de sucesso da exclusão
  return response.json();
}
