import StorageProviders from 'components/interfaces/Infrastructure/StorageProviders'
import InfrastructureLayout from 'components/layouts/InfrastructureLayout/InfrastructureLayout'
import DefaultLayout from 'components/layouts/DefaultLayout'
import { ScaffoldContainer, ScaffoldSection } from 'components/layouts/Scaffold'
import type { NextPageWithLayout } from 'types'

const StorageProvidersPage: NextPageWithLayout = () => {
  return (
    <ScaffoldContainer>
      <ScaffoldSection>
        <StorageProviders />
      </ScaffoldSection>
    </ScaffoldContainer>
  )
}

StorageProvidersPage.getLayout = (page) => (
  <DefaultLayout>
    <InfrastructureLayout title="Storage & CDN Providers">{page}</InfrastructureLayout>
  </DefaultLayout>
)

export default StorageProvidersPage
