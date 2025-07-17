import SecurityDashboard from 'components/interfaces/Security/SecurityDashboard'
import SecurityLayout from 'components/layouts/SecurityLayout/SecurityLayout'
import DefaultLayout from 'components/layouts/DefaultLayout'
import { ScaffoldContainer, ScaffoldSection } from 'components/layouts/Scaffold'
import type { NextPageWithLayout } from 'types'

const SecurityDashboardPage: NextPageWithLayout = () => {
  return (
    <ScaffoldContainer>
      <ScaffoldSection>
        <SecurityDashboard />
      </ScaffoldSection>
    </ScaffoldContainer>
  )
}

SecurityDashboardPage.getLayout = (page) => (
  <DefaultLayout>
    <SecurityLayout title="Security Dashboard">{page}</SecurityLayout>
  </DefaultLayout>
)

export default SecurityDashboardPage
