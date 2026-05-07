const games = [
  { id: 'game-1', name: 'Game 1', url: '/game-1/' },
  { id: 'game-2', name: 'Game 2', url: '/game-2/' },
]

const app = document.getElementById('app')

if (!app) throw new Error('Missing #app element')

app.innerHTML = `
  <header style="background:#1a1a2e;padding:2rem;text-align:center">
    <h1 style="margin:0;font-size:2.5rem">🎮 Games Portal</h1>
    <p style="color:#aaa;margin:.5rem 0 0">Pick a game and start playing</p>
  </header>
  <main style="max-width:800px;margin:3rem auto;padding:0 1rem;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1.5rem">
    ${games
      .map(
        (g) => `
      <a href="${g.url}" style="display:block;background:#1a1a2e;border:1px solid #333;border-radius:12px;padding:2rem;text-align:center;text-decoration:none;color:#eee;transition:border-color .2s"
         onmouseover="this.style.borderColor='#a78bfa'" onmouseout="this.style.borderColor='#333'">
        <div style="font-size:3rem">🕹️</div>
        <h2 style="margin:.75rem 0 0;font-size:1.25rem">${g.name}</h2>
      </a>`
      )
      .join('')}
  </main>
`
