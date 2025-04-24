import { CSSProperties, ReactNode } from "react"

type DivEstilizadaPropriedades = {
  children: ReactNode
  className?: string           // classes Bootstrap ou personalizadas
  estilo?: CSSProperties       // estilos inline opcionais
  id?: string
  onClick?: () => void
}

export const DivEstilizada = (propriedades: DivEstilizadaPropriedades) => {
  const {
    children,
    className = "",
    estilo = {},
    id,
    onClick,
  } = propriedades

  return (
    <div className={className} style={estilo} id={id} onClick={onClick}>
      {children}
    </div>
  )
}
