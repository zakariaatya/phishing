<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tableau de bord - Simulation phishing</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; background:#f4f4f4; margin:0; padding:24px; }
  h1 { color:#222; }
  .grid { display:flex; gap:16px; flex-wrap:wrap; margin:20px 0; }
  .stat { background:#fff; border-radius:8px; padding:20px; flex:1; min-width:160px;
          box-shadow:0 2px 6px rgba(0,0,0,.08); text-align:center; }
  .stat .value { font-size:28px; font-weight:bold; color:#2c3e50; }
  .stat .label { color:#777; font-size:13px; margin-top:4px; }
  table { width:100%; background:#fff; border-collapse:collapse; margin-top:20px;
          box-shadow:0 2px 6px rgba(0,0,0,.08); }
  th, td { padding:10px 14px; text-align:left; border-bottom:1px solid #eee; }
  th { background:#2c3e50; color:#fff; }
  .btn { display:inline-block; margin-top:20px; padding:10px 18px; background:#2c80b4;
         color:#fff; text-decoration:none; border-radius:6px; border:none; cursor:pointer; font-size:14px; }
  .btn.danger { background:#c0392b; margin-left:10px; }
  #loginForm { max-width:320px; margin:80px auto; background:#fff; padding:24px; border-radius:8px;
               box-shadow:0 2px 6px rgba(0,0,0,.08); }
  #loginForm input { width:100%; padding:8px; margin-bottom:10px; box-sizing:border-box; }
</style>
</head>
<body>

  <div id="loginForm">
    <h1 style="font-size:18px;">Connexion</h1>
    <input id="user" placeholder="Utilisateur" value="admin">
    <input id="pass" type="password" placeholder="Mot de passe">
    <button class="btn" onclick="login()">Se connecter</button>
  </div>

  <div id="app" style="display:none;">
    <h1>Resultats de la simulation de phishing</h1>
    <div class="grid" id="stats"></div>
    <table>
      <thead><tr><th>Campagne</th><th>Ciblés</th><th>Cliqué</th><th>Non cliqué</th><th>Taux de clic</th></tr></thead>
      <tbody id="parCampagne"></tbody>
    </table>

    <h2 style="margin-top:30px;">Détail par personne</h2>
    <table>
      <thead><tr><th>Nom</th><th>Email</th><th>Campagne</th><th>Statut</th><th>Date/heure du clic</th></tr></thead>
      <tbody id="detail"></tbody>
    </table>

    <button class="btn" onclick="exporter()">Exporter le CSV pour l'audit</button>
    <button class="btn danger" onclick="supprimer()">Supprimer toutes les données</button>
  </div>

  <script>
    let authHeader = '';

    function login() {
      const user = document.getElementById('user').value;
      const pass = document.getElementById('pass').value;
      authHeader = 'Basic ' + btoa(user + ':' + pass);
      charger();
    }

    async function charger() {
      const res = await fetch('/api/stats', { headers: { Authorization: authHeader } });
      if (res.status === 401) {
        alert('Identifiants incorrects.');
        return;
      }
      const data = await res.json();

      document.getElementById('loginForm').style.display = 'none';
      document.getElementById('app').style.display = 'block';

      document.getElementById('stats').innerHTML = `
        <div class="stat"><div class="value">${data.total}</div><div class="label">Ciblés</div></div>
        <div class="stat"><div class="value">${data.clicked}</div><div class="label">Ont cliqué</div></div>
        <div class="stat"><div class="value">${data.notClicked}</div><div class="label">N'ont pas cliqué</div></div>
        <div class="stat"><div class="value">${data.tauxClic}%</div><div class="label">Taux de clic</div></div>
      `;

      document.getElementById('parCampagne').innerHTML = data.parCampagne.map(c => `
        <tr><td>${c.campagne}</td><td>${c.total}</td><td>${c.clicked}</td><td>${c.notClicked}</td><td>${c.taux}%</td></tr>
      `).join('');

      document.getElementById('detail').innerHTML = data.detail.map(d => `
        <tr>
          <td>${d.nom || '—'}</td><td>${d.email}</td><td>${d.campagne}</td>
          <td>${d.clicked ? '<span style="color:#c0392b;font-weight:bold;">Cliqué</span>' : '<span style="color:#27ae60;">Non cliqué</span>'}</td>
          <td>${d.clickedAt || '—'}</td>
        </tr>
      `).join('');
    }

    async function exporter() {
      const res = await fetch('/api/export', { headers: { Authorization: authHeader } });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resultats-audit-phishing.csv';
      a.click();
    }

    async function supprimer() {
      if (!confirm('Supprimer définitivement toutes les données de campagne ?')) return;
      await fetch('/api/participants', { method: 'DELETE', headers: { Authorization: authHeader } });
      charger();
    }
  </script>
</body>
</html>
