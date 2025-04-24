import styled from "@emotion/styled"
import { ReactNode } from "react"

// Lista de nomes de tags HTML disponíveis
const tagsDisponiveis = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    body: 'p',
    bodyBold: 'strong',
    body2: 'p',
    body2Bold: 'strong',
    legenda: 'p'
} as const

// Lista de estilos CSS para cada tag
const estilosDisponiveis = {
    h1: `
        font-weight: 600;
        font-size: 40px;
        line-height: 49px;
    `,
    h2: `
        font-weight: 600;
        font-size: 32px;
        line-height: 39px;
    `,
    h3: `
        font-weight: 500;
        font-size: 24px;
        line-height: 29px;
    `,
    body: `
        font-weight: 400;
        font-size: 20px;
        line-height: 24px;
    `,
    bodyBold: `
        font-weight: 700;
        font-size: 20px;
        line-height: 24px;
    `,
    body2: `
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
    `,
    body2Bold: `
        font-weight: 700;
        font-size: 16px;
        line-height: 20px;
    `,
    legenda: `
        font-weight: 400;
        font-size: 14px;
        line-height: 17px;
    `,
} as const

// Define quais valores 'variante' e 'componente' podem receber
type TipoVariante = keyof typeof estilosDisponiveis // 'h1' | 'p'
type TipoComponente = keyof typeof tagsDisponiveis  // 'h1' | 'p'

// Define as propriedades esperadas no componente principal
type TipografiaProps = {
  variante: TipoVariante
  componente: TipoComponente
  children: ReactNode
}

// Interface usada no componente estilizado para acessar o estilo
interface PropsEstilizadas {
  $tipo: TipoVariante
}

// Função que retorna o estilo CSS baseado no tipo
const obterEstilo = (props: PropsEstilizadas) => {
  const tipo = props.$tipo
  const estiloCSS = estilosDisponiveis[tipo]
  return estiloCSS
}

// Componente estilizado com estilo dinâmico
const BaseEstilizada = styled.p<PropsEstilizadas>`
  ${obterEstilo}
`

// Componente principal
export const Tipografia = ({ variante, componente, children }: TipografiaProps) => {
  const TagHTML = tagsDisponiveis[componente]

  return (
    <BaseEstilizada as={TagHTML} $tipo={variante}>
      {children}
    </BaseEstilizada>
  )
}
