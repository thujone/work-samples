import React, {Component} from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { DefaultPlayer as Video } from 'react-html5video'
import 'react-html5video/dist/styles.css'
import mp4Video from '../media/presidio-cp-info.mp4'
import webmVideo from '../media/presidio-cp-info.webm'

const StyledVideo = styled(Video)`
  // Ensure all the video controls are the same size
  svg {
    width: 32px;
    height: 32px;
  }

  // Ensure the time-elapsed/time-remaining font is readable
  div > span {
    font-size: 14px;
  }
`

class LobbyVideo extends Component {
  render() {
    return (
      <StyledVideo
        width="100%"
        height="auto"
        autoPlay
        controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
        poster='../media/presidio-cp-info-keyframe.jpg'
      >
        <source src={mp4Video} type='video/mp4' />
        <source src={webmVideo} type='video/webm' />
      </StyledVideo>
    )
  }
}

export default withRouter(LobbyVideo)