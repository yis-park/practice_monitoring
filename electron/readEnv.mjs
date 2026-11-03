import fs from 'fs';
import path from 'path';
import { DOMParser } from 'xmldom';
import { fileURLToPath } from 'url';
import { parseStringPromise } from 'xml2js';

export async function readEnvXML(isPackaged, __dirname) {
  const envPath = isPackaged ? path.join(process.resourcesPath, 'env.xml') : path.join(__dirname, '../env.xml');

  console.log('[readEnv] envPath:', envPath, 'isPackaged', process.env.NODE_ENV);

  try {
    const xml = fs.readFileSync(envPath, 'utf-8');
    const result = await parseStringPromise(xml);
    console.log('[1] env result', JSON.stringify(result, null, 2));

    const env = result?.env || {};

    const backendUrl = env.backend_url?.[0] || '';
    const frontendUrl = env.frontend_url?.[0] || '';

    return { backendUrl, frontendUrl };
  } catch (err) {
    console.error('[Electron] env.xml 읽기 실패:', envPath, err);
    return {};
  }
}
