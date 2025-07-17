import React, { PropsWithChildren } from 'react'
import { useRouter } from 'next/router'

import { ProductMenu } from 'components/ui/ProductMenu'
import { useSelectedProject } from 'hooks/misc/useSelectedProject'
import { withAuth } from 'hooks/misc/withAuth'
import ProjectLayout from '../ProjectLayout/ProjectLayout'
import { generateMediaMenu } from './MediaMenu.utils'

export interface MediaLayoutProps {
  title?: string
}

const MediaProductMenu = () => {
  const project = useSelectedProject()
  const router = useRouter()
  const page = router.pathname.split('/')[4]

  return (
    <>
      <ProductMenu
        page={page}
        menu={generateMediaMenu(project)}
      />
    </>
  )
}

const MediaLayout = ({ children }: PropsWithChildren<MediaLayoutProps>) => {
  return (
    <ProjectLayout 
      product="Media Player" 
      productMenu={<MediaProductMenu />} 
      isBlocking={false}
    >
      {children}
    </ProjectLayout>
  )
}

export default withAuth(MediaLayout)
