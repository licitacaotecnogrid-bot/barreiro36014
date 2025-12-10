import { D1Database } from '@cloudflare/workers-types';

export interface D1Context {
  bindings: {
    DB: D1Database;
  };
}

export class D1Query {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  async run(sql: string, params: any[] = []) {
    return this.db.prepare(sql).bind(...params).run();
  }

  async all(sql: string, params: any[] = []) {
    const result = await this.db.prepare(sql).bind(...params).all();
    return result.results || [];
  }

  async one(sql: string, params: any[] = []) {
    const result = await this.db.prepare(sql).bind(...params).first();
    return result || null;
  }

  async execute(sql: string, params: any[] = []) {
    return this.db.prepare(sql).bind(...params).run();
  }
}

export function createD1Query(db: D1Database): D1Query {
  return new D1Query(db);
}
