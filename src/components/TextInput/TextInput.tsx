import styled from "@emotion/styled"
import { ReactNode } from "react"

type CampoTextoPropriedades = {
  texto: string
  tipo?: string
  id?: string
  valor?: string
  aoMudar?: (evento: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  children?: ReactNode
}

const LabelCustomizada = styled.label`
  font-size: ${props => props.theme.tamanhosTexto.m};
  font-weight: ${props => props.theme.espessuras.regular};
  margin-bottom: ${props => props.theme.espaceamentos.xs};
  display: inline-block;
`


// ⬇️ Estilo customizado por Emotion
const InputCustomizado = styled.input`
  font-size: ${props => props.theme.tamanhosTexto.s};
  padding: 2px 10px;
  height: ${props => props.theme.espaceamentos.xl};
  line-height: 1.4;
`

export const CampoTexto = (propriedades: CampoTextoPropriedades) => {
  const {
    texto,
    tipo = "text",
    id,
    valor,
    aoMudar,
    placeholder,
    children,
  } = propriedades

  return (
    <div className="mb-3">
      <LabelCustomizada  htmlFor={id}>
        {texto}
      </LabelCustomizada>

      <InputCustomizado
        type={tipo}
        id={id}
        value={valor}
        onChange={aoMudar}
        placeholder={placeholder}
        className="form-control" // ⬅️ Mantém o visual Bootstrap, mas sobrescreve o necessário
      />

      {children}
    </div>
  )
}
