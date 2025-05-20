// src/types/Usuario.ts
export interface Usuario {
    id: number;
    nome: string;
    login: string;
    senha?: string; // Adicione isso se quiser manter um tipo único
    email: string;
    perfil: string;
    data_criacao?: string;
  }
  