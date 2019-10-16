import React from 'react'
import { useQuery } from 'react-apollo'
import { get } from 'lodash'
import {
  Card,
  TouchableScale,
  styled,
  H6,
  FlexedView,
} from '@apollosproject/ui-kit'
import { WebBrowserConsumer } from 'ChristFellowship/src/ui/WebBrowser'

import GET_LIVE_STREAM from './getLiveStream'

const Title = styled(({ theme }) => ({
  color: theme.colors.alert,
  fontWeight: 'bold'
}))(H6)

const Pill = styled(({ theme }) => ({
  backgroundColor: theme.colors.white,
  borderColor: theme.colors.lightSecondary,
  borderWidth: 1,
  paddingVertical: theme.sizing.baseUnit * 0.5,
  width: '25%',
  alignSelf: 'center',
  marginVertical: 0
}))(Card)

const FlexedViewContentCentered = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'center',
  alignContent: 'center',
}))(FlexedView)

const LiveNowButton = () => {
  const { loading, error, data } = useQuery(GET_LIVE_STREAM, {
    fetchPolicy: "cache-and-network",
    pollInterval: 60000
  })

  if (loading || error) return null

  const isLive = get(data, 'liveStream.isLive', false)

  return isLive ? (
    <WebBrowserConsumer>
      {(openUrl) => (
        <TouchableScale
          onPress={() => openUrl('https://apollos.churchonline.org/')}
        >
          <Pill>
            <FlexedViewContentCentered>
              <Title>• Live</Title>
            </FlexedViewContentCentered>
          </Pill>
        </TouchableScale>
      )}
    </WebBrowserConsumer>
  ) : null
}

export default LiveNowButton
