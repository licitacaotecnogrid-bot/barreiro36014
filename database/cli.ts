#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';

// Função para ler os dados do arquivo JSON local
function loadData(type: string) {
  const filePath = path.join(__dirname, `./data/${type}.json`);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  return [];
}

// Função para salvar dados no arquivo JSON
function saveData(type: string, data: any) {
  const dirPath = path.join(__dirname, './data');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const filePath = path.join(dirPath, `${type}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ ${type} salvo em ${filePath}`);
}

const command = process.argv[2];
const subcommand = process.argv[3];

console.log('📦 CLI de Banco de Dados Offline\n');

switch (command) {
  case 'list': {
    const type = subcommand || 'professores';
    const data = loadData(type);
    console.log(`\n📋 ${type}:`);
    console.table(data);
    break;
  }

  case 'add': {
    const type = subcommand;
    if (!type) {
      console.log('❌ Uso: npm run db:add <tipo> <dados-json>');
      console.log('   Ex: npm run db:add professores \'{"nome":"Prof. João", "email":"joao@puc.br", "senha":"123", "curso":"ADS"}\' ');
      break;
    }
    const jsonData = process.argv[4];
    if (!jsonData) {
      console.log('❌ Dados JSON não fornecidos');
      break;
    }
    try {
      const newItem = JSON.parse(jsonData);
      const data = loadData(type);
      newItem.id = Math.max(...data.map((d: any) => d.id || 0), 0) + 1;
      data.push(newItem);
      saveData(type, data);
      console.log(`✅ Item adicionado:`, newItem);
    } catch (error) {
      console.log('❌ JSON inválido');
    }
    break;
  }

  case 'delete': {
    const type = subcommand;
    const id = parseInt(process.argv[4]);
    if (!type || !id) {
      console.log('❌ Uso: npm run db:delete <tipo> <id>');
      break;
    }
    const data = loadData(type);
    const filtered = data.filter((d: any) => d.id !== id);
    if (filtered.length === data.length) {
      console.log(`❌ Item com id ${id} não encontrado`);
      break;
    }
    saveData(type, filtered);
    console.log(`✅ Item ${id} deletado`);
    break;
  }

  case 'update': {
    const type = subcommand;
    const id = parseInt(process.argv[4]);
    const jsonData = process.argv[5];
    if (!type || !id || !jsonData) {
      console.log('❌ Uso: npm run db:update <tipo> <id> <dados-json>');
      break;
    }
    try {
      const updates = JSON.parse(jsonData);
      const data = loadData(type);
      const index = data.findIndex((d: any) => d.id === id);
      if (index === -1) {
        console.log(`❌ Item com id ${id} não encontrado`);
        break;
      }
      data[index] = { ...data[index], ...updates, id };
      saveData(type, data);
      console.log(`✅ Item ${id} atualizado:`, data[index]);
    } catch (error) {
      console.log('❌ JSON inválido');
    }
    break;
  }

  case 'clear': {
    const type = subcommand;
    if (!type) {
      console.log('❌ Uso: npm run db:clear <tipo>');
      break;
    }
    saveData(type, []);
    console.log(`✅ Todos os ${type} foram deletados`);
    break;
  }

  case 'export': {
    const type = subcommand || 'all';
    if (type === 'all') {
      const exportDir = path.join(__dirname, './export');
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }
      const types = ['professores', 'projetosPesquisa', 'projetosExtensao', 'materias'];
      const exported: any = {};
      types.forEach((t) => {
        exported[t] = loadData(t);
      });
      const filePath = path.join(exportDir, `export-${new Date().toISOString()}.json`);
      fs.writeFileSync(filePath, JSON.stringify(exported, null, 2));
      console.log(`✅ Banco exportado para ${filePath}`);
    } else {
      const data = loadData(type);
      const filePath = path.join(__dirname, `./export/${type}-export.json`);
      const exportDir = path.dirname(filePath);
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ ${type} exportado para ${filePath}`);
    }
    break;
  }

  default:
    console.log('Comandos disponíveis:');
    console.log('  list [tipo]              - Listar todos os itens');
    console.log('  add <tipo> <dados-json>  - Adicionar novo item');
    console.log('  delete <tipo> <id>       - Deletar item');
    console.log('  update <tipo> <id> <json>- Atualizar item');
    console.log('  clear <tipo>             - Limpar todos');
    console.log('  export [tipo]            - Exportar dados para JSON');
    console.log('\nExemplos:');
    console.log('  npm run db:list professores');
    console.log('  npm run db:add professores \'{"nome":"Prof. João", "email":"joao@puc.br", "senha":"123", "curso":"ADS"}\'');
    console.log('  npm run db:delete professores 1');
}
