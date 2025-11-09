'use client'

import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [authStatus, setAuthStatus] = useState<any>({})
  const [envCheck, setEnvCheck] = useState<any>({})
  const [dbStatus, setDbStatus] = useState<any>({})
  const [scrapingStatus, setScrapingStatus] = useState<any>({})
  const [brightDataStatus, setBrightDataStatus] = useState<any>({})

  useEffect(() => {
    checkAuth()
    checkDatabase()
    checkScraping()
    checkBrightData()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      setAuthStatus({
        status: res.status,
        ok: res.ok,
        data: data,
        cookies: document.cookie
      })
    } catch (error: any) {
      setAuthStatus({
        error: error.message,
        cookies: document.cookie
      })
    }
  }

  const checkDatabase = async () => {
    try {
      const res = await fetch('/api/debug-db')
      const data = await res.json()
      setDbStatus(data)
    } catch (error: any) {
      setDbStatus({ error: error.message })
    }
  }

  const checkScraping = async () => {
    try {
      const res = await fetch('/api/test-scraping?q=brush')
      const data = await res.json()
      setScrapingStatus(data)
    } catch (error: any) {
      setScrapingStatus({ error: error.message })
    }
  }

  const checkBrightData = async () => {
    try {
      const res = await fetch('/api/test-brightdata')
      const data = await res.json()
      setBrightDataStatus(data)
      
      // Also get the credential check
      const checkRes = await fetch('/api/check-brightdata')
      const checkData = await checkRes.json()
      setBrightDataStatus(prev => ({ ...prev, credentialCheck: checkData }))
    } catch (error: any) {
      setBrightDataStatus({ error: error.message })
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🔧 Debug Information</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded border">
          <h2 className="text-xl font-bold mb-4">🔐 Authentication Status</h2>
          <pre className="text-sm overflow-auto bg-white p-2 rounded">
            {JSON.stringify(authStatus, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded border">
          <h2 className="text-xl font-bold mb-4">🗄️ Database Status</h2>
          <pre className="text-sm overflow-auto bg-white p-2 rounded">
            {JSON.stringify(dbStatus, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded border">
          <h2 className="text-xl font-bold mb-4">🕷️ Scraping Status</h2>
          <pre className="text-sm overflow-auto bg-white p-2 rounded">
            {JSON.stringify(scrapingStatus, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded border">
          <h2 className="text-xl font-bold mb-4">🌐 BrightData Proxy Status</h2>
          <pre className="text-sm overflow-auto bg-white p-2 rounded">
            {JSON.stringify(brightDataStatus, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded border">
          <h2 className="text-xl font-bold mb-4">🌐 Client Environment</h2>
          <pre className="text-sm overflow-auto bg-white p-2 rounded">
            {JSON.stringify({
              userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A',
              location: typeof window !== 'undefined' ? window.location.href : 'N/A',
              cookies: typeof document !== 'undefined' ? document.cookie : 'N/A'
            }, null, 2)}
          </pre>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          🔄 Refresh Data
        </button>
      </div>
    </div>
  )
}