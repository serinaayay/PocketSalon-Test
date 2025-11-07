import * as FileSystem from 'expo-file-system';
import { listUnsyncedRecords, markRecordSynced, noteSyncFailure, AnalysisRecord } from './db';

const SYNC_URL = process.env.EXPO_PUBLIC_SYNC_URL || '';

export async function trySyncPendingAnalyses(): Promise<{ synced: number; failed: number; skipped: number; }> {
  if (!SYNC_URL) {
    const pending = await listUnsyncedRecords();
    return { synced: 0, failed: 0, skipped: pending.length };
  }
  const records = await listUnsyncedRecords();
  let synced = 0; let failed = 0;
  for (const r of records) {
    try {
      const form = new FormData();
      form.append('respondentCode', r.respondentCode);
      form.append('timestamp', r.timestamp);
      // @ts-ignore RN FormData file type
      form.append('image', { uri: r.imagePath, type: 'image/jpeg', name: `img_${r.respondentCode}_${r.timestamp}.jpg` });
      // @ts-ignore RN FormData file type
      form.append('result', { uri: r.resultPath, type: 'application/json', name: `result_${r.respondentCode}_${r.timestamp}.json` });

      const res = await fetch(`${SYNC_URL}/upload`, { method: 'POST', body: form as any });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await markRecordSynced(r.id!);
      synced += 1;
    } catch (e: any) {
      failed += 1;
      await noteSyncFailure(r.id!, String(e?.message ?? e));
    }
  }
  return { synced, failed, skipped: 0 };
}


