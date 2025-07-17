import MediaLibrary from 'components/interfaces/Media/MediaLibrary'
import MediaLayout from 'components/layouts/MediaLayout/MediaLayout'
import DefaultLayout from 'components/layouts/DefaultLayout'
import { ScaffoldContainer, ScaffoldSection } from 'components/layouts/Scaffold'
import type { NextPageWithLayout } from 'types'

const MediaLibraryPage: NextPageWithLayout = () => {
  return (
    <ScaffoldContainer>
      <ScaffoldSection>
        <MediaLibrary />
      </ScaffoldSection>
    </ScaffoldContainer>
  )
}

MediaLibraryPage.getLayout = (page) => (
  <DefaultLayout>
    <MediaLayout title="Media Library">{page}</MediaLayout>
  </DefaultLayout>
)

export default MediaLibraryPage
