// src/features/usuarios/components/UsuarioRow.tsx

import { chakra, Td, Button, Stack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Usuario } from "../../../types/Usuario";

interface Props {
  usuario: Usuario | null;
  onEdit: (usuario: Usuario) => void;
  onDelete: (id: number) => void;
}

// Faz o motion.tr ser Chakra-aware
const MotionTr = chakra(motion.tr);

export function UsuarioRow({ usuario, onEdit, onDelete }: Props) {
  return (
    <MotionTr
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {usuario === null ? (
        <Td colSpan={5} textAlign="center">
          Nenhum usuário encontrado
        </Td>
      ) : (
        <>
          <Td>{usuario.id}</Td>
          <Td>{usuario.nome}</Td>
          <Td>{usuario.login}</Td>
          <Td>{usuario.perfil}</Td>
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
