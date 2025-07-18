import MCPMarketplace from 'components/interfaces/MCP/MCPMarketplace'
import MCPLayout from 'components/layouts/MCPLayout/MCPLayout'
import DefaultLayout from 'components/layouts/DefaultLayout'
import { ScaffoldContainer, ScaffoldSection } from 'components/layouts/Scaffold'
import type { NextPageWithLayout } from 'types'

const MCPMarketplacePage: NextPageWithLayout = () => {
  return (
    <ScaffoldContainer>
      <ScaffoldSection>
        <MCPMarketplace />
      </ScaffoldSection>
    </ScaffoldContainer>
  )
}

MCPMarketplacePage.getLayout = (page) => (
  <DefaultLayout>
    <MCPLayout title="MCP Server Marketplace">{page}</MCPLayout>
  </DefaultLayout>
)

export default MCPMarketplacePage
