const app = document.getElementById('app')

if (!app) throw new Error('Missing #app element')

app.innerHTML = `
  <h1>Game 2</h1>
  <p>Welcome to Game 2!</p>
  <p><a href="/games/">← Back to portal</a></p>
`
