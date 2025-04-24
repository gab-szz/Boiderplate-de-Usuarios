import styled from "@emotion/styled";
import { ReactNode } from "react"

type CartaoPropriedades = {
    children: ReactNode
  } 

const DivCartao = styled.div`
    padding: ${props => props.theme.espaceamentos.l};
    background: ${props => props.theme.cores.secundarias.a};
    border: 1px solid;
    border-color: ${props => props.theme.cores.primarias.a};
    border-radius: ${props => props.theme.espaceamentos.s};
`;

export const Cartao = ({ children }: CartaoPropriedades): JSX.Element => {
    return (
        <DivCartao>
            {children}
        </DivCartao>
    )
};