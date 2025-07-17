import React, { PropsWithChildren } from 'react'
import { useRouter } from 'next/router'

import { ProductMenu } from 'components/ui/ProductMenu'
import { useSelectedProject } from 'hooks/misc/useSelectedProject'
import { withAuth } from 'hooks/misc/withAuth'
import ProjectLayout from '../ProjectLayout/ProjectLayout'
import { generateAIMenu } from './AIMenu.utils'

export interface AILayoutProps {
  title?: string
}

const AIProductMenu = () => {
  const project = useSelectedProject()
  const router = useRouter()
  const page = router.pathname.split('/')[4]

  return (
    <>
      <ProductMenu page={page} menu={generateAIMenu(project)} />
    </>
  )
}

const AILayout = ({ children }: PropsWithChildren<AILayoutProps>) => {
  return (
    <ProjectLayout product="AI Providers" productMenu={<AIProductMenu />} isBlocking={false}>
      {children}
    </ProjectLayout>
  )
}

export default withAuth(AILayout)
