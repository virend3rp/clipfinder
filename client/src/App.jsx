// src/components/App.jsx
import React, { useState } from 'react'

const App = () => {
  const [url, setUrl] = useState('')
  const [keyword, setKeyword] = useState('')
  const [language, setLanguage] = useState('eng')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

 const handleSubmit = async (e) => {
  e.preventDefault()

  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)
  if (!match) {
    alert('Invalid YouTube URL')
    return
  }

  const videoId = match[1]
  setLoading(true)

  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId, keyword, language }),
    })
    const data = await res.json()
    setResults(data.matches || [])
  } catch (err) {
    console.error(err)
    alert('Error searching transcript')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">ClipFinder</h1>
        <h3 className="text-xl font-bold text-center mb-6">(Only English Supported RN)</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter YouTube video URL"
            className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:outline-none hover:bg-white hover:text-black hover:scale-105 transition duration-200"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Keyword to search in transcript"
            className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:outline-none hover:bg-white hover:text-black hover:scale-105 transition duration-200"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            required
          />

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:outline-none hover:bg-yellow-300 hover:text-black hover:scale-105 transition duration-200"
          >
            <option value="en">English</option>
          </select>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 transition rounded p-3 font-semibold"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Find Scene'}
          </button>
        </form>

        <div className="mt-8 space-y-3">
          {results.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold">🔍 Matches:</h2>
              {results.map((res, index) => (
                <a
                  key={index}
                  href={`https://www.youtube.com/watch?v=${res.videoId}&t=${res.time}s`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded bg-gray-800 hover:bg-gray-700 transition"
                >
                  <strong>{res.text}</strong>
                  <span className="block text-sm opacity-70">Timestamp: {res.time}s</span>
                </a>
              ))}
            </>
          ) : loading ? null : (
            <p className="text-gray-400">No results found yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
