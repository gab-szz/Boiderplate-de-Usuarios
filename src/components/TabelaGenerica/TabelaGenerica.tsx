// src/components/TabelaGenerica.tsx
import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Skeleton,
  Stack,
} from "@chakra-ui/react";

/**
 * Descreve uma coluna genérica para a tabela.
 * @template T Tipo de cada item da linha (ex: Usuario, Cliente, Pedido)
 */
export interface Coluna<T> {
  /** Chave do objeto que será exibida nesta coluna */
  chave: keyof T;

  /** Texto que aparece no cabeçalho da coluna */
  label: string;

  /**
   * Função opcional para renderizar o conteúdo da célula.
   * Se não definida, mostramos o valor bruto: item[chave]
   */
  render?: (item: T) => React.ReactNode;

  /** Alinhamento do texto na célula: left, center ou right */
  align?: "left" | "center" | "right";

  /** Largura fixa ou percentual (ex: "100px" ou "20%") */
  width?: string;
}

/**
 * Props do componente genérico de tabela.
 * @template T Tipo de cada objeto nas linhas da tabela.
 */
interface TabelaGenericaProps<T extends object> {
  /** Dados a serem exibidos nas linhas */
  dados: T[];

  /** Definição das colunas da tabela */
  colunas: Coluna<T>[];

  /** Exibe skeletons enquanto true */
  loading?: boolean;

  /** Estado atual de ordenação (coluna + direção) */
  sort?: { coluna: keyof T | null; direcao: "asc" | "desc" };

  /** Callback ao clicar no cabeçalho para ordenar */
  onSort?: (coluna: keyof T) => void;

  /** Rende ações customizadas (botões, menu) na última coluna */
  renderAcoes?: (item: T) => React.ReactNode;
}

/**
 * Componente de tabela genérico:
 * 1. Renderiza cabeçalho com labels e ícone de ordenação
 * 2. Exibe skeletons se estiver carregando
 * 3. Mostra placeholder se não houver dados
 * 4. Renderiza linhas e permite colunas/ações customizadas
 */
export function TabelaGenerica<T extends object>({
  dados,
  colunas,
  loading = false,
  sort,
  onSort,
  renderAcoes,
}: TabelaGenericaProps<T>) {
  return (
    <Table size="sm" variant="striped">
      {/* 1. Cabeçalho dinâmico */}
      <Thead>
        <Tr>
          {colunas.map((col) => (
            <Th
              key={String(col.chave)}
              cursor={onSort ? "pointer" : undefined}
              textAlign={col.align}
              width={col.width}
              onClick={() => onSort?.(col.chave)}
            >
              {col.label}
              {sort?.coluna === col.chave &&
                (sort.direcao === "asc" ? " ▲" : " ▼")}
            </Th>
          ))}
          {renderAcoes && <Th textAlign="center">Ações</Th>}
        </Tr>
      </Thead>

      {/* 2–4. Corpo da tabela */}
      <Tbody>
        {loading ? (
          // Skeleton de 3 linhas
          Array.from({ length: 3 }).map((_, i) => (
            <Tr key={i}>
              {colunas.map((_, j) => (
                <Td key={j}>
                  <Skeleton height="16px" />
                </Td>
              ))}
              {renderAcoes && (
                <Td>
                  <Stack direction="row" spacing={2}>
                    <Skeleton height="24px" width="50px" />
                    <Skeleton height="24px" width="50px" />
                  </Stack>
                </Td>
              )}
            </Tr>
          ))
        ) : dados.length === 0 ? (
          // Placeholder: sem dados
          <Tr>
            <Td colSpan={colunas.length + (renderAcoes ? 1 : 0)}>
              Nenhum dado encontrado.
            </Td>
          </Tr>
        ) : (
          // Render das linhas
          dados.map((item, rowIndex) => (
            <Tr key={rowIndex}>
              {colunas.map((col) => (
                <Td
                  key={String(col.chave)}
                  textAlign={col.align}
                  width={col.width}
                >
                  {col.render
                    ? col.render(item)
                    : String(item[col.chave] ?? "")}
                </Td>
              ))}
              {renderAcoes && <Td>{renderAcoes(item)}</Td>}
            </Tr>
          ))
        )}
      </Tbody>
    </Table>
  );
}
