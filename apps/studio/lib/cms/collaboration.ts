import { CMSCollaboration, CMSParticipant, CMSChange } from '../../components/interfaces/CMS/types'

export class CollaborationManager {
  private ws: WebSocket | null = null
  private sessionId: string
  private participants: Map<string, CMSParticipant> = new Map()
  private onUpdate?: (collaboration: CMSCollaboration) => void

  constructor(sessionId: string, onUpdate?: (collaboration: CMSCollaboration) => void) {
    this.sessionId = sessionId
    this.onUpdate = onUpdate
    this.connect()
  }

  private connect() {
    this.ws = new WebSocket(`wss://your-supabase-url/realtime/v1/websocket`)

    this.ws.onopen = () => {
      this.joinSession()
    }

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.handleMessage(data)
    }
  }

  private joinSession() {
    if (!this.ws) return

    this.ws.send(
      JSON.stringify({
        type: 'join_session',
        sessionId: this.sessionId,
        participant: {
          id: 'current-user-id',
          name: 'Current User',
          color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        },
      })
    )
  }

  private handleMessage(data: any) {
    switch (data.type) {
      case 'participant_joined':
        this.participants.set(data.participant.id, data.participant)
        break
      case 'participant_left':
        this.participants.delete(data.participantId)
        break
      case 'content_change':
        this.handleContentChange(data.change)
        break
    }

    this.notifyUpdate()
  }

  private handleContentChange(change: CMSChange) {}

  private notifyUpdate() {
    if (this.onUpdate) {
      this.onUpdate({
        enabled: true,
        sessionId: this.sessionId,
        participants: Array.from(this.participants.values()),
        cursors: [],
        changes: [],
      })
    }
  }

  sendChange(change: CMSChange) {
    if (this.ws) {
      this.ws.send(
        JSON.stringify({
          type: 'content_change',
          sessionId: this.sessionId,
          change,
        })
      )
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}
