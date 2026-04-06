async function getData() {
  const res = await fetch('http://localhost:3001/hello', {
    cache: 'no-store'
  })
  return res.json()
}

export default async function Home() {
  const data = await getData()

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Web App</h1>
      <p>{data.message}</p>
    </main>
  )
}