// src/components/usuarios/ModalEditarUsuario.tsx

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Usuario } from "../../types/Usuario";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  usuario: Usuario | null;
  onAtualizar: (usuarioAtualizado: Usuario) => void;
}

export default function ModalEditarUsuario({ isOpen, onClose, usuario, onAtualizar }: Props) {
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [perfil, setPerfil] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome);
      setLogin(usuario.login);
      setPerfil(usuario.perfil);
    }
  }, [usuario]);

  async function handleSalvar() {
    if (!usuario) return;
    try {
      await onAtualizar({
        id: usuario.id,
        nome,
        login,
        perfil,
        data_criacao: usuario.data_criacao,
      });
      onClose();
    } catch (erro) {
      console.error("Erro ao atualizar usuário:", erro);
      toast({
        title: "Erro ao atualizar usuário",
        status: "error",
        isClosable: true,
      });
    }
  }
  

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Usuário</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Nome</FormLabel>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Login</FormLabel>
            <Input value={login} onChange={(e) => setLogin(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Perfil</FormLabel>
            <Input value={perfil} onChange={(e) => setPerfil(e.target.value)} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3}>Cancelar</Button>
          <Button colorScheme="blue" onClick={handleSalvar}>Salvar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
