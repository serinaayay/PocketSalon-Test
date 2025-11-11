import * as SQLite from 'expo-sqlite';

let database: SQLite.SQLiteDatabase | null = null;

export async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (database) return database;
  database = await SQLite.openDatabaseAsync('pocketsalon.db');
  await database.execAsync(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS hair_analyses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hair_health_score INTEGER NOT NULL,
      analysis_date TEXT NOT NULL,
      user_id TEXT,
      image_link TEXT,
      result_link TEXT,
      local_image_path TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_hair_analyses_date ON hair_analyses (analysis_date DESC);

    CREATE TABLE IF NOT EXISTS analysis_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      respondent_code TEXT NOT NULL,
      image_path TEXT NOT NULL,
      result_path TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      model_loading_time_ms INTEGER,
      inference_time_ms INTEGER,
      predictions_json TEXT,
      recommendations TEXT,
      device_info_json TEXT,
      synced INTEGER NOT NULL DEFAULT 0,
      sync_attempts INTEGER NOT NULL DEFAULT 0,
      last_error TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_analysis_records_synced ON analysis_records (synced, timestamp DESC);
  `);
  // Attempt to add columns if the table already existed without them
  try { await database.runAsync(`ALTER TABLE hair_analyses ADD COLUMN user_id TEXT;`); } catch {}
  try { await database.runAsync(`ALTER TABLE hair_analyses ADD COLUMN image_link TEXT;`); } catch {}
  try { await database.runAsync(`ALTER TABLE hair_analyses ADD COLUMN result_link TEXT;`); } catch {}
  try { await database.runAsync(`ALTER TABLE hair_analyses ADD COLUMN local_image_path TEXT;`); } catch {}
  try { await database.runAsync(`ALTER TABLE hair_analyses ADD COLUMN recommendations TEXT;`); } catch {}
  try { await database.runAsync(`ALTER TABLE hair_analyses ADD COLUMN hair_type TEXT;`); } catch {}
  try { await database.runAsync(`ALTER TABLE hair_analyses ADD COLUMN scalp_condition TEXT;`); } catch {}
  try { await database.runAsync(`ALTER TABLE hair_analyses ADD COLUMN damage_level TEXT;`); } catch {}
  try { await database.runAsync(`ALTER TABLE hair_analyses ADD COLUMN damage_type TEXT;`); } catch {}
  return database;
}

export type HairAnalysis = {
  id?: number;
  hairHealthScore: number; // 0-100
  analysisDate: string; // ISO string
  userId?: string | null;
  imageLink?: string | null;
  resultLink?: string | null;
  localImagePath?: string | null;
  recommendations?: string | null;
  hairType?: string | null;
  scalpCondition?: string | null;
  damageLevel?: string | null;
  damageType?: string | null;
};

export async function saveHairAnalysis(score: number, date: string): Promise<number> {
  const db = await openDatabase();
  // Clamp score to 0..100 to keep data clean
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const res = await db.runAsync(
    `INSERT INTO hair_analyses (hair_health_score, analysis_date) VALUES (?, ?);`,
    clamped,
    date
  );
  return res.lastInsertRowId ?? 0;
}

export async function getHairAnalysisHistory(): Promise<HairAnalysis[]> {
  const db = await openDatabase();
  const rows = await db.getAllAsync<any>(
    `SELECT id, hair_health_score as hairHealthScore, analysis_date as analysisDate,
            user_id as userId, image_link as imageLink, result_link as resultLink, local_image_path as localImagePath,
            recommendations, hair_type as hairType, scalp_condition as scalpCondition, damage_level as damageLevel, damage_type as damageType
     FROM hair_analyses
     ORDER BY datetime(analysis_date) DESC;`
  );
  return rows as HairAnalysis[];
}

export async function saveAnalysisToLocalDB(entry: {
  userId?: string;
  hairHealthScore: number;
  analysisDate: string;
  imageLink?: string;
  resultLink?: string;
  localImagePath?: string;
  recommendations?: string;
  hairType?: string;
  scalpCondition?: string;
  damageLevel?: string;
  damageType?: string;
}): Promise<number> {
  const db = await openDatabase();
  const clamped = Math.max(0, Math.min(100, Math.round(entry.hairHealthScore)));
  const res = await db.runAsync(
    `INSERT INTO hair_analyses (hair_health_score, analysis_date, user_id, image_link, result_link, local_image_path, recommendations, hair_type, scalp_condition, damage_level, damage_type)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    clamped,
    entry.analysisDate,
    entry.userId ?? null,
    entry.imageLink ?? null,
    entry.resultLink ?? null,
    entry.localImagePath ?? null,
    entry.recommendations ?? null,
    entry.hairType ?? null,
    entry.scalpCondition ?? null,
    entry.damageLevel ?? null,
    entry.damageType ?? null
  );
  return res.lastInsertRowId ?? 0;
}

// Offline-first records for sync
export type AnalysisRecord = {
  id?: number;
  respondentCode: string;
  imagePath: string;
  resultPath: string;
  timestamp: string;
  modelLoadingTimeMs?: number | null;
  inferenceTimeMs?: number | null;
  predictionsJson?: string | null;
  recommendations?: string | null;
  deviceInfoJson?: string | null;
  synced?: boolean;
  syncAttempts?: number;
  lastError?: string | null;
};

export async function saveAnalysisRecord(record: AnalysisRecord): Promise<number> {
  const db = await openDatabase();
  const res = await db.runAsync(
    `INSERT INTO analysis_records (
      respondent_code, image_path, result_path, timestamp,
      model_loading_time_ms, inference_time_ms, predictions_json, recommendations, device_info_json,
      synced, sync_attempts, last_error
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    record.respondentCode,
    record.imagePath,
    record.resultPath,
    record.timestamp,
    record.modelLoadingTimeMs ?? null,
    record.inferenceTimeMs ?? null,
    record.predictionsJson ?? null,
    record.recommendations ?? null,
    record.deviceInfoJson ?? null,
    record.synced ? 1 : 0,
    record.syncAttempts ?? 0,
    record.lastError ?? null
  );
  return res.lastInsertRowId ?? 0;
}

export async function listUnsyncedRecords(): Promise<AnalysisRecord[]> {
  const db = await openDatabase();
  const rows = await db.getAllAsync<any>(
    `SELECT id, respondent_code as respondentCode, image_path as imagePath, result_path as resultPath, timestamp,
            model_loading_time_ms as modelLoadingTimeMs, inference_time_ms as inferenceTimeMs,
            predictions_json as predictionsJson, recommendations, device_info_json as deviceInfoJson,
            synced, sync_attempts as syncAttempts, last_error as lastError
     FROM analysis_records WHERE synced = 0 ORDER BY datetime(timestamp) ASC;`
  );
  return rows as AnalysisRecord[];
}

export async function markRecordSynced(id: number): Promise<void> {
  const db = await openDatabase();
  await db.runAsync(`UPDATE analysis_records SET synced = 1, last_error = NULL WHERE id = ?;`, id);
}

export async function noteSyncFailure(id: number, errorMessage: string): Promise<void> {
  const db = await openDatabase();
  await db.runAsync(
    `UPDATE analysis_records SET sync_attempts = sync_attempts + 1, last_error = ? WHERE id = ?;`,
    errorMessage,
    id
  );
}

// Clear all data from database (for fresh APK builds)
export async function clearAllData(): Promise<void> {
  const db = await openDatabase();
  await db.execAsync(`
    DELETE FROM hair_analyses;
    DELETE FROM analysis_records;
    VACUUM;
  `);
}
