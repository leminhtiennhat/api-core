import { SnackProvider } from '@reapit/elements'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import ErrorBoundary from '../components/hocs/error-boundary'
import '../styles/index.css'
import Router from './router'

dayjs.extend(advancedFormat)

const App = () => {
  return (
    <ErrorBoundary>
      <SnackProvider>
        <Router />
      </SnackProvider>
    </ErrorBoundary>
  )
}

export default App
