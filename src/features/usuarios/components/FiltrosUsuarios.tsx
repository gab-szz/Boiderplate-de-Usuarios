import {
    Box,
    Collapse,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Grid,
    useDisclosure,
    Flex,
    GridItem,
  } from "@chakra-ui/react";
  import { ChangeEvent, FormEvent } from "react";
  
  // ← Define o que o componente espera receber
  interface Props {
    filtros: {
      codigo: string;
      nome: string;
      status: string;
    };
    setFiltros: (valores: Props["filtros"]) => void;
    confirmarBusca: () => void;
  }
  
  /**
   * Componente que exibe filtros para busca de usuários.
   * Ele é "controlado", ou seja, quem usa o componente passa os valores e ações.
   */
  export function FiltrosUsuarios({ filtros, setFiltros, confirmarBusca }: Props) {
    const {
        isOpen: visivel,
        onToggle: alterarVisibilidade,
      } = useDisclosure();
  
    // ← Atualiza o valor do campo ao digitar
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFiltros({ ...filtros, [name]: value }); // ← Atualiza o estado no componente pai
    };
  
    // ← Quando o formulário for enviado
    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();       // ← Evita recarregar a página
      confirmarBusca();         // ← Chama a função passada via props
    };
  
    return (
      <Box mb={6} textAlign="center">
        <Button onClick={alterarVisibilidade} mb={4} w="300px" size="sm">
          {visivel ? "Ocultar Filtros" : "Mostrar Filtros"}
        </Button>
  
        <Collapse in={visivel} animateOpacity>
          <Box
            as="form"
            onSubmit={handleSubmit} // ← Envia quando clicar em "Buscar"
            p={4}
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
            bg="gray.50"
          >

        <Grid
        templateColumns={{ base: "1fr", md: "repeat(6, 1fr)" }} // 6 frações em telas médias
        gap={4}
        mb={4}
        >
        <GridItem colSpan={{ base: 1, md: 1 }}>
            <FormControl>
            <FormLabel>Código</FormLabel>
            <Input
                name="codigo"
                type="number"
                size="sm"
                placeholder="ID do usuário"
                value={filtros.codigo}
                onChange={handleChange}
            />
            </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 3 }}>
            <FormControl>
            <FormLabel>Nome</FormLabel>
            <Input
                name="nome"
                type="text"
                size="sm"
                placeholder="Nome do usuário"
                value={filtros.nome}
                onChange={handleChange}
            />
            </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
            <FormControl>
            <FormLabel>Status</FormLabel>
            <Select
                name="status"
                size="sm"
                value={filtros.status}
                onChange={handleChange}
                placeholder="Todos"
            >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
            </Select>
            </FormControl>
        </GridItem>
        </Grid>

  
            <Flex justify="flex-end">
              <Button type="submit" colorScheme="blue" size="sm">
                Buscar
              </Button>
            </Flex>
          </Box>
        </Collapse>
      </Box>
    );
  }
  