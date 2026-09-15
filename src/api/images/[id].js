const { projects } = require('./data');

module.exports = function handler(req, res) {
  if (req.method === 'GET') {
    const id = Number(req.query.id);
    const project = projects.find(p => p.id === id);
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(project);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
