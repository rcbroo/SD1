import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import apiWrapper from 'lib/api/apiWrapper'

const querySchema = z.object({
  projectRef: z.string(),
})

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { data, error: parseError } = querySchema.safeParse(req.query)
    if (parseError) {
      return res.status(400).json({ error: 'Invalid query parameters', issues: parseError.issues })
    }

    const { projectRef } = data

    const installations = []

    res.status(200).json({
      installations
    })
  } catch (error) {
    console.error('MCP server installations query error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const wrapper = (req: NextApiRequest, res: NextApiResponse) =>
  apiWrapper(req, res, handler, { withAuth: true })

export default wrapper
