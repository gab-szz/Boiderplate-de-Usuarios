// src/utils/toastUtils.ts
import { UseToastOptions } from "@chakra-ui/react";

export function mostrarToast(toast, status: string, mensagem?: string) {
  const config: UseToastOptions = {
    title: mensagem || (status === "success" ? "Sucesso!" : "Erro!"),
    status: status === "success" ? "success" : "error",
    isClosable: true,
  };

  toast(config);
}
