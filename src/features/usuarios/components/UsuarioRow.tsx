// src/features/usuarios/components/UsuarioRow.tsx

import { Tr, Td, Button, Stack } from "@chakra-ui/react";
import { Usuario } from "../types";

/**
 * Props esperadas pelo componente de linha da tabela de usuários:
 * - `usuario`: um objeto contendo os dados de um usuário individual
 * - `onEdit`: função chamada ao clicar no botão "Editar"
 * - `onDelete`: função chamada ao clicar no botão "Excluir"
 */
interface Props {
  usuario: Usuario;
  onEdit: (usuario: Usuario) => void;
  onDelete: (id: number) => void;
}

/**
 * Componente responsável por renderizar uma linha da tabela de usuários.
 *
 * Exibe os dados do usuário (nome, login, perfil) e dois botões:
 * - Editar: abre o modal para edição
 * - Excluir: remove o usuário
 *
 * @param props - dados do usuário e funções de ação (editar/excluir)
 * @returns JSX da linha da tabela
 */
export function UsuarioRow({ usuario, onEdit, onDelete }: Props) {
  return (
    <Tr>
      {/* Coluna: Nome do usuário */}
      <Td>{usuario.nome}</Td>

      {/* Coluna: Login do usuário */}
      <Td>{usuario.login}</Td>

      {/* Coluna: Perfil (admin, comum, etc.) */}
      <Td>{usuario.perfil}</Td>

      {/* Coluna: Botões de ação */}
      <Td>
        <Stack direction="row" spacing={2}>
          {/* Botão para editar o usuário */}
          <Button
            size="xs"
            colorScheme="blue"
            onClick={() => onEdit(usuario)}
          >
            Editar
          </Button>

          {/* Botão para excluir o usuário */}
          <Button
            size="xs"
            colorScheme="red"
            onClick={() => onDelete(usuario.id)}
          >
            Excluir
          </Button>
        </Stack>
      </Td>
    </Tr>
  );
}
