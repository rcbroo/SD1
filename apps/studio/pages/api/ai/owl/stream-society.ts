import { NextApiRequest, NextApiResponse } from 'next'
import apiWrapper from 'lib/api/apiWrapper'

export const config = {
  api: { bodyParser: true },
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'POST':
      return handlePost(req, res)
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).json({ data: null, error: { message: `Method ${method} Not Allowed` } })
  }
}

const wrapper = (req: NextApiRequest, res: NextApiResponse) =>
  apiWrapper(req, res, handler, { withAuth: true })

export default wrapper

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { task, modelConfig, agentConfig, projectRef, connectionString } = req.body

    if (!task) {
      return res.status(400).json({ error: 'Task is required' })
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    })

    const owlResponse = await fetch('http://localhost:8000/api/stream-society', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task,
        modelConfig,
        agentConfig,
        supabaseConfig: {
          projectRef,
          connectionString,
        },
      }),
    })

    if (!owlResponse.ok) {
      throw new Error(`OWL service error: ${owlResponse.statusText}`)
    }

    const reader = owlResponse.body?.getReader()
    if (!reader) {
      throw new Error('No response body reader available')
    }

    const decoder = new TextDecoder()
    
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        res.write(chunk)
      }
    } finally {
      reader.releaseLock()
      res.end()
    }
  } catch (error: any) {
    console.error('Error in OWL stream-society:', error)
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`)
    res.end()
  }
}
