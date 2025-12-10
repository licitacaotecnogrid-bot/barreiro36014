import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Logo from "@/components/brand/Logo";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getApiUrl } from "@/lib/api";

export default function Register() {
  const navigate = useNavigate();
  const { setCurrentUser } = useCurrentUser();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [cargo, setCargo] = useState("Aluno");
  const [curso, setCurso] = useState("Análise e Desenvolvimento de Sistemas");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!nome.trim()) {
      setError("Por favor, insira seu nome");
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError("Por favor, insira seu e-mail");
      setLoading(false);
      return;
    }

    if (!senha.trim()) {
      setError("Por favor, insira uma senha");
      setLoading(false);
      return;
    }

    if (senha !== confirmarSenha) {
      setError("As senhas não conferem");
      setLoading(false);
      return;
    }

    if (senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(getApiUrl("/api/usuarios"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha, cargo, curso }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao criar conta");
        setLoading(false);
        return;
      }

      setCurrentUser(data);
      navigate("/dashboard");
    } catch (err) {
      setError("Erro ao conectar com o servidor");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <section className="hidden md:flex items-center justify-center bg-primary text-primary-foreground p-10">
        <div className="max-w-md w-full">
          <div className="w-full flex items-center gap-4">
            <Logo className="h-28" wordmark={false} />
            <div className="h-20 w-px bg-primary-foreground/40" />
            <div className="text-3xl font-semibold tracking-tight">Barreiro 360</div>
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <p className="text-sm text-muted-foreground">PUC Minas</p>
            <h2 className="text-2xl font-semibold tracking-tight">Criar conta</h2>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label htmlFor="nome" className="text-sm font-medium">
                Nome
              </label>
              <input
                id="nome"
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome completo"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@pucminas.br"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="cargo" className="text-sm font-medium">
                Cargo
              </label>
              <select
                id="cargo"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="Aluno">Aluno</option>
                <option value="Professor">Professor</option>
                <option value="Coordenador">Coordenador</option>
              </select>
            </div>
            {cargo === "Professor" && (
              <div className="space-y-1.5">
                <label htmlFor="curso" className="text-sm font-medium">
                  Curso
                </label>
                <input
                  id="curso"
                  type="text"
                  value={curso}
                  onChange={(e) => setCurso(e.target.value)}
                  placeholder="Ex: Análise e Desenvolvimento de Sistemas"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label htmlFor="senha" className="text-sm font-medium">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="confirmarSenha" className="text-sm font-medium">
                Confirmar Senha
              </label>
              <input
                id="confirmarSenha"
                type="password"
                required
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Confirme sua senha"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Faça login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
