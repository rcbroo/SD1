import { NextApiRequest, NextApiResponse } from 'next'
import { GROQQuery } from '../../../lib/cms/groq'
import { CMSContent } from '../../../components/interfaces/CMS/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const query: GROQQuery = req.body

    let sql = 'SELECT * FROM cms_content WHERE 1=1'
    const params: any[] = []

    if (query.filter) {
      const conditions = parseGROQFilter(query.filter)
      sql += ` AND ${conditions.sql}`
      params.push(...conditions.params)
    }

    if (query.order) {
      sql += ` ORDER BY ${query.order}`
    }

    if (query.limit) {
      sql += ` LIMIT ${query.limit}`
    }

    const mockResults: CMSContent[] = [
      {
        id: '1',
        title: 'Sample Post',
        slug: 'sample-post',
        content: 'This is sample content',
        status: 'published',
        type: 'post',
        author_id: 'user1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: [],
        categories: [],
      },
    ]

    res.status(200).json(mockResults)
  } catch (error) {
    console.error('GROQ query error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

function parseGROQFilter(filter: string) {
  return {
    sql: filter.replace(/==/g, '=').replace(/&&/g, 'AND'),
    params: [],
  }
}
