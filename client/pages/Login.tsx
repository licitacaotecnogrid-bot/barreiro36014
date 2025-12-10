import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Logo from "@/components/brand/Logo";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getApiUrl } from "@/lib/api";

export default function Login() {
  const navigate = useNavigate();
  const { setCurrentUser } = useCurrentUser();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim()) {
      setError("Por favor, insira seu e-mail");
      setLoading(false);
      return;
    }

    if (!senha.trim()) {
      setError("Por favor, insira sua senha");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(getApiUrl("/api/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao fazer login");
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
            <h2 className="text-2xl font-semibold tracking-tight">Acessar conta</h2>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
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
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex items-center justify-between">
              <a href="#" className="text-sm text-primary hover:underline">
                Esqueci minha senha
              </a>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Carregando..." : "Entrar"}
            </button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Criar conta
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
