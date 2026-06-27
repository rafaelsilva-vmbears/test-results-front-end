/**
 * Representa um projeto disponível no sistema.
 */
export type Project = {
  id: string; // ID único do projeto (pode ser o próprio nome por enquanto)
  name: string; // Nome de exibição do projeto
  environments?: Environment[]; // Ambientes disponíveis para este projeto
};

/**
 * Representa um ambiente disponível para um projeto.
 */
export type Environment = {
  id: string; // ID único do ambiente (pode ser o próprio nome por enquanto)
  name: string; // Nome de exibição do ambiente (ex: "RC", "Staging", "Produção")
  label: string; // Label para exibição na UI (ex: "RC" para id "rc")
};
