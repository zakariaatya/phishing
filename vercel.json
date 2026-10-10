const { db, ensureSchema } = require('../lib/db');
const { checkAuth } = require('../lib/auth');

module.exports = async (req, res) => {
  if (!checkAuth(req, res)) return;
  await ensureSchema();

  const result = await db.execute(`
    SELECT employee_id, nom, email, campagne, clicked_at, ip_address
    FROM participants
    ORDER BY campagne, nom
  `);

  const header = 'ID,Nom,Email,Campagne,Date_heure_du_clic,Statut,Adresse_IP';
  const lines = result.rows.map(r => {
    const statut = r.clicked_at ? 'Clique' : 'Non clique';
    const dateClic = r.clicked_at || '';
    return [r.employee_id, r.nom, r.email, r.campagne, dateClic, statut, r.ip_address || '']
      .map(v => `"${(v ?? '').toString().replace(/"/g, '""')}"`)
      .join(',');
  });

  const csv = [header, ...lines].join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="resultats-audit-phishing.csv"');
  res.status(200).send('\uFEFF' + csv);
};
