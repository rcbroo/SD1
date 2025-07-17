import { useRouter } from 'next/router'
import { PropsWithChildren } from 'react'

import { ProductMenu } from 'components/ui/ProductMenu'
import { useSelectedProject } from 'hooks/misc/useSelectedProject'
import { withAuth } from 'hooks/misc/withAuth'
import ProjectLayout from '../ProjectLayout/ProjectLayout'
import { generateMCPMenu } from './MCPMenu.utils'

export interface MCPLayoutProps {
  title?: string
}

const MCPProductMenu = () => {
  const project = useSelectedProject()
  const router = useRouter()
  const page = router.pathname.split('/')[4]

  return (
    <>
      <ProductMenu
        page={page}
        menu={generateMCPMenu(project)}
      />
    </>
  )
}

const MCPLayout = ({ children }: PropsWithChildren<MCPLayoutProps>) => {
  return (
    <ProjectLayout 
      product="MCP Servers" 
      productMenu={<MCPProductMenu />} 
      isBlocking={false}
    >
      {children}
    </ProjectLayout>
  )
}

export default withAuth(MCPLayout)
