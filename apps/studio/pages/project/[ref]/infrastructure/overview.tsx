import InfrastructureOverview from 'components/interfaces/Infrastructure/InfrastructureOverview'
import InfrastructureLayout from 'components/layouts/InfrastructureLayout/InfrastructureLayout'
import DefaultLayout from 'components/layouts/DefaultLayout'
import { ScaffoldContainer, ScaffoldSection } from 'components/layouts/Scaffold'
import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'
import type { NextPageWithLayout } from 'types'

const InfrastructureOverviewPage: NextPageWithLayout = () => {
  const { project } = useProjectContext()

  return (
    <ScaffoldContainer>
      <ScaffoldSection>
        <InfrastructureOverview projectId={project?.ref || ''} />
      </ScaffoldSection>
    </ScaffoldContainer>
  )
}

InfrastructureOverviewPage.getLayout = (page) => (
  <DefaultLayout>
    <InfrastructureLayout title="Infrastructure Overview">{page}</InfrastructureLayout>
  </DefaultLayout>
)

export default InfrastructureOverviewPage
