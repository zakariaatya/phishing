// Verifie l'en-tete Authorization (Basic Auth) sur les routes protegees
// (stats, export, suppression). Retourne true si OK, sinon envoie un 401
// et retourne false (l'appelant doit alors arreter son traitement).
function checkAuth(req, res) {
  const expectedUser = process.env.DASHBOARD_USER || 'admin';
  const expectedPass = process.env.DASHBOARD_PASSWORD || '';

  const header = req.headers.authorization || '';
  const [scheme, encoded] = header.split(' ');

  if (scheme === 'Basic' && encoded) {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const sep = decoded.indexOf(':');
    const user = decoded.slice(0, sep);
    const pass = decoded.slice(sep + 1);
    if (user === expectedUser && pass === expectedPass) {
      return true;
    }
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="phishing-sim-dashboard"');
  res.status(401).send('Authentification requise.');
  return false;
}

module.exports = { checkAuth };
