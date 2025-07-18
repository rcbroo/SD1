import { CMSContent } from '../../components/interfaces/CMS/types'

export interface GROQQuery {
  filter?: string
  select?: string[]
  order?: string
  limit?: number
}

export class CMSQueryBuilder {
  private query: GROQQuery = {}

  static create() {
    return new CMSQueryBuilder()
  }

  filter(condition: string) {
    this.query.filter = condition
    return this
  }

  select(fields: string[]) {
    this.query.select = fields
    return this
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc') {
    this.query.order = `${field} ${direction}`
    return this
  }

  limit(count: number) {
    this.query.limit = count
    return this
  }

  build(): GROQQuery {
    return { ...this.query }
  }

  static fromNaturalLanguage(query: string): GROQQuery {
    const groqQuery: GROQQuery = {}

    if (query.includes('published')) {
      groqQuery.filter = "status == 'published'"
    }
    if (query.includes('recent') || query.includes('latest')) {
      groqQuery.order = 'updated_at desc'
      groqQuery.limit = 10
    }
    if (query.includes('draft')) {
      groqQuery.filter = "status == 'draft'"
    }

    const typeMatch = query.match(/\b(posts?|pages?|articles?)\b/i)
    if (typeMatch) {
      const type = typeMatch[1].toLowerCase().replace(/s$/, '')
      groqQuery.filter = groqQuery.filter
        ? `${groqQuery.filter} && type == '${type}'`
        : `type == '${type}'`
    }

    return groqQuery
  }
}

export const executeGROQQuery = async (query: GROQQuery): Promise<CMSContent[]> => {
  const response = await fetch('/api/cms/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  })

  return response.json()
}

export const groq = (strings: TemplateStringsArray, ...values: any[]) => {
  const query = strings.reduce((result, string, i) => {
    return result + string + (values[i] || '')
  }, '')

  return CMSQueryBuilder.fromNaturalLanguage(query)
}
