import { useReapitConnect } from '@reapit/connect-session'
import { FlexContainer, Loader, MainContainer, Molecule } from '@reapit/elements'
import * as React from 'react'
import { Redirect, useLocation } from 'react-router'
import Menu from '../components/ui/menu'
import AuthContext from '../contexts/auth'
import { reapitConnectBrowserSession } from '../core/connect-session'
import { useProvideAuth } from '../hooks/useAuth'

const { Suspense } = React

export type PrivateRouteWrapperProps = {}

export const PrivateRouteWrapper: React.FunctionComponent<PrivateRouteWrapperProps> = ({ children }) => {
  const { connectSession, connectInternalRedirect } = useReapitConnect(reapitConnectBrowserSession)
  const location = useLocation()
  const currentUri = `${location?.pathname}${location?.search}`
  const auth = useProvideAuth()

  React.useEffect(() => {
    if (!connectSession) {
      return
    }

    const loginByIdToken = async () => {
      await auth.login(connectSession.idToken, connectSession.accessToken)
    }

    loginByIdToken()
  }, [connectSession])

  if (!connectSession) {
    return null
  }

  if (connectInternalRedirect && currentUri !== connectInternalRedirect) {
    return <Redirect to={connectInternalRedirect} />
  }

  return (
    <MainContainer>
      <AuthContext.Provider value={auth}>
        <Menu />
        <FlexContainer isFlexGrow1>
          <Suspense
            fallback={
              <Molecule>
                <Loader fullPage />
              </Molecule>
            }
          >
            {children}
          </Suspense>
        </FlexContainer>
      </AuthContext.Provider>
    </MainContainer>
  )
}

export default PrivateRouteWrapper
