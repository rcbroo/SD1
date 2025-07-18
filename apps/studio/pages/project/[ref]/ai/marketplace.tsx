import AIProviderMarketplace from 'components/interfaces/AI/AIProviderMarketplace'
import AILayout from 'components/layouts/AILayout/AILayout'
import DefaultLayout from 'components/layouts/DefaultLayout'
import { ScaffoldContainer, ScaffoldSection } from 'components/layouts/Scaffold'
import type { NextPageWithLayout } from 'types'

const AIProviderMarketplacePage: NextPageWithLayout = () => {
  return (
    <ScaffoldContainer>
      <ScaffoldSection>
        <AIProviderMarketplace />
      </ScaffoldSection>
    </ScaffoldContainer>
  )
}

AIProviderMarketplacePage.getLayout = (page) => (
  <DefaultLayout>
    <AILayout title="AI Provider Marketplace">{page}</AILayout>
  </DefaultLayout>
)

export default AIProviderMarketplacePage
