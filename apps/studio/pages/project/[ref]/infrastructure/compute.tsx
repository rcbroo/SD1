import ComputeProviders from 'components/interfaces/Infrastructure/ComputeProviders'
import InfrastructureLayout from 'components/layouts/InfrastructureLayout/InfrastructureLayout'
import DefaultLayout from 'components/layouts/DefaultLayout'
import { ScaffoldContainer, ScaffoldSection } from 'components/layouts/Scaffold'
import type { NextPageWithLayout } from 'types'

const ComputeProvidersPage: NextPageWithLayout = () => {
  return (
    <ScaffoldContainer>
      <ScaffoldSection>
        <ComputeProviders />
      </ScaffoldSection>
    </ScaffoldContainer>
  )
}

ComputeProvidersPage.getLayout = (page) => (
  <DefaultLayout>
    <InfrastructureLayout title="Compute Providers">{page}</InfrastructureLayout>
  </DefaultLayout>
)

export default ComputeProvidersPage
