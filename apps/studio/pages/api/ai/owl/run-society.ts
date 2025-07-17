import { NextApiRequest, NextApiResponse } from 'next'
import apiWrapper from 'lib/api/apiWrapper'

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

    const owlResponse = await fetch('http://localhost:8000/api/run-society', {
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

    const result = await owlResponse.json()
    return res.status(200).json(result)
  } catch (error: any) {
    console.error('Error in OWL run-society:', error)
    return res.status(500).json({ error: error.message })
  }
}
