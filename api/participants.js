const { db, ensureSchema } = require('../lib/db');
const { checkAuth } = require('../lib/auth');

module.exports = async (req, res) => {
  if (!checkAuth(req, res)) return;
  await ensureSchema();

  if (req.method !== 'DELETE') {
    res.status(405).send('Methode non autorisee.');
    return;
  }

  await db.execute('DELETE FROM participants');
  res.status(200).json({ ok: true, message: 'Toutes les donnees ont ete supprimees.' });
};
