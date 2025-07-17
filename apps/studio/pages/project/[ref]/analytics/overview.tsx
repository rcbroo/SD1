import AnalyticsDashboard from 'components/interfaces/Analytics/AnalyticsDashboard'
import AnalyticsLayout from 'components/layouts/AnalyticsLayout/AnalyticsLayout'
import DefaultLayout from 'components/layouts/DefaultLayout'
import { ScaffoldContainer, ScaffoldSection } from 'components/layouts/Scaffold'
import type { NextPageWithLayout } from 'types'

const AnalyticsOverviewPage: NextPageWithLayout = () => {
  return (
    <ScaffoldContainer>
      <ScaffoldSection>
        <AnalyticsDashboard />
      </ScaffoldSection>
    </ScaffoldContainer>
  )
}

AnalyticsOverviewPage.getLayout = (page) => (
  <DefaultLayout>
    <AnalyticsLayout title="Analytics Overview">{page}</AnalyticsLayout>
  </DefaultLayout>
)

export default AnalyticsOverviewPage
