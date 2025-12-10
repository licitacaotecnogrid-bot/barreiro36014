type Props = { title: string; description?: string };

export default function Placeholder({ title, description }: Props) {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 text-primary px-3 py-1 mb-3">
        <span className="text-xs font-medium">Barreiro 360</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
      {description ? (
        <p className="mt-2 text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-6 rounded-xl border bg-card p-6 text-left">
        <p className="text-sm text-muted-foreground">
          Esta tela será implementada em seguida. Continue solicitando para
          preencher os detalhes desta página.
        </p>
      </div>
    </div>
  );
}
