import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchExcelHeaders, guessFieldType } from "@/lib/xlsx-helpers";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useEvents } from "@/hooks/use-events";
import { useProfessores } from "@/hooks/use-professores";
import { odsData } from "@/data/ods";

const PLANILHA_URL = "https://cdn.builder.io/o/assets%2F737d34773afb48d69db7c942a61ff110%2Fd18a6b3d0ffe437caa1b5971bb8c88f7?alt=media&token=13645332-c8f4-4496-9338-acda6f1fbf7b&apiKey=737d34773afb48d69db7c942a61ff110";

const fieldOptions: Record<string, string[]> = {
  "realizado pela puc minas?": ["Sim", "Não"],
  "modalidade": ["Online", "Presencial", "Híbrido"],
  "participação do público?": ["Sim", "Não"],
  "houve colaboração externa?": ["Sim", "Não"],
  "houve colaboração interna?": ["Sim", "Não"],
  "classificação": ["Seminar", "Workshop", "Palestra", "Conferência", "Minicurso", "Mesa Redonda", "Outro"],
  "tipo de atividade": ["Acadêmica", "Científica", "Cultural", "Esportiva", "Social", "Outra"],

  "tipo de evento": ["Projeto de Extensão", "Pesquisa"],
};

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function EventoForm() {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const { eventos, addEvento, updateEvento } = useEvents();
  const { professores } = useProfessores();
  const { id } = useParams();
  const [headers, setHeaders] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [anexosFiles, setAnexosFiles] = useState<File[]>([]);
  const [tipoEvento, setTipoEvento] = useState<string>("");
  const [modalidade, setModalidade] = useState<string>("");
  const [localEvento, setLocalEvento] = useState<string>("");
  const [linkEvento, setLinkEvento] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [odsAssociadas, setOdsAssociadas] = useState<number[]>([]);

  useEffect(() => {
    if (currentUser?.cargo === "Aluno") {
      navigate("/eventos");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    fetchExcelHeaders(PLANILHA_URL)
      .then((h) => setHeaders(h.filter(Boolean)))
      .catch((e) => setError(String(e)));
  }, []);

  const currentEvento = useMemo(() => {
    if (!id) return null;
    return eventos.find((e) => e.id === parseInt(id));
  }, [id, eventos]);

  const fields = useMemo(() => {
    return (headers || []).map((h) => ({ key: h, type: guessFieldType(h) }));
  }, [headers]);

  useEffect(() => {
    if (currentEvento) {
      const newFormData: Record<string, string> = {};
      headers?.forEach((h) => {
        const lower = h.toLowerCase();
        if (lower.includes("título")) newFormData[h] = currentEvento.titulo || "";
        else if (lower.includes("data de início")) {
          // Extract just the date part (YYYY-MM-DD) from the datetime string
          const dateOnly = currentEvento.data?.split("T")[0] || "";
          newFormData[h] = dateOnly;
        }
        else if (lower.includes("responsável")) newFormData[h] = currentEvento.responsavel || "";
        else if (lower.includes("status")) newFormData[h] = currentEvento.status || "";
        else if (lower.includes("link") || lower.includes("local")) newFormData[h] = currentEvento.local || "";
      });
      setFormData(newFormData);
      setDescricao(currentEvento.descricao || "");
      setModalidade(currentEvento.modalidade || "");
      setLocalEvento(currentEvento.local || "");
      setLinkEvento(currentEvento.link || "");
      const odsNumbers = currentEvento.odsAssociadas
        ? currentEvento.odsAssociadas.map((ods) =>
            typeof ods === "number" ? ods : ods.odsNumero
          )
        : [];
      setOdsAssociadas(odsNumbers);
    }
  }, [currentEvento, headers]);

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      let titulo = "";
      let data = "";
      let responsavel = "";
      let status = "Pendente";
      let imagem: string | null = null;

      headers?.forEach((h) => {
        const lower = h.toLowerCase();
        const value = formData[h] || "";
        if (lower.includes("título")) titulo = value;
        else if (lower.includes("data de início")) data = value;
        else if (lower.includes("responsável")) responsavel = value;
        else if (lower.includes("status")) status = value || "Pendente";
      });

      if (!titulo?.trim() || !data?.trim() || !responsavel?.trim() || !tipoEvento?.trim() || !modalidade?.trim()) {
        setSubmitError("Por favor, preencha os campos obrigatórios: Título, Data, Responsável, Tipo de Evento e Modalidade");
        return;
      }

      if (modalidade === "Presencial" && !localEvento?.trim()) {
        setSubmitError("Por favor, preencha o campo Local para eventos Presenciais");
        return;
      }

      if ((modalidade === "Online" || modalidade === "Híbrido") && !linkEvento?.trim()) {
        setSubmitError("Por favor, preencha o campo Link para eventos Online ou Híbridos");
        return;
      }

      if (modalidade === "Híbrido" && !localEvento?.trim()) {
        setSubmitError("Por favor, preencha o campo Local para eventos Híbridos");
        return;
      }

      // Convert image to base64 if selected
      if (imagePreview) {
        imagem = imagePreview;
      }

      // Create documento URL from first anexo if available
      let documento: string | null = null;
      if (anexosFiles.length > 0) {
        const firstFile = anexosFiles[0];
        documento = await fileToBase64(firstFile);
      }

      // Format date to preserve the intended date in the user's local timezone
      // This prevents the date from shifting by one day when stored and displayed
      let dateStr: string;
      if (data.includes("T")) {
        dateStr = data;
      } else {
        // Parse the date string (YYYY-MM-DD) as a local date at midnight
        const [year, month, day] = data.split("-").map(Number);
        const localDate = new Date(year, month - 1, day, 0, 0, 0, 0);
        // Convert to ISO string, which properly handles the local timezone offset
        dateStr = localDate.toISOString();
      }

      const eventoData = {
        titulo,
        data: dateStr,
        responsavel,
        status: status as any,
        local: modalidade === "Online" ? undefined : localEvento,
        link: modalidade === "Presencial" ? undefined : linkEvento,
        curso: "Análise e Desenvolvimento de Sistemas",
        tipoEvento,
        modalidade,
        descricao: descricao || undefined,
        odsAssociadas: odsAssociadas.length > 0 ? odsAssociadas : undefined,
        ...(imagePreview && { imagem: imagePreview }),
        ...(documento && { documento }),
        ...(anexosFiles.length > 0 && { anexos: anexosFiles.map((f) => f.name) }),
      };

      if (id) {
        updateEvento(parseInt(id), eventoData);
      } else {
        addEvento(eventoData);
      }

      navigate("/eventos");
    } catch (err) {
      setSubmitError("Erro ao salvar evento: " + String(err));
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-lg sm:text-xl font-semibold">{id ? "Editar Evento" : "Novo Evento"}</h2>

      {!headers && !error && (
        <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-muted-foreground">Carregando campos da planilha…</p>
      )}
      {error && (
        <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-destructive">Erro ao ler planilha: {error}</p>
      )}
      {submitError && (
        <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-destructive">{submitError}</p>
      )}

      {headers && (
        <form className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2" onSubmit={handleSubmit}>
          <div className="sm:col-span-2">
            <label className="text-xs sm:text-sm font-medium" htmlFor="tipo-de-evento">
              Tipo de Evento *
            </label>
            <select
              id="tipo-de-evento"
              value={tipoEvento}
              onChange={(e) => setTipoEvento(e.target.value)}
              required
              className="mt-1 w-full rounded-md border bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm"
            >
              <option value="">Selecione…</option>
              <option value="Projeto de Extensão">Projeto de Extensão</option>
              <option value="Pesquisa">Pesquisa</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs sm:text-sm font-medium" htmlFor="modalidade">
              Modalidade *
            </label>
            <select
              id="modalidade"
              value={modalidade}
              onChange={(e) => setModalidade(e.target.value)}
              required
              className="mt-1 w-full rounded-md border bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm"
            >
              <option value="">Selecione…</option>
              <option value="Presencial">Presencial</option>
              <option value="Online">Online</option>
              <option value="Híbrido">Híbrido</option>
            </select>
          </div>

          {(modalidade === "Presencial" || modalidade === "Híbrido") && (
            <div className="sm:col-span-2">
              <label className="text-xs sm:text-sm font-medium" htmlFor="local">
                Local {(modalidade === "Presencial" || modalidade === "Híbrido") && "*"}
              </label>
              <input
                id="local"
                type="text"
                value={localEvento}
                onChange={(e) => setLocalEvento(e.target.value)}
                placeholder="Ex: Auditório A, Prédio Principal"
                className="mt-1 w-full rounded-md border bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm"
                required={modalidade === "Presencial" || modalidade === "Híbrido"}
              />
            </div>
          )}

          {(modalidade === "Online" || modalidade === "Híbrido") && (
            <div className="sm:col-span-2">
              <label className="text-xs sm:text-sm font-medium" htmlFor="link">
                Local {(modalidade === "Online" || modalidade === "Híbrido") && "*"}
              </label>
              <input
                id="link"
                type="url"
                value={linkEvento}
                onChange={(e) => setLinkEvento(e.target.value)}
                placeholder="Ex: https://meet.google.com/... ou https://zoom.us/..."
                className="mt-1 w-full rounded-md border bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm"
                required={modalidade === "Online" || modalidade === "Híbrido"}
              />
            </div>
          )}

          <div className="sm:col-span-2">
            <label className="text-xs sm:text-sm font-medium" htmlFor="evento-imagem">
              Imagem do Evento
            </label>
            <input
              id="evento-imagem"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                if (e.target.files?.length) {
                  const file = e.target.files[0];
                  const base64 = await fileToBase64(file);
                  setImagePreview(base64);
                }
              }}
              className="mt-1 w-full rounded-md border bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm"
            />
            {imagePreview && (
              <div className="mt-2 sm:mt-3 rounded-lg overflow-hidden border">
                <img src={imagePreview} alt="Preview" className="w-full h-24 sm:h-40 object-cover" />
              </div>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs sm:text-sm font-medium" htmlFor="evento-descricao">
              Descrição do Evento
            </label>
            <textarea
              id="evento-descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o evento, objetivos e informações importantes"
              className="mt-1 w-full rounded-md border bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-24 resize-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs sm:text-sm font-medium">ODS Associados</label>
            <div className="mt-2 grid grid-cols-6 sm:grid-cols-9 gap-2">
              {odsData.map((ods) => (
                <button
                  key={ods.id}
                  type="button"
                  onClick={() => {
                    setOdsAssociadas((prev) =>
                      prev.includes(ods.numero)
                        ? prev.filter((o) => o !== ods.numero)
                        : [...prev, ods.numero]
                    );
                  }}
                  className={`w-full aspect-square rounded-full flex items-center justify-center text-white text-xs font-bold transition-all hover:scale-110 ${
                    odsAssociadas.includes(ods.numero)
                      ? "ring-2 ring-offset-2 ring-primary scale-110"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: ods.cor }}
                  title={ods.titulo}
                >
                  {ods.numero}
                </button>
              ))}
            </div>
            {odsAssociadas.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-xs text-muted-foreground">ODS selecionadas:</p>
                <div className="flex flex-wrap gap-2">
                  {odsAssociadas.map((odsNum) => {
                    const ods = odsData.find((o) => o.numero === odsNum);
                    return (
                      <span key={odsNum} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                        ODS {odsNum} - {ods?.titulo}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {fields.map(({ key, type }) => {
            const lowerKey = key.toLowerCase();
            const idAttr = lowerKey.replace(/\s+/g, "-");
            const value = formData[key] || "";
            const hasOptions = fieldOptions[lowerKey];
            const isImageField = lowerKey.includes("imagem") || lowerKey.includes("foto");
            const isAnexosField = lowerKey.includes("anexo");
            const isModalidadeField = lowerKey.includes("modalidade");
            const isLinkLocalField = lowerKey.includes("link") && lowerKey.includes("local");
            const isOdsField = lowerKey.includes("ods");

            if (isModalidadeField || isLinkLocalField || isOdsField) {
              return null;
            }

            if (type === "file" || isImageField || isAnexosField) {
              if (isImageField) {
                return (
                  <div key={key} className="sm:col-span-2">
                    <label className="text-xs sm:text-sm font-medium" htmlFor={idAttr}>
                      {key}
                    </label>
                    <input
                      id={idAttr}
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files?.length) {
                          const file = e.target.files[0];
                          const base64 = await fileToBase64(file);
                          setImagePreview(base64);
                          handleInputChange(key, file.name);
                        }
                      }}
                      className="mt-1 w-full rounded-md border bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm"
                    />
                    {imagePreview && (
                      <div className="mt-2 sm:mt-3 rounded-lg overflow-hidden border">
                        <img src={imagePreview} alt="Preview" className="w-full h-24 sm:h-40 object-cover" />
                      </div>
                    )}
                  </div>
                );
              }

              if (isAnexosField) {
                return (
                  <div key={key} className="sm:col-span-2">
                    <label className="text-xs sm:text-sm font-medium" htmlFor={idAttr}>
                      {key}
                    </label>
                    <input
                      id={idAttr}
                      type="file"
                      multiple
                      onChange={(e) => {
                        if (e.target.files?.length) {
                          const files = Array.from(e.target.files);
                          setAnexosFiles(files);
                          handleInputChange(key, files.map((f) => f.name).join(", "));
                        }
                      }}
                      className="mt-1 w-full rounded-md border bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm"
                    />
                    {anexosFiles.length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        {anexosFiles.length} arquivo(s) selecionado(s)
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div key={key} className="sm:col-span-2">
                  <label className="text-xs sm:text-sm font-medium" htmlFor={idAttr}>
                    {key}
                  </label>
                  <input
                    id={idAttr}
                    type="file"
                    multiple
                    onChange={(e) => {
                      if (e.target.files?.length) {
                        handleInputChange(key, Array.from(e.target.files).map((f) => f.name).join(", "));
                      }
                    }}
                    className="mt-1 w-full rounded-md border bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm"
                  />
                </div>
              );
            }

            if (type === "select-status" || type === "select-responsavel" || hasOptions) {
              let options: string[] = [];
              if (type === "select-status") {
                options = ["Confirmado", "Pendente", "Cancelado"];
              } else if (type === "select-responsavel") {
                options = professores.map((p) => p.nome);
              } else if (hasOptions) {
                options = fieldOptions[key.toLowerCase()] || [];
              }

              return (
                <div key={key}>
                  <label className="text-xs sm:text-sm font-medium" htmlFor={idAttr}>
                    {key}
                  </label>
                  <select
                    id={idAttr}
                    value={value}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="mt-1 w-full rounded-md border bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm"
                  >
                    <option value="">Selecione…</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            if (type === "date") {
              return (
                <div key={key}>
                  <label className="text-xs sm:text-sm font-medium" htmlFor={idAttr}>
                    {key}
                  </label>
                  <input
                    id={idAttr}
                    type="date"
                    value={value}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    required
                    className="mt-1 w-full rounded-md border bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm"
                  />
                </div>
              );
            }

            if (type === "time") {
              return (
                <div key={key}>
                  <label className="text-xs sm:text-sm font-medium" htmlFor={idAttr}>
                    {key}
                  </label>
                  <input
                    id={idAttr}
                    type="time"
                    value={value}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="mt-1 w-full rounded-md border bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm"
                  />
                </div>
              );
            }

            if (type === "number") {
              return (
                <div key={key}>
                  <label className="text-xs sm:text-sm font-medium" htmlFor={idAttr}>
                    {key}
                  </label>
                  <input
                    id={idAttr}
                    type="number"
                    value={value}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="mt-1 w-full rounded-md border bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm"
                  />
                </div>
              );
            }

            return (
              <div key={key} className="sm:col-span-2">
                <label className="text-xs sm:text-sm font-medium" htmlFor={idAttr}>
                  {key}
                </label>
                <input
                  id={idAttr}
                  type="text"
                  value={value}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="mt-1 w-full rounded-md border bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm"
                />
              </div>
            );
          })}

          <div className="sm:col-span-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-2">
            <button type="button" onClick={() => navigate("/eventos")} className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-md border text-xs sm:text-sm hover:bg-accent transition-colors">
              Cancelar
            </button>
            <button type="submit" className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs sm:text-sm hover:opacity-95 transition-opacity">
              Salvar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
