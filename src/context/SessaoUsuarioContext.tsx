/**
 * Contexto e provedor de sessão de usuário para autenticação JWT.
 *
 * Esse arquivo contém:
 * 1. Definição do tipo de usuário e do valor do contexto.
 * 2. Criação do Contexto React.
 * 3. Hook personalizado `useSessaoUsuario` para acessar o contexto.
 * 4. `SessaoUsuarioProvider` que gerencia estado, login, logout e validação de sessão.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api } from "../services/api";

/**
 * Representa os dados básicos do usuário extraídos do token JWT.
 */
export type UsuarioSessao = {
  /** Identificador único (sub do token) */
  sub: string;
  /** Timestamp opcional de expiração (em segundos) */
  exp?: number;
};

/**
 * Interface que define quais métodos e estados o contexto fornecerá.
 */
export type SessaoUsuarioContextType = {
  /** Objeto de usuário, ou null se não autenticado */
  usuario: UsuarioSessao | null;
  /** Indica se o usuário está logado */
  usuarioEstaLogado: boolean;
  /**
   * Realiza login via API e armazena token.
   * @param loginParam - usuário ou e-mail
   * @param senha - senha em texto puro
   * @returns status e mensagem de resultado
   */
  login: (
    loginParam: string,
    senha: string
  ) => Promise<{ status: string; mensagem: string }>;
  /**
   * Limpa sessão e tokens salvos.
   */
  logout: () => void;
  /**
   * Valida o token atual chamando /usuarios/me e atualiza `usuario`.
   * @returns dados do usuário ou erro
   */
  validarSessao: () =>
    Promise<
      { status: "success"; dados: UsuarioSessao } | { status: "erro" }
    >;
};

// 1. Cria o contexto React com tipo definido acima.
const SessaoUsuarioContext = createContext<
  SessaoUsuarioContextType
>({} as SessaoUsuarioContextType);

/**
 * Hook personalizado para obter o contexto de sessão de usuário.
 * @returns SessaoUsuarioContextType
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useSessaoUsuario = (): SessaoUsuarioContextType => {
  return useContext(SessaoUsuarioContext);
};

/**
 * Provedor de sessão de usuário.
 * Envolve a aplicação e disponibiliza login, logout e validação.
 */
export const SessaoUsuarioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 2. Estado local: usuário e flag de login
  const [usuario, setUsuario] = useState<UsuarioSessao | null>(null);
  const [usuarioEstaLogado, setUsuarioEstaLogado] = useState<boolean>(
    // Verifica se já existe token no sessionStorage
    Boolean(sessionStorage.getItem("access_token"))
  );

  /**
   * Passo 1: Função de login
   * - Envia credenciais à API
   * - Armazena token em sessionStorage
   * - Marca usuário como logado
   */
  const login = useCallback(
    async (loginParam: string, senha: string) => {
      try {
        const resposta = await api.post("/usuarios/login", {
          login: loginParam,
          senha,
        });
        const { access_token } = resposta.data.dados;

        // 1a. Armazena token
        sessionStorage.setItem("access_token", access_token);
        // 1b. Atualiza estado de login
        setUsuarioEstaLogado(true);

        return { status: "success", mensagem: "Login bem-sucedido" };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // 1c. Em caso de falha, retorna erro
        return { status: "error", mensagem: "Usuário ou senha inválidos" };
      }
    },
    []
  );

  /**
   * Passo 2: Função de logout
   * - Remove token e reseta estados
   */
  const logout = useCallback(() => {
    sessionStorage.removeItem("access_token");
    setUsuarioEstaLogado(false);
    setUsuario(null);
  }, []);

  /**
   * Passo 3: Validação de sessão
   * - Chama endpoint /usuarios/me para obter dados
   * - Atualiza usuário logado ou faz logout em caso de erro
   */
  const validarSessao = useCallback(
    async () => {
      try {
        const resposta = await api.get("/usuarios/me");
        const dadosUsuario: UsuarioSessao = resposta.data.usuario;

        setUsuario(dadosUsuario);
        setUsuarioEstaLogado(true);

        return { status: "success", dados: dadosUsuario } as const;
        
      } catch {
        // Se o token for inválido ou expirado, faz logout
        logout();
        return { status: "erro" } as const;
      }
    },
    [logout]
  );

  /**
   * Passo 4: useEffect para validar a sessão sempre que o estado de login mudar.
   */
  useEffect(() => {
    if (usuarioEstaLogado) {
      validarSessao();
    }
  }, [usuarioEstaLogado, validarSessao]);

  // 5. Disponibiliza valores e funções via contexto
  return (
    <SessaoUsuarioContext.Provider
      value={{ usuario, usuarioEstaLogado, login, logout, validarSessao }}
    >
      {children}
    </SessaoUsuarioContext.Provider>
  );
};
