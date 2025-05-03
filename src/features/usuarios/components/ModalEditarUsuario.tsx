// src/features/usuarios/components/ModalEditarUsuario.tsx

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
    Stack,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { Usuario } from "../types";
  
  /**
   * Propriedades esperadas pelo Modal de edição de usuário:
   * - isOpen: controla a exibição do modal (true/false)
   * - onClose: função que fecha o modal
   * - usuario: dados do usuário a ser editado
   * - onAtualizar: função que será chamada ao clicar em "Salvar"
   */
  interface Props {
    isOpen: boolean;
    onClose: () => void;
    usuario: Usuario;
    onAtualizar: (dados: Partial<Usuario>) => void | Promise<void>;
  }
  
  /**
   * Componente que representa o modal de edição de um usuário.
   * Exibe um formulário com campos de nome, login e perfil,
   * permitindo ao usuário editar esses valores.
   *
   * Ao clicar em "Salvar", chama a função `onAtualizar` com os dados preenchidos.
   *
   * @param props - Props contendo o controle do modal e dados do usuário
   * @returns JSX do modal de edição
   */
  export function ModalEditarUsuario({
    isOpen,
    onClose,
    usuario,
    onAtualizar,
  }: Props) {
    // Armazena os valores temporários enquanto o usuário edita os campos
    const [nome, setNome] = useState(usuario.nome);
    const [login, setLogin] = useState(usuario.login);
    const [perfil, setPerfil] = useState(usuario.perfil);
  
    // Controla o estado de carregamento do botão "Salvar"
    const [salvando, setSalvando] = useState(false);
  
    /**
     * Função executada ao clicar em "Salvar".
     * Chama a função de atualização recebida por props com os novos dados.
     */
    const handleSalvar = async () => {
      setSalvando(true);
      await onAtualizar({ nome, login, perfil });
      setSalvando(false);
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          {/* Cabeçalho do modal */}
          <ModalHeader>Editar Usuário</ModalHeader>
          <ModalCloseButton />
  
          {/* Corpo do modal com os campos de formulário */}
          <ModalBody>
            <Stack spacing={3}>
              <FormControl>
                <FormLabel>Nome</FormLabel>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Login</FormLabel>
                <Input value={login} onChange={(e) => setLogin(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Perfil</FormLabel>
                <Input value={perfil} onChange={(e) => setPerfil(e.target.value)} />
              </FormControl>
            </Stack>
          </ModalBody>
  
          {/* Rodapé com botões de ação */}
          <ModalFooter>
            <Button onClick={onClose} mr={3} variant="ghost">
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSalvar}
              isLoading={salvando}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  