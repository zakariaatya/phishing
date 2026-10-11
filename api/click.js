const { db, ensureSchema } = require('../lib/db');

function renderWarningPage() {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Simulation de phishing</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; background:#f4f4f4; margin:0; padding:0; }
  .card { max-width:600px; margin:60px auto; background:#fff; border-radius:8px;
          box-shadow:0 2px 10px rgba(0,0,0,.1); padding:32px; }
  h1 { color:#c0392b; font-size:22px; }
  p { color:#333; line-height:1.6; }
  .ok { color:#27ae60; font-weight:bold; }
</style>
</head>
<body>
  <div class="card">
    <h1>&#9888;&#65039; Simulation de phishing</h1>
    <p>Ceci etait une simulation de phishing organisee dans le cadre de notre audit de securite.</p>
    <p class="ok">Aucun mot de passe n'a ete collecte.</p>
    <p>Verifiez toujours l'expediteur, le domaine et les liens avant de cliquer.</p>
  </div>
</body>
</html>`;
}

module.exports = async (req, res) => {
  await ensureSchema();

  const token = req.query.id;
  if (!token) {
    res.status(400).send('Lien invalide.');
    return;
  }

  const result = await db.execute({
    sql: 'SELECT * FROM participants WHERE token = ?',
    args: [token],
  });

  const participant = result.rows[0];
  if (!participant) {
    res.status(404).send('Lien invalide ou expire.');
    return;
  }

  if (!participant.clicked_at) {
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    await db.execute({
      sql: `UPDATE participants SET clicked_at = datetime('now'), ip_address = ? WHERE token = ?`,
      args: [ip, token],
    });
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(renderWarningPage());
};
