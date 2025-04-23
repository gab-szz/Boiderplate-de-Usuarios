import { css, Global } from "@emotion/react"

// Define os estilos globais usando a função css
// Aqui está definindo uma fonte padrão para o projeto
const estilos = css`
    p, h1, h2, h3, a {
        font-family: "Montserrat", sans-serif;
    }
`

// Cria um componente chamado Estilos
// Quando usado na aplicação, ele injeta os estilos globais definidos acima
export const Estilos = () => {
    // O componente <Global /> é da Emotion
    // Ele recebe os estilos via prop css e aplica no DOM globalmente
    return (
        <Global styles={estilos} />
    )
}