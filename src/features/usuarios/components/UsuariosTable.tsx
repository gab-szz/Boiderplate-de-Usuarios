// src/features/usuarios/components/UsuariosTable.tsx

import { Table, Thead, Tbody, Tr, Th, Td, Skeleton, Stack } from "@chakra-ui/react";
import { Usuario } from "../types";
import { UsuarioRow } from "./UsuarioRow";

/**
 * Props esperadas pelo componente de tabela:
 * - `usuarios`: lista de objetos do tipo Usuario para exibir
 * - `loading`: indica se os dados ainda estão sendo carregados
 * - `sort`: contém qual coluna está sendo ordenada e a direção (asc/desc)
 * - `onSort`: função para alterar a ordenação ao clicar no cabeçalho
 * - `onEdit`: função disparada ao clicar no botão "Editar"
 * - `onDelete`: função disparada ao clicar no botão "Excluir"
 */
interface Props {
  usuarios: Usuario[];
  loading: boolean;
  sort: { coluna: keyof Usuario | null; direcao: "asc" | "desc" };
  onSort: (col: keyof Usuario) => void;
  onEdit: (usuario: Usuario) => void;
  onDelete: (id: number) => void;
}

/**
 * Componente de tabela reutilizável para exibir usuários em uma interface
 *
 * @param props - dados e ações da tabela (usuários, ordenação, eventos)
 * @returns JSX da tabela renderizada
 */
export function UsuariosTable({
  usuarios,
  loading,
  sort,
  onSort,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Table size="sm" variant="striped">
      {/* Cabeçalho da Tabela */}
      <Thead>
        <Tr>
          {/* Gera dinamicamente as colunas "nome", "login" e "perfil" */}
          {(["nome", "login", "perfil"] as (keyof Usuario)[]).map((coluna) => (
            <Th
              key={coluna}
              cursor="pointer"
              onClick={() => onSort(coluna)} // dispara ordenação ao clicar
            >
              {coluna.toUpperCase()}{" "}
              {sort.coluna === coluna
                ? sort.direcao === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </Th>
          ))}
          <Th>Ações</Th>
        </Tr>
      </Thead>

      {/* Corpo da Tabela */}
      <Tbody>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Tr key={i}>
              <Td>
                <Skeleton height="16px" width="80px" />
              </Td>
              <Td>
                <Skeleton height="16px" width="100px" />
              </Td>
              <Td>
                <Skeleton height="16px" width="60px" />
              </Td>
              <Td>
                <Stack direction="row" spacing={2}>
                  <Skeleton height="24px" width="50px" />
                  <Skeleton height="24px" width="60px" />
                </Stack>
              </Td>
            </Tr>
          ))
        ) : (
          usuarios.map((usuario) => (
            <UsuarioRow
              key={usuario.id}
              usuario={usuario}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </Tbody>
    </Table>
  );
}
