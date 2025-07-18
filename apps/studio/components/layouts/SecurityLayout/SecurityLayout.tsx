import { useRouter } from 'next/router'
import { PropsWithChildren } from 'react'

import { ProductMenu } from 'components/ui/ProductMenu'
import { useSelectedProject } from 'hooks/misc/useSelectedProject'
import { withAuth } from 'hooks/misc/withAuth'
import ProjectLayout from '../ProjectLayout/ProjectLayout'
import { generateSecurityMenu } from './SecurityMenu.utils'

export interface SecurityLayoutProps {
  title?: string
}

const SecurityProductMenu = () => {
  const project = useSelectedProject()
  const router = useRouter()
  const page = router.pathname.split('/')[4]

  return (
    <>
      <ProductMenu
        page={page}
        menu={generateSecurityMenu(project)}
      />
    </>
  )
}

const SecurityLayout = ({ children }: PropsWithChildren<SecurityLayoutProps>) => {
  return (
    <ProjectLayout 
      product="Security" 
      productMenu={<SecurityProductMenu />} 
      isBlocking={false}
    >
      {children}
    </ProjectLayout>
  )
}

export default withAuth(SecurityLayout)
