import { ThemeProvider } from "@emotion/react"
import { ReactNode } from "react"

// Define os tipos do tema se quiser customizar depois
export interface Tema {
    cores: {
      branco: string
      atencao: string
      focus: string
  
      primarias: {
        a: string
        b: string
        c: string
      }
  
      secundarias: {
        a: string
        b: string
        c: string
      }
  
      neutras: {
        a: string
        b: string
        c: string
      }
  
      dark: {
        a: string
        b: string
      }
    },
    espaceamentos: {
      none: string,
      xs: string,     // Extra pequeno
      s: string,     // Pequeno
      m: string,    // Médio (padrão)
      l: string,    // Grande
      xl: string,    // Extra grande
      xxl: string,   // Muito grande
      xxxl: string,  // Enorme (usado em containers maiores)
    },
  }
  

// Objeto de tema
const tema: Tema = {
    cores: {
        branco: '',
        atencao: '',
        focus: '',

        primarias: {
            a: '#5754ED',
            b: '',
            c: '',
        },
        secundarias: {
            a: '#EBEAF9',
            b: '',
            c: '',
        },
        neutras: {
            a: '',
            b: '',
            c: '',
        },
        dark: {
            a: '',
            b: '',
        },
    },
    espaceamentos: {
      none: "0px",
      xs: "4px",     // Extra pequeno
      s: "8px",     // Pequeno
      m: "16px",    // Médio (padrão)
      l: "24px",    // Grande
      xl: "32px",    // Extra grande
      xxl: "48px",   // Muito grande
      xxxl: "64px",  // Enorme (usado em containers maiores)
    }, 
    tamanhosTexto: {
      xs: "10px",
      s: "12px",
      m: "14px",
      l: "18px",
    },
    espessuras: {
      thin: 100,
      extraLight: 200,
      light: 300,
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
      extraBold: 800,
      black: 900,
    },    
    fontFamily: '"Montserrat", sans-serif',
}

// Tipagem das props do ProvedorTema
type ProvedorTemaProps = {
  children: ReactNode
}

// Componente que aplica o tema global
export const ProvedorTema = ({ children }: ProvedorTemaProps): JSX.Element => {
  return <ThemeProvider theme={tema}>{children}</ThemeProvider>
}
