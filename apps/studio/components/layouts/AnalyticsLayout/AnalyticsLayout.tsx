import { useRouter } from 'next/router'
import { PropsWithChildren } from 'react'

import { ProductMenu } from 'components/ui/ProductMenu'
import { useSelectedProject } from 'hooks/misc/useSelectedProject'
import { withAuth } from 'hooks/misc/withAuth'
import ProjectLayout from '../ProjectLayout/ProjectLayout'
import { generateAnalyticsMenu } from './AnalyticsMenu.utils'

export interface AnalyticsLayoutProps {
  title?: string
}

const AnalyticsProductMenu = () => {
  const project = useSelectedProject()
  const router = useRouter()
  const page = router.pathname.split('/')[4]

  return (
    <>
      <ProductMenu
        page={page}
        menu={generateAnalyticsMenu(project)}
      />
    </>
  )
}

const AnalyticsLayout = ({ children }: PropsWithChildren<AnalyticsLayoutProps>) => {
  return (
    <ProjectLayout 
      product="Analytics" 
      productMenu={<AnalyticsProductMenu />} 
      isBlocking={false}
    >
      {children}
    </ProjectLayout>
  )
}

export default withAuth(AnalyticsLayout)
