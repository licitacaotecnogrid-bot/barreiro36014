import * as XLSX from "xlsx";

export async function fetchExcelHeaders(url: string): Promise<string[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao baixar planilha: ${res.status}`);
  const ab = await res.arrayBuffer();
  const wb = XLSX.read(ab, { type: "array" });
  const first = wb.SheetNames[0];
  const ws = wb.Sheets[first];
  const json = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { header: 1 });
  const headers = (json[0] as string[]) || [];
  return headers.map((h) => String(h).trim());
}

export function guessFieldType(header: string): "date" | "time" | "select-status" | "select-responsavel" | "number" | "text" | "file" {
  const h = header.toLowerCase();
  if (/(anexo|anexos|arquivo)/.test(h)) return "file";
  if (/(email|e-mail|telefone|celular|whatsapp)/.test(h)) return "text";
  if (/(data)/.test(h) && !/(atualiza|cria)/.test(h)) return "date";
  if (/(hora|horário|horario)/.test(h)) return "time";
  if (/(status|situação|situacao)/.test(h)) return "select-status";
  if (/(responsável|responsavel|professor)/.test(h)) return "select-responsavel";
  if (/(qtd|quantidade|num|n°|nº)/.test(h)) return "number";
  return "text";
}
