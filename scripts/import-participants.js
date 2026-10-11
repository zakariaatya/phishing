/**
 * Importe data/participants-source.csv dans la base Turso et genere
 * data/liens-generes.csv avec les liens uniques.
 *
 * A executer depuis votre PC (pas depuis Vercel) :
 *   1. Creer un fichier .env a la racine avec :
 *        TURSO_DATABASE_URL=...
 *        TURSO_AUTH_TOKEN=...
 *        PUBLIC_URL=https://votre-projet.vercel.app   (ou votre domaine)
 *   2. npm install
 *   3. npm run import
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { db, ensureSchema } = require('../lib/db');

const SOURCE_FILE = path.join(__dirname, '..', 'data', 'participants-source.csv');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'liens-generes.csv');
const PUBLIC_URL = process.env.PUBLIC_URL || 'https://votre-projet.vercel.app';

function genToken() {
  return crypto.randomBytes(8).toString('hex');
}

function deriveNomFromEmail(email) {
  const local = email.split('@')[0] || '';
  const parts = local.split(/[.\-_]+/).filter(Boolean);
  return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ') || local;
}

function parseCsvLine(line) {
  return line.split(',').map(f => f.trim());
}

async function main() {
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.error('TURSO_DATABASE_URL et TURSO_AUTH_TOKEN doivent etre definis dans .env');
    process.exit(1);
  }

  if (!fs.existsSync(SOURCE_FILE)) {
    console.error(`Fichier introuvable : ${SOURCE_FILE}`);
    process.exit(1);
  }

  await ensureSchema();

  const lines = fs.readFileSync(SOURCE_FILE, 'utf8').split('\n').map(l => l.trim()).filter(Boolean);
  const header = parseCsvLine(lines[0]).map(h => h.toLowerCase());
  const idx = {
    employee_id: header.indexOf('employee_id'),
    nom: header.indexOf('nom'),
    email: header.indexOf('email'),
    campagne: header.indexOf('campagne'),
  };
  if (Object.values(idx).some(i => i === -1)) {
    console.error('En-tetes attendues : employee_id,nom,email,campagne');
    process.exit(1);
  }

  const results = [];

  for (const line of lines.slice(1)) {
    const fields = parseCsvLine(line);
    const employee_id = fields[idx.employee_id];
    const email = fields[idx.email];
    const campagne = fields[idx.campagne];
    let nom = fields[idx.nom];

    if (!email || !campagne) continue;
    if (!nom) {
      nom = deriveNomFromEmail(email);
      console.warn(`Nom manquant pour ${email} -> deduit : "${nom}"`);
    }

    const existing = await db.execute({
      sql: 'SELECT token FROM participants WHERE email = ? AND campagne = ?',
      args: [email, campagne],
    });

    let token;
    if (existing.rows[0]) {
      token = existing.rows[0].token;
    } else {
      token = genToken();
      await db.execute({
        sql: 'INSERT INTO participants (token, employee_id, nom, email, campagne) VALUES (?, ?, ?, ?, ?)',
        args: [token, employee_id, nom, email, campagne],
      });
    }

    results.push({ employee_id, nom, email, campagne, lien: `${PUBLIC_URL}/click?id=${token}` });
  }

  const csvOut = [
    'employee_id,nom,email,campagne,lien',
    ...results.map(r => `${r.employee_id},${r.nom},${r.email},${r.campagne},${r.lien}`)
  ].join('\n');

  fs.writeFileSync(OUTPUT_FILE, csvOut, 'utf8');
  console.log(`${results.length} participants traites.`);
  console.log(`Liens generes dans : ${OUTPUT_FILE}`);
}

main();
