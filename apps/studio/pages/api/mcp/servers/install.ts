import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { getMCPTemplateById } from 'lib/mcp/templates'
import apiWrapper from 'lib/api/apiWrapper'

const requestBodySchema = z.object({
  templateId: z.string(),
  projectRef: z.string(),
  config: z.object({
    command: z.string(),
    args: z.array(z.string()),
    env: z.record(z.string()).optional(),
  }),
})

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { data, error: parseError } = requestBodySchema.safeParse(req.body)
    if (parseError) {
      return res.status(400).json({ error: 'Invalid request body', issues: parseError.issues })
    }

    const { templateId, projectRef, config } = data
    const template = getMCPTemplateById(templateId)

    if (!template) {
      return res.status(404).json({ error: 'Template not found' })
    }

    const installationResult = {
      success: true,
      message: `MCP server ${template.name} installation initiated`,
      serverId: `${projectRef}-${templateId}-${Date.now()}`
    }

    const installation = {
      id: `${projectRef}-${templateId}-${Date.now()}`,
      templateId,
      projectId: projectRef,
      status: 'installed' as const,
      config,
      installedAt: new Date().toISOString(),
    }

    res.status(200).json({
      success: true,
      installation,
      owlResult: installationResult
    })
  } catch (error) {
    console.error('MCP server installation error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const wrapper = (req: NextApiRequest, res: NextApiResponse) =>
  apiWrapper(req, res, handler, { withAuth: true })

export default wrapper
