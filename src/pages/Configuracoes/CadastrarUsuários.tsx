import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Tipografia } from "../../components/Tipografia/Tipografia";
import { CampoTexto } from "../../components/CampoTexto/CampoTexto";
import { CampoSelecao } from "../../components/CampoSelecao/CampoSelecao";
import { useState } from "react";

const CadastroUsuario = () => {
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("");

  const perfis = [
    { id: 1, nome: "Administrador" },
    { id: 2, nome: "Usuário Comum" },
    { id: 3, nome: "Supervisor" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ nome, login, senha, perfil });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Tipografia componente="h2" variante="h1" className="text-center mb-4">
            Cadastrar Novo Usuário
          </Tipografia>

          <Form onSubmit={handleSubmit}>
            <CampoTexto
              texto="Nome e Sobrenome"
              valor={nome}
              aoMudar={(e) => setNome(e.target.value)}
              placeholder="Nome completo"
              id="nome"
            />

            <CampoTexto
              texto="Login"
              valor={login}
              aoMudar={(e) => setLogin(e.target.value)}
              placeholder="ex: gabriel"
              id="login"
            />

            <CampoTexto
              texto="Senha"
              tipo="password"
              valor={senha}
              aoMudar={(e) => setSenha(e.target.value)}
              placeholder="********"
              id="senha"
            />

            <CampoSelecao
              texto="Perfil"
              id="perfil"
              valor={perfil}
              aoMudar={(e) => setPerfil(e.target.value)}
              opcoes={perfis}
            />

            <Button type="submit" variant="success">
              Cadastrar Usuário
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CadastroUsuario;
