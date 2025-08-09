import React from 'react';

export default function DevPortfolio() {
  const projects = [
    {
      title: 'Unity Кот-симулятор',
      desc: 'Погладь кота, пока он не убежит в реальный мир. Встроенный генератор мемов и случайных мурлыканий.',
      img: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
      link: 'https://unity.com/cat-simulator'
    },
    {
      title: 'Гравитация для чайников',
      desc: 'Платформер, где гравитация меняется по настроению игрока. Иногда вверх — это вниз, а иногда вообще вбок.',
      img: 'https://media.giphy.com/media/3o6ZtpxSZbQRRnwCKQ/giphy.gif',
      link: 'https://unity.com/gravity-fun'
    },
    {
      title: 'Битва багов',
      desc: 'Мультиплеерная арена, где игроки сражаются за звание самого креативного баг-репортера. Побеждает тот, кто вылетит последним.',
      img: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
      link: 'https://unity.com/bug-battle'
    },
    {
      title: 'Симулятор кофе-брейка',
      desc: 'Только ты, Unity и бесконечная чашка кофе. Главная цель — не пролить на клавиатуру!',
      img: 'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif',
      link: 'https://unity.com/coffee-break'
    },
    {
      title: 'Пингвин против Unity Editor',
      desc: 'Пингвин пытается собрать билд, но Editor сопротивляется. Кто победит — холод или баги?',
      img: 'https://media.giphy.com/media/2wYQbQpU5hI4A/giphy.gif',
      link: 'https://unity.com/penguin-vs-editor'
    }
  ];

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32 }}>
      <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24, color: '#ff9800' }}>Unity Developer Portfolio</h1>
      <p style={{ fontSize: 18, marginBottom: 16 }}>
        Здесь — демо-проекты Unity с юмором:
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {projects.map((p, i) => (
          <div key={i} style={{ background: '#fffbe6', borderRadius: 12, boxShadow: '0 1px 8px rgba(0,0,0,0.04)', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={p.img} alt={p.title} style={{ width: '100%', maxWidth: 220, borderRadius: 8, marginBottom: 12 }} />
            <h2 style={{ fontSize: 20, fontWeight: 'bold', color: '#ff9800', marginBottom: 8 }}>{p.title}</h2>
            <p style={{ fontSize: 15, color: '#333', marginBottom: 8 }}>{p.desc}</p>
            <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: '#ff9800', textDecoration: 'underline', fontWeight: 'bold', fontSize: 15 }}>Подробнее</a>
          </div>
        ))}
      </div>
    </div>
  );
}
