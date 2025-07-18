import { useRouter } from 'next/router'
import React, { PropsWithChildren } from 'react'

import { ProductMenu } from 'components/ui/ProductMenu'
import { useSelectedProject } from 'hooks/misc/useSelectedProject'
import { withAuth } from 'hooks/misc/withAuth'
import ProjectLayout from '../ProjectLayout/ProjectLayout'
import { generateAIChatMenu } from './AIChatMenu.utils'

export interface AIChatLayoutProps {
  title?: string
}

const AIChatProductMenu = () => {
  const project = useSelectedProject()
  const router = useRouter()
  const page = router.pathname.split('/')[4]

  return (
    <>
      <ProductMenu
        page={page}
        menu={generateAIChatMenu(project)}
      />
    </>
  )
}

const AIChatLayout = ({ children }: PropsWithChildren<AIChatLayoutProps>) => {
  return (
    <ProjectLayout 
      product="AI Chat" 
      productMenu={<AIChatProductMenu />} 
      isBlocking={false}
    >
      {children}
    </ProjectLayout>
  )
}

export default withAuth(AIChatLayout)
