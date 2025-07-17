import React from 'react'
import { useRouter } from 'next/router'
import { PropsWithChildren } from 'react'

import { ProductMenu } from 'components/ui/ProductMenu'
import { useSelectedProject } from 'hooks/misc/useSelectedProject'
import { withAuth } from 'hooks/misc/withAuth'
import ProjectLayout from '../ProjectLayout/ProjectLayout'
import { generateInfrastructureMenu } from './InfrastructureMenu.utils'

export interface InfrastructureLayoutProps {
  title?: string
}

const InfrastructureProductMenu = () => {
  const project = useSelectedProject()
  const router = useRouter()
  const page = router.pathname.split('/')[4]

  return (
    <>
      <ProductMenu page={page} menu={generateInfrastructureMenu(project)} />
    </>
  )
}

const InfrastructureLayout = ({ children }: PropsWithChildren<InfrastructureLayoutProps>) => {
  return (
    <ProjectLayout 
      product="Infrastructure" 
      productMenu={<InfrastructureProductMenu />} 
      isBlocking={false}
    >
      {children}
    </ProjectLayout>
  )
}

export default withAuth(InfrastructureLayout)
