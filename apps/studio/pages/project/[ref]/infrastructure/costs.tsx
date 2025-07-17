import CostManagement from 'components/interfaces/Infrastructure/CostManagement'
import InfrastructureLayout from 'components/layouts/InfrastructureLayout/InfrastructureLayout'
import DefaultLayout from 'components/layouts/DefaultLayout'
import { ScaffoldContainer, ScaffoldSection } from 'components/layouts/Scaffold'
import type { NextPageWithLayout } from 'types'

const CostManagementPage: NextPageWithLayout = () => {
  return (
    <ScaffoldContainer>
      <ScaffoldSection>
        <CostManagement />
      </ScaffoldSection>
    </ScaffoldContainer>
  )
}

CostManagementPage.getLayout = (page) => (
  <DefaultLayout>
    <InfrastructureLayout title="Cost Management">{page}</InfrastructureLayout>
  </DefaultLayout>
)

export default CostManagementPage
