// src/features/usuarios/components/UsuarioRow.tsx

import { Tr, Td, Button, Stack } from "@chakra-ui/react";
import { motion } from "framer-motion"; // ← Importa o motion para animar componentes do Chakra
import { Usuario } from "../types";

// Define as props esperadas pelo componente
interface Props {
  usuario: Usuario | null                 // ← Um objeto com os dados do usuário a exibir
  onEdit: (usuario: Usuario) => void;     // ← Função chamada ao clicar em "Editar"
  onDelete: (id: number) => void;         // ← Função chamada ao clicar em "Excluir"
}

// Converte a linha da tabela (<Tr>) para uma versão animada com framer-motion
const MotionTr = motion(Tr);

/**
 * Componente que representa **uma linha da tabela** para exibir os dados de um usuário.
 *
 * Ele inclui as informações do usuário e dois botões:
 * - Editar → abre modal de edição
 * - Excluir → remove o usuário
 *
 * A linha é animada com um leve efeito de "fade in" ao ser montada.
 */
export function UsuarioRow({ usuario, onEdit, onDelete }: Props) {
  return (
    <MotionTr
      initial={{ opacity: 0, y: -5 }}     // ← Começa invisível e levemente acima
      animate={{ opacity: 1, y: 0 }}      // ← Aparece suavemente e "desce" para posição normal
      transition={{ duration: 0.2 }}      // ← Duração da animação (em segundos)
    >
      {usuario === null ? (
        <Td colSpan={4} textAlign="center">
          Nenhum usuário encontrado
        </Td>
      ) : (
        <>
          <Td>{usuario.nome}</Td>        {/* ← Nome */}
          <Td>{usuario.login}</Td>       {/* ← Login */}
          <Td>{usuario.perfil}</Td>      {/* ← Perfil */}
          <Td>
            <Stack direction="row" spacing={2}>
              <Button
                size="xs"
                colorScheme="blue"
                onClick={() => onEdit(usuario)}
              >
                Editar
              </Button>
              <Button
                size="xs"
                colorScheme="red"
                onClick={() => onDelete(usuario.id)}
              >
                Excluir
              </Button>
            </Stack>
          </Td>
        </>
      )}

    </MotionTr>
  );
}
