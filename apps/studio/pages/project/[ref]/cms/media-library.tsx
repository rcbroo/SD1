import { NextPageWithLayout } from 'types'
import { CMSLayout } from 'components/interfaces/CMS'
import { MediaLibrary } from 'components/interfaces/CMS/MediaLibrary'

const MediaLibraryPage: NextPageWithLayout = () => {
  return <MediaLibrary />
}

MediaLibraryPage.getLayout = (page) => <CMSLayout activeTab="media-library">{page}</CMSLayout>

export default MediaLibraryPage
