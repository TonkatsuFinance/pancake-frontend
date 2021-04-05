import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import { getCakeAddress } from 'utils/addressHelpers'
import useI18n from 'hooks/useI18n'
import { TwitterTimelineEmbed, TwitterShareButton, TwitterFollowButton, TwitterHashtagButton, TwitterMentionButton, TwitterTweetEmbed, TwitterMomentShare, TwitterDMButton, TwitterVideoEmbed, TwitterOnAirButton } from 'react-twitter-embed';

const StyledTwitterCard = styled(Card)`
  margin-left: auto;
  margin-right: auto;
`
const TwitterCard = () => {
    const TranslateString = useI18n()
  return (
    <StyledTwitterCard>
      <CardBody>
        <Heading size="xl" mb="24px">
          {TranslateString(542, 'Anouncement')}
        </Heading>
        <TwitterTimelineEmbed
            sourceType="profile"
            screenName="saurabhnemade"
            options={{height: 400}}
        />
      </CardBody>
    </StyledTwitterCard>
  )
}

export default TwitterCard
