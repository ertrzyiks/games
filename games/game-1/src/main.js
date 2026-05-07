const app = document.getElementById('app')

if (!app) throw new Error('Missing #app element')

app.innerHTML = `
  <h1>Game 1</h1>
  <p>Welcome to Game 1!</p>
  <p><a href="/">← Back to portal</a></p>
`
