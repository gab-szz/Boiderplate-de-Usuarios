import styled from "@emotion/styled";
import { ReactNode, ChangeEvent } from "react";

/**
 * Propriedades esperadas pelo componente CampoSelecao
 */
type CampoSelecaoProps = {
  texto: string;
  id?: string;
  valor: string;
  aoMudar: (evento: ChangeEvent<HTMLSelectElement>) => void;
  opcoes: { id: string | number; nome: string }[];
  className?: string;
  children?: ReactNode;
};

// Estilização do label com base no tema global
const LabelCustomizada = styled.label`
  font-size: ${(props) => props.theme.tamanhosTexto.m};
  font-weight: ${(props) => props.theme.espessuras.regular};
  margin-bottom: ${(props) => props.theme.espaceamentos.xs};
  display: inline-block;
`;

// Estilização do select com base no tema global
const SelectCustomizado = styled.select`
  font-size: ${(props) => props.theme.tamanhosTexto.s};
  padding: 2px 10px;
  height: ${(props) => props.theme.espaceamentos.xl};
  line-height: 1.4;
`;

/**
 * Componente reutilizável para campo de seleção (select).
 * Estilizado com Emotion e visual compatível com Bootstrap.
 */
export const CampoSelecao = ({
  texto,
  id,
  valor,
  aoMudar,
  opcoes,
  className,
  children,
}: CampoSelecaoProps): JSX.Element => {
  return (
    <div className="mb-3">
      <LabelCustomizada htmlFor={id}>{texto}</LabelCustomizada>

      <SelectCustomizado
        id={id}
        value={valor}
        onChange={aoMudar}
        className={`form-select ${className ?? ""}`} // Compatível com Bootstrap
        required
      >
        <option value="">Selecione</option>
        {opcoes.map((opcao) => (
          <option key={opcao.id} value={opcao.id}>
            {opcao.nome}
          </option>
        ))}
      </SelectCustomizado>

      {children}
    </div>
  );
};
