import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';

export const MAX_CANDIDATE_CV_BYTES = 10 * 1024 * 1024;

export function createCandidateId() {
  return `cand-${randomUUID()}`;
}

const formats = {
  '.pdf': { contentType: 'application/pdf', signature: Buffer.from('%PDF-') },
  '.doc': { contentType: 'application/msword', signature: Buffer.from('D0CF11E0A1B11AE1', 'hex') },
  '.docx': { contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', signature: Buffer.from('504B0304', 'hex') },
} as const;

export class CandidateCvValidationError extends Error {}

function isValidCandidateId(candidateId: string) {
  return /^cand-[0-9a-f-]+$/i.test(candidateId);
}

function safeFileName(fileName: string) {
  return basename(fileName).replace(/[^a-zA-Z0-9._ -]/g, '_').slice(0, 120);
}

export async function saveCandidateCv(candidateId: string, file: File) {
  if (!isValidCandidateId(candidateId)) throw new Error('Invalid candidate ID.');

  const fileName = safeFileName(file.name);
  const extension = extname(fileName).toLowerCase() as keyof typeof formats;
  const format = formats[extension];
  if (!format) throw new CandidateCvValidationError('Unsupported CV file type.');
  if (file.size === 0 || file.size > MAX_CANDIDATE_CV_BYTES) {
    throw new CandidateCvValidationError('CV must be between 1 byte and 10 MB.');
  }

  const contents = Buffer.from(await file.arrayBuffer());
  if (!contents.subarray(0, format.signature.length).equals(format.signature)) {
    throw new CandidateCvValidationError('The uploaded CV does not match its file type.');
  }

  const directory = join(process.cwd(), 'data', 'candidate-cvs');
  await mkdir(directory, { recursive: true, mode: 0o700 });
  await writeFile(join(directory, `${candidateId}${extension}`), contents, { flag: 'wx', mode: 0o600 });

  return { fileName, contentType: format.contentType };
}

export async function readCandidateCv(candidateId: string, fileName: string) {
  if (!isValidCandidateId(candidateId)) return null;

  const safeName = safeFileName(fileName);
  const extension = extname(safeName).toLowerCase() as keyof typeof formats;
  const format = formats[extension];
  if (!format) return null;

  try {
    const contents = await readFile(join(process.cwd(), 'data', 'candidate-cvs', `${candidateId}${extension}`));
    return { contents, fileName: safeName, contentType: format.contentType };
  } catch {
    return null;
  }
}