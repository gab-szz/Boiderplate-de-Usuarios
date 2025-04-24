import { Card } from "./components/card/Card"
import { Estilos } from "./components/styles/global/globalStyle"
import { ProvedorTema } from "./components/ThemeProvider/ThemeProvider"

function App() {

  return (
    <>
      <div>
        <ProvedorTema>
          <Estilos/>
            <Card>
              <p>Hello World</p>
            </Card>
        </ProvedorTema>
      </div>
    </>
  )
}

export default App
