import { Loader } from '@reapit/elements'
import { Route, RouteProps } from 'react-router-dom'
import NoActiveSubscription from '../components/pages/no-active-subscription'
import Onboard from '../components/pages/onboard'
import ApppContext from '../contexts/app'
import { useProvideApp } from '../hooks/useApp'
import { useAuth } from '../hooks/useAuth'
import Routes from '../constants/routes'

const AuthRoute = ({ ...rest }: RouteProps) => {
  const auth = useAuth()
  const app = useProvideApp()
  const relationships = auth.user?.relationships
  const noActiveSubscriptionSkipPages = [Routes.MY_ACCOUNT]
  if (auth.loading) {
    return <Loader fullPage />
  }
  if (!auth.user) {
    return <NoActiveSubscription />
  }

  if (auth.user?.attributes.reapit_onboard == false || auth.user?.attributes.reapit_onboard == null) {
    return <Onboard />
  }

  if (
    !noActiveSubscriptionSkipPages.includes(String(rest.path)) &&
    !auth.can('listing-see-all') &&
    (relationships === undefined ||
      relationships['teams'] === undefined ||
      relationships['teams']['data'] === undefined ||
      !relationships['teams']['data'].length)
  ) {
    return <NoActiveSubscription />
  }

  return (
    <ApppContext.Provider value={app}>
      <Route {...rest} />
    </ApppContext.Provider>
  )
}

export default AuthRoute
