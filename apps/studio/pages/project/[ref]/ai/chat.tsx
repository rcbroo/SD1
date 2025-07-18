import React from 'react'
import ChatInterface from 'components/interfaces/AI/ChatInterface'
import AIChatLayout from 'components/layouts/AILayout/AIChatLayout'
import DefaultLayout from 'components/layouts/DefaultLayout'
import { ScaffoldContainer, ScaffoldSection } from 'components/layouts/Scaffold'
import type { NextPageWithLayout } from 'types'

const AIChatPage: NextPageWithLayout = () => {
  return (
    <ScaffoldContainer>
      <ScaffoldSection>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI Chat & Service Automation</h1>
            <p className="text-foreground-light">
              Natural language interface for platform management and service automation
            </p>
          </div>
          <ChatInterface />
        </div>
      </ScaffoldSection>
    </ScaffoldContainer>
  )
}

AIChatPage.getLayout = (page) => (
  <DefaultLayout>
    <AIChatLayout title="AI Chat">{page}</AIChatLayout>
  </DefaultLayout>
)

export default AIChatPage
