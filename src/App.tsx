import { Cartao } from "./components/card/Card"
import { DivEstilizada } from "./components/StyledDiv/StyledDiv"
import { Estilos } from "./components/styles/global/globalStyle"
import { CampoTexto } from "./components/TextInput/TextInput"
import { ProvedorTema } from "./components/ThemeProvider/ThemeProvider"
import { Tipografia } from "./components/Tipografia/Tipografia"

function App() {

  return (
    <>
      <div>
        <ProvedorTema>
          <Estilos/>
            <Cartao>
              <Tipografia variante="h1" componente="h1">
                Criação de Usuário
              </Tipografia>
              <Tipografia variante="body" componente="p">
                Crie o usuário rapidamente para que ele possa começar a utilizar o UniWays agora mesmo!
              </Tipografia>
              <DivEstilizada className="col-2">
                <CampoTexto texto="Nome Completo" type="text" placeholder="Nome Completo" classeDiv="mb2" classeInput="form-control w-auto"/>
              </DivEstilizada>
            </Cartao>
        </ProvedorTema>
      </div>
    </>
  )
}

export default App
