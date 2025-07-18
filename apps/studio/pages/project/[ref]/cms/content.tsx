import { NextPageWithLayout } from 'types'
import CMSLayout from 'components/interfaces/CMS/CMSLayout'
import { CMSContentPage as CMSContent } from 'components/interfaces/CMS/CMSContentPage'

const CMSContentPage: NextPageWithLayout = () => {
  return <CMSContent />
}

CMSContentPage.getLayout = (page) => <CMSLayout>{page}</CMSLayout>

export default CMSContentPage
