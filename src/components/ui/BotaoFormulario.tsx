import { Button, ButtonProps } from "@chakra-ui/react";
import { ReactNode } from "react";

type BotaoFormularioProps = {
  children: ReactNode;        // conteúdo do botão
  onClick: () => void;        // função executada ao clicar
  isLoading?: boolean;        // ativa spinner
  colorScheme?: string;       // cor opcional (default: blue)
  width?: string;             // largura (default: full)
  size?: string;              // tamanho (default: sm)
  mt?: number;                // margin-top (default: 4)
  disabled?: boolean;         // permite forçar desabilitar
} & Omit<ButtonProps, "onClick" | "isLoading" | "isDisabled" | "colorScheme" | "width" | "size" | "mt">;
// ↑ evita conflito entre os props que você controla e os que vêm de fora

export function BotaoFormulario({
  children,
  onClick,
  isLoading = false,
  colorScheme = "blue",
  width = "full",
  size = "sm",
  mt = 4,
  disabled = false,
  ...rest // qualquer outra prop do Chakra Button (ex: type, icon, etc)
}: BotaoFormularioProps) {
  return (
    <Button
      colorScheme={colorScheme}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      isLoading={isLoading}
      isDisabled={isLoading || disabled}
      width={width}
      size={size}
      mt={mt}
      {...rest} // permite usar icons, type, variant, etc
    >
      {children}
    </Button>
  );
}
