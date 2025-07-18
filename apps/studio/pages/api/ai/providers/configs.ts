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

    const mockConfigs = [
      {
        id: '1',
        providerId: 'openai',
        projectId: projectRef,
        apiKey: '***',
        enabled: true,
        model: 'gpt-3.5-turbo',
        maxTokens: 1000,
        temperature: 0.7,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        providerId: 'anthropic',
        projectId: projectRef,
        apiKey: '***',
        enabled: false,
        model: 'claude-3-sonnet',
        maxTokens: 1000,
        temperature: 0.7,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    res.status(200).json(mockConfigs)
  } catch (error) {
    console.error('AI provider configs error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const wrapper = (req: NextApiRequest, res: NextApiResponse) =>
  apiWrapper(req, res, handler, { withAuth: true })

export default wrapper
