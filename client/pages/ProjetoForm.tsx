import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useProjetos } from "@/hooks/use-projetos";
import { useProfessores } from "@/hooks/use-professores";
import { toast } from "@/hooks/use-toast";

const ProjetoForm = () => {
  const navigate = useNavigate();
  const { id, type } = useParams();
  const { 
    projetosPesquisa, 
    projetosExtensao, 
    addProjetoPesquisa, 
    updateProjetoPesquisa,
    addProjetoExtensao,
    updateProjetoExtensao,
    getProjetoPesquisaById,
    getProjetoExtensaoById,
  } = useProjetos();
  const { professores } = useProfessores();

  const [tipoProeto, setTipoProeto] = useState(type || "pesquisa");
  const [titulo, setTitulo] = useState("");
  const [areaTematica, setAreaTematica] = useState("");
  const [descricao, setDescricao] = useState("");
  const [momentoOcorre, setMomentoOcorre] = useState("");
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [imagemFile, setImagemFile] = useState<string | null>(null);
  const [professorCoordenadorId, setProfessorCoordenadorId] = useState("");

  // Research project specific fields
  const [problemaPesq, setProblemaP] = useState("");
  const [metodologia, setMetodologia] = useState("");
  const [resultadosEsperados, setResultadosEsperados] = useState("");

  // Extension project specific fields
  const [tipoPessoasProcuram, setTipoPessoasProcuram] = useState("");
  const [comunidadeEnvolvida, setComunidadeEnvolvida] = useState("");

  useEffect(() => {
    if (id && type) {
      if (type === "pesquisa") {
        const projeto = getProjetoPesquisaById(parseInt(id));
        if (projeto) {
          setTitulo(projeto.titulo);
          setAreaTematica(projeto.areaTematica);
          setDescricao(projeto.descricao);
          setMomentoOcorre(projeto.momentoOcorre);
          setProfessorCoordenadorId(projeto.professorCoordenadorId.toString());
          setProblemaP(projeto.problemaPesquisa);
          setMetodologia(projeto.metodologia);
          setResultadosEsperados(projeto.resultadosEsperados);
          if (projeto.imagem) {
            setImagemPreview(projeto.imagem);
          }
        }
      } else if (type === "extensao") {
        const projeto = getProjetoExtensaoById(parseInt(id));
        if (projeto) {
          setTitulo(projeto.titulo);
          setAreaTematica(projeto.areaTematica);
          setDescricao(projeto.descricao);
          setMomentoOcorre(projeto.momentoOcorre);
          setProfessorCoordenadorId(projeto.professorCoordenadorId.toString());
          setTipoPessoasProcuram(projeto.tipoPessoasProcuram);
          setComunidadeEnvolvida(projeto.comunidadeEnvolvida);
          if (projeto.imagem) {
            setImagemPreview(projeto.imagem);
          }
        }
      }
    }
  }, [id, type, getProjetoPesquisaById, getProjetoExtensaoById]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setImagemFile(base64);
        setImagemPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo || !areaTematica || !descricao || !momentoOcorre || !professorCoordenadorId) {
      toast({ title: "Erro", description: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    if (tipoProeto === "pesquisa") {
      if (!problemaPesq || !metodologia || !resultadosEsperados) {
        toast({ title: "Erro", description: "Preencha todos os campos obrigatórios para pesquisa", variant: "destructive" });
        return;
      }

      const projetoPesquisa = {
        titulo,
        areaTematica,
        descricao,
        momentoOcorre,
        problemaPesquisa: problemaPesq,
        metodologia,
        resultadosEsperados,
        imagem: imagemFile,
        professorCoordenadorId: parseInt(professorCoordenadorId),
      };

      if (id) {
        updateProjetoPesquisa(parseInt(id), projetoPesquisa);
        toast({ title: "Sucesso", description: "Projeto de pesquisa atualizado com sucesso" });
      } else {
        addProjetoPesquisa(projetoPesquisa);
        toast({ title: "Sucesso", description: "Projeto de pesquisa criado com sucesso" });
      }
    } else {
      if (!tipoPessoasProcuram || !comunidadeEnvolvida) {
        toast({ title: "Erro", description: "Preencha todos os campos obrigatórios para extensão", variant: "destructive" });
        return;
      }

      const projetoExtensao = {
        titulo,
        areaTematica,
        descricao,
        momentoOcorre,
        tipoPessoasProcuram,
        comunidadeEnvolvida,
        imagem: imagemFile,
        professorCoordenadorId: parseInt(professorCoordenadorId),
      };

      if (id) {
        updateProjetoExtensao(parseInt(id), projetoExtensao);
        toast({ title: "Sucesso", description: "Projeto de extensão atualizado com sucesso" });
      } else {
        addProjetoExtensao(projetoExtensao);
        toast({ title: "Sucesso", description: "Projeto de extensão criado com sucesso" });
      }
    }

    navigate("/projetos");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <button
        onClick={() => navigate("/projetos")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Projetos
      </button>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">{id ? "Editar Projeto" : "Novo Projeto"}</CardTitle>
          <CardDescription>Crie ou atualize um projeto de pesquisa ou extensão</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipo-projeto" className="text-xs sm:text-sm font-medium">
                  Tipo de Projeto *
                </Label>
                <Select value={tipoProeto} onValueChange={setTipoProeto} disabled={!!id}>
                  <SelectTrigger id="tipo-projeto" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pesquisa">Pesquisa</SelectItem>
                    <SelectItem value="extensao">Extensão</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="professor" className="text-xs sm:text-sm font-medium">
                  Professor Coordenador *
                </Label>
                <Select value={professorCoordenadorId} onValueChange={setProfessorCoordenadorId}>
                  <SelectTrigger id="professor" className="mt-1">
                    <SelectValue placeholder="Selecione um professor" />
                  </SelectTrigger>
                  <SelectContent>
                    {professores.map((professor) => (
                      <SelectItem key={professor.id} value={professor.id.toString()}>
                        {professor.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="titulo" className="text-xs sm:text-sm font-medium">
                Título *
              </Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Digite o título do projeto"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="area" className="text-xs sm:text-sm font-medium">
                Área Temática *
              </Label>
              <Input
                id="area"
                value={areaTematica}
                onChange={(e) => setAreaTematica(e.target.value)}
                placeholder="Ex: Segurança da Informação"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="data" className="text-xs sm:text-sm font-medium">
                Data de Ocorrência *
              </Label>
              <Input
                id="data"
                type="date"
                value={momentoOcorre}
                onChange={(e) => setMomentoOcorre(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="descricao" className="text-xs sm:text-sm font-medium">
                Descrição *
              </Label>
              <Textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Digite a descrição do projeto"
                rows={4}
                className="mt-1"
              />
            </div>

            {tipoProeto === "pesquisa" ? (
              <>
                <div>
                  <Label htmlFor="problema" className="text-xs sm:text-sm font-medium">
                    Problema de Pesquisa *
                  </Label>
                  <Textarea
                    id="problema"
                    value={problemaPesq}
                    onChange={(e) => setProblemaP(e.target.value)}
                    placeholder="Qual é o problema de pesquisa?"
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="metodologia" className="text-xs sm:text-sm font-medium">
                    Metodologia *
                  </Label>
                  <Textarea
                    id="metodologia"
                    value={metodologia}
                    onChange={(e) => setMetodologia(e.target.value)}
                    placeholder="Descreva a metodologia da pesquisa"
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="resultados" className="text-xs sm:text-sm font-medium">
                    Resultados Esperados *
                  </Label>
                  <Textarea
                    id="resultados"
                    value={resultadosEsperados}
                    onChange={(e) => setResultadosEsperados(e.target.value)}
                    placeholder="Quais são os resultados esperados?"
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="publico" className="text-xs sm:text-sm font-medium">
                    Tipo de Pessoas Procuradas *
                  </Label>
                  <Input
                    id="publico"
                    value={tipoPessoasProcuram}
                    onChange={(e) => setTipoPessoasProcuram(e.target.value)}
                    placeholder="Ex: Estudantes de programação"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="comunidade" className="text-xs sm:text-sm font-medium">
                    Comunidade Envolvida *
                  </Label>
                  <Input
                    id="comunidade"
                    value={comunidadeEnvolvida}
                    onChange={(e) => setComunidadeEnvolvida(e.target.value)}
                    placeholder="Ex: Comunidade de tecnologia local"
                    className="mt-1"
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="imagem" className="text-xs sm:text-sm font-medium">
                Imagem do Projeto
              </Label>
              <Input
                id="imagem"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1"
              />
              {imagemPreview && (
                <div className="mt-4">
                  <img
                    src={imagemPreview}
                    alt="Preview"
                    className="max-h-48 rounded-md object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {id ? "Atualizar Projeto" : "Criar Projeto"}
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/projetos")}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjetoForm;
