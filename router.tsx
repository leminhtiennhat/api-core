// import { Portal } from '@reapit/elements'
import { createBrowserHistory } from 'history'
import * as React from 'react'
import { Redirect, Route, Router as BrowserRouter, Switch } from 'react-router-dom'
import Routes from '../constants/routes'
import AuthRoute from './auth-route'
import PrivateRouteWrapper from './private-route-wrapper'

export const history = createBrowserHistory()

export const catchChunkError = (
  fn: Function,
  retriesLeft = 3,
  interval = 500,
): Promise<{ default: React.ComponentType<any> }> => {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error: Error) => {
        // Ignore chunk cache error and retry to fetch, if cannot reload browser
        console.info(error)
        setTimeout(() => {
          if (retriesLeft === 1) {
            window.location.reload()
            return
          }
          catchChunkError(fn, retriesLeft - 1, interval).then(resolve, reject)
        }, interval)
      })
  })
}

const LoginPage = React.lazy(() => catchChunkError(() => import('../components/pages/login')))
const NoActiveSubscriptionPage = React.lazy(() =>
  catchChunkError(() => import('../components/pages/no-active-subscription')),
)
const HomePage = React.lazy(() => catchChunkError(() => import('../components/pages/home')))
const ShowListingDetailPage = React.lazy(() => catchChunkError(() => import('../components/pages/listings/show')))
const ShowListingDetailTimeLinePage = React.lazy(() =>
  catchChunkError(() => import('../components/pages/listings/show-timeline')),
)
const MyAccountPage = React.lazy(() => catchChunkError(() => import('../components/pages/my-account')))
const ListingsPage = React.lazy(() => catchChunkError(() => import('../components/pages/listings')))
// const ClientsPage = React.lazy(() => catchChunkError(() => import('../components/pages/clients')))
const AttachListingPage = React.lazy(() => catchChunkError(() => import('../components/pages/attach-listing')))
const AddConsumerPage = React.lazy(() => catchChunkError(() => import('../components/pages/add-consumer')))
const PropertyDetailPage = React.lazy(() => catchChunkError(() => import('../components/pages/properties')))
const DesktopProcessPage = React.lazy(() => catchChunkError(() => import('../components/pages/desktop-process')))
const NoChainInfoPage = React.lazy(() => catchChunkError(() => import('../components/pages/error/no-chain-info')))

const Router = () => (
  <BrowserRouter history={history}>
    <React.Suspense fallback={null}>
      <Switch>
        <Route path={Routes.LOGIN} component={LoginPage} exact />
        <PrivateRouteWrapper>
          <Switch>
            <Route path={Routes.NO_ACTIVE_SUBSCRIPTION} component={NoActiveSubscriptionPage} exact />
            {/*<Redirect exact from={Routes.HOME} to={entryPage} />*/}
            <AuthRoute path={Routes.HOME} component={HomePage} exact />
            <AuthRoute path={Routes.LISTINGS} component={ListingsPage} exact />
            <Route path={Routes.MY_ACCOUNT} component={MyAccountPage} exact />
            <AuthRoute path={Routes.SHOW_LISTING_DETAIL} component={ShowListingDetailPage} exact />
            <AuthRoute path={Routes.SHOW_LISTING_DETAIL_TIMELINE} component={ShowListingDetailTimeLinePage} exact />
            {/* <AuthRoute path={Routes.CLIENTS} component={ClientsPage} exact /> */}
            <AuthRoute path={Routes.ATTACH_LISTING} component={AttachListingPage} exact />
            <AuthRoute path={Routes.ADD_CONSUMER} component={AddConsumerPage} exact />
            <AuthRoute path={Routes.PROPERTY_DETAIL} component={PropertyDetailPage} exact />
            <AuthRoute path={Routes.DESKTOP_PROCESS} component={DesktopProcessPage} exact />
            <AuthRoute path={Routes.NO_CHAIN_INFO} component={NoChainInfoPage} exact />
          </Switch>
        </PrivateRouteWrapper>
        <Redirect to={Routes.LOGIN} />
      </Switch>
    </React.Suspense>
  </BrowserRouter>
)

export default Router
