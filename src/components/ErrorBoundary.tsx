import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          background: '#0b0c0b',
          color: '#e2e3de',
          fontFamily: 'system-ui, sans-serif',
          padding: 24,
        }}>
          <strong style={{ fontSize: 20, color: '#e46767' }}>DTHBoost Error</strong>
          <pre style={{
            maxWidth: 600,
            padding: 16,
            borderRadius: 8,
            background: '#181a17',
            border: '1px solid #20221e',
            fontSize: 13,
            lineHeight: 1.5,
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>{this.state.error.message}</pre>
          <button
            style={{
              minHeight: 38,
              padding: '0 18px',
              borderRadius: 8,
              border: '1px solid #20221e',
              background: '#111210',
              color: '#e2e3de',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 700,
            }}
            onClick={() => this.setState({ error: null })}
            type="button"
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
