// src/features/usuarios/components/UsuariosTable.tsx

import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import { Usuario } from "../../../types/Usuario";
import { UsuarioRow } from "./UsuarioRow";

interface Props {
  usuarios: Usuario[];
  loading: boolean;
  sort: { coluna: keyof Usuario | null; direcao: "asc" | "desc" };
  onSort: (col: keyof Usuario) => void;
  onEdit: (usuario: Usuario) => void;
  onDelete: (id: number) => void;
}

/**
 * Componente de tabela de Usuários que:
 * - Exibe cabeçalho clicável para ordenação
 * - Mostra Skeletons enquanto carrega
 * - Mostra uma linha de “nenhum usuário” se estiver vazio
 * - Renderiza cada linha via <UsuarioRow> com animação
 */
export function UsuariosTable({
  usuarios,
  loading,
  sort,
  onSort,
  onEdit,
  onDelete,
}: Props) {
  // Definimos as colunas que vamos ordenar/exibir no cabeçalho:
  const colunas: (keyof Usuario)[] = ["id", "nome", "login", "perfil"];

  return (
    <Table size="sm" variant="striped">
      {/* Cabeçalho */}
      <Thead>
        <Tr>
          {colunas.map((col) => (
            <Th
              key={col}
              cursor="pointer"
              onClick={() => onSort(col)}
              textTransform="uppercase"
              fontSize="xs"
            >
              {col}
              {sort.coluna === col &&
                (sort.direcao === "asc" ? " ▲" : " ▼")}
            </Th>
          ))}
          <Th textAlign="center" fontSize="xs">
            Ações
          </Th>
        </Tr>
      </Thead>

      {/* Corpo */}
      <Tbody>
        {loading ? (
          // 3 linhas de skeleton enquanto carrega
          Array.from({ length: 3 }).map((_, i) => (
            <Tr key={i}>
              {colunas.map((_, j) => (
                <Td key={j}>
                  <Skeleton height="16px" />
                </Td>
              ))}
              <Td>
                <Stack direction="row" spacing={2}>
                  <Skeleton height="24px" width="50px" />
                  <Skeleton height="24px" width="50px" />
                </Stack>
              </Td>
            </Tr>
          ))
        ) : usuarios.length === 0 ? (
          // Linha "nenhum usuário"
          <UsuarioRow
            usuario={null}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ) : (
          // Uma linha animada para cada usuário
          usuarios.map((u) => (
            <UsuarioRow
              key={u.id}
              usuario={u}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </Tbody>
    </Table>
  );
}
