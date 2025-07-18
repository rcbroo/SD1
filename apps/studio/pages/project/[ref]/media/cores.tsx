import PlayerCores from 'components/interfaces/Media/PlayerCores'
import MediaLayout from 'components/layouts/MediaLayout/MediaLayout'
import DefaultLayout from 'components/layouts/DefaultLayout'
import { ScaffoldContainer, ScaffoldSection } from 'components/layouts/Scaffold'
import type { NextPageWithLayout } from 'types'

const PlayerCoresPage: NextPageWithLayout = () => {
  return (
    <ScaffoldContainer>
      <ScaffoldSection>
        <PlayerCores />
      </ScaffoldSection>
    </ScaffoldContainer>
  )
}

PlayerCoresPage.getLayout = (page) => (
  <DefaultLayout>
    <MediaLayout title="Player Cores">{page}</MediaLayout>
  </DefaultLayout>
)

export default PlayerCoresPage
