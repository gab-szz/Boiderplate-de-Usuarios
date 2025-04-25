import { Container } from "react-bootstrap";
import { Estilos } from "./components/styles/global/EstilosGlobais";
import { ProvedorTema } from "./components/ProvedorTema/ProvedorTema";
import CadastroUsuario from "./pages/Configuracoes/CadastrarUsuários";

function App() {
  return (
    <ProvedorTema>
      <Estilos />
      <Container fluid className="px-3">
        <CadastroUsuario/>
      </Container>
    </ProvedorTema>
  );
}

export default App;
