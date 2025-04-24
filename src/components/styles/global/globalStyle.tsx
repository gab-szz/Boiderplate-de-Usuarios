import { Global } from "@emotion/react"

/*
// Define os estilos globais usando a função css
// Aqui está definindo uma fonte padrão para o projeto
const estilos = css`
    * {
        font-family: ${props => props.theme.fontFamily};
    }
`
*/

const estilos = tema => {
    return {
        html: {
            fontFamily: tema.fontFamily,
        },
        body: {
            margin: 0,
        }
    }
}

// Cria um componente chamado Estilos
// Quando usado na aplicação, ele injeta os estilos globais definidos acima
export const Estilos = (): JSX.Element => {
    // O componente <Global /> é da Emotion
    // Ele recebe os estilos via prop css e aplica no DOM globalmente
    return (
        <Global styles={estilos} />
    )
}