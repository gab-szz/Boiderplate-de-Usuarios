import { Table, Thead, Tbody, Tr, Th } from "@chakra-ui/react";
import { Usuario } from "../types";
import { UsuarioRow } from "./UsuarioRow";

type Props = {
  usuarios: Usuario[];
  loading: boolean;
  sort: { coluna: keyof Usuario | null; direcao: "asc" | "desc" };
  onSort: (col: keyof Usuario) => void;
  onEdit: (u: Usuario) => void;
  onDelete: (id: number) => void;
};

export function UsuariosTable({ usuarios, loading, sort, onSort, onEdit, onDelete }: Props) {
  return (
    <Table size="sm" variant="striped">
      <Thead>
        <Tr>
          {(["nome", "login", "perfil"] as (keyof Usuario)[]).map(col => (
            <Th key={col} cursor="pointer" onClick={() => onSort(col)}>
              {col.toUpperCase()} {sort.coluna === col ? (sort.direcao === "asc" ? "▲" : "▼") : ""}
            </Th>
          ))}
          <Th>Ações</Th>
        </Tr>
      </Thead>
      <Tbody>
        {/* aqui pode usar skeletons se loading for true */}
        {usuarios.map(u => (
          <UsuarioRow key={u.id} usuario={u} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </Tbody>
    </Table>
  );
}
