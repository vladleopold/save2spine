const { projects } = require('./data');

module.exports = function handler(req, res) {
  if (req.method === 'GET') {
    const cleanProjects = projects
      .map(p => ({
        ...p,
        images: Array.isArray(p.images)
          ? p.images.filter(src => typeof src === 'string' && src.trim() !== '')
          : []
      }))
      .filter(p => p.images.length > 0);
    res.status(200).json(cleanProjects);
  } else if (req.method === 'POST') {
    const { id, title, description, images, isFullWidth } = req.body;
    if (typeof id !== 'number' || !Array.isArray(images)) {
      return res.status(400).json({ error: 'Некорректные данные' });
    }
    projects.push({ id, title, description, images, isFullWidth });
    res.status(201).json({ success: true, project: { id, title, description, images, isFullWidth } });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
