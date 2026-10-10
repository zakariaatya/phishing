const { db, ensureSchema } = require('../lib/db');
const { checkAuth } = require('../lib/auth');

module.exports = async (req, res) => {
  if (!checkAuth(req, res)) return;
  await ensureSchema();

  const totalResult = await db.execute('SELECT COUNT(*) AS n FROM participants');
  const total = totalResult.rows[0].n;

  const clickedResult = await db.execute(
    'SELECT COUNT(*) AS n FROM participants WHERE clicked_at IS NOT NULL'
  );
  const clicked = clickedResult.rows[0].n;

  const campResult = await db.execute(`
    SELECT campagne,
           COUNT(*) AS total,
           SUM(CASE WHEN clicked_at IS NOT NULL THEN 1 ELSE 0 END) AS clicked
    FROM participants
    GROUP BY campagne
  `);

  const detailResult = await db.execute(`
    SELECT nom, email, campagne, clicked_at
    FROM participants
    ORDER BY campagne, nom
  `);

  res.status(200).json({
    total,
    clicked,
    notClicked: total - clicked,
    tauxClic: total > 0 ? Math.round((clicked / total) * 1000) / 10 : 0,
    parCampagne: campResult.rows.map(c => ({
      campagne: c.campagne,
      total: c.total,
      clicked: c.clicked,
      notClicked: c.total - c.clicked,
      taux: c.total > 0 ? Math.round((c.clicked / c.total) * 1000) / 10 : 0,
    })),
    detail: detailResult.rows.map(d => ({
      nom: d.nom,
      email: d.email,
      campagne: d.campagne,
      clicked: !!d.clicked_at,
      clickedAt: d.clicked_at,
    })),
  });
};
