export interface ODS {
  id: number;
  numero: number;
  titulo: string;
  descricao: string;
  cor: string;
}

export const odsData: ODS[] = [
  {
    id: 1,
    numero: 1,
    titulo: "Erradicação da Pobreza",
    descricao: "Acabar com a pobreza em todas as suas formas, em todos os lugares",
    cor: "#E5243B",
  },
  {
    id: 2,
    numero: 2,
    titulo: "Fome Zero e Agricultura Sustentável",
    descricao: "Acabar com a fome, alcançar a segurança alimentar e melhoria da nutrição",
    cor: "#DDA250",
  },
  {
    id: 3,
    numero: 3,
    titulo: "Saúde e Bem-estar",
    descricao: "Assegurar uma vida saudável e promover o bem-estar para todos",
    cor: "#4C9F38",
  },
  {
    id: 4,
    numero: 4,
    titulo: "Educação de Qualidade",
    descricao: "Assegurar a educação inclusiva e equitativa de qualidade para todos",
    cor: "#C6192B",
  },
  {
    id: 5,
    numero: 5,
    titulo: "Igualdade de Gênero",
    descricao: "Alcançar a igualdade de gênero e empoderar todas as mulheres e meninas",
    cor: "#DD3E39",
  },
  {
    id: 6,
    numero: 6,
    titulo: "Água Potável e Saneamento",
    descricao: "Garantir disponibilidade e gestão sustentável da água e saneamento",
    cor: "#26BDE2",
  },
  {
    id: 7,
    numero: 7,
    titulo: "Energia Limpa e Acessível",
    descricao: "Assegurar acesso à energia moderna, confiável, sustentável e a preço acessível",
    cor: "#FCB81E",
  },
  {
    id: 8,
    numero: 8,
    titulo: "Trabalho Decente e Crescimento Econômico",
    descricao: "Promover o crescimento econômico sustentado, inclusivo e trabalho decente",
    cor: "#A21E48",
  },
  {
    id: 9,
    numero: 9,
    titulo: "Indústria, Inovação e Infraestrutura",
    descricao: "Construir infraestruturas resilientes, promover inovação e industrialização",
    cor: "#DD1C3B",
  },
  {
    id: 10,
    numero: 10,
    titulo: "Redução das Desigualdades",
    descricao: "Reduzir a desigualdade dentro dos países e entre eles",
    cor: "#DD1C3B",
  },
  {
    id: 11,
    numero: 11,
    titulo: "Cidades e Comunidades Sustentáveis",
    descricao: "Tornar as cidades e assentamentos humanos inclusivos e sustentáveis",
    cor: "#FCC20C",
  },
  {
    id: 12,
    numero: 12,
    titulo: "Consumo e Produção Sustentáveis",
    descricao: "Assegurar padrões de produção e consumo sustentáveis",
    cor: "#BF8B2E",
  },
  {
    id: 13,
    numero: 13,
    titulo: "Ação Climática",
    descricao: "Tomar medidas urgentes para combater a mudança climática",
    cor: "#407D52",
  },
  {
    id: 14,
    numero: 14,
    titulo: "Vida na Água",
    descricao: "Conservar e usar de forma sustentável os oceanos, mares e recursos marinhos",
    cor: "#0A97D9",
  },
  {
    id: 15,
    numero: 15,
    titulo: "Vida Terrestre",
    descricao: "Proteger, recuperar e promover o uso sustentável dos ecossistemas terrestres",
    cor: "#56C596",
  },
  {
    id: 16,
    numero: 16,
    titulo: "Paz, Justiça e Instituições Fortes",
    descricao: "Promover sociedades pacíficas e inclusivas e instituições eficazes",
    cor: "#0066CC",
  },
  {
    id: 17,
    numero: 17,
    titulo: "Parcerias para os Objetivos",
    descricao: "Fortalecer os meios de implementação e parcerias para os objetivos",
    cor: "#DD5E4B",
  },
];

export function getODSById(id: number): ODS | undefined {
  return odsData.find((ods) => ods.numero === id);
}

export function getODSByIds(ids: number[]): ODS[] {
  return ids.map((id) => getODSById(id)).filter(Boolean) as ODS[];
}
