import React from 'react'
import { shallow, mount } from 'enzyme'
import { Route, MemoryRouter } from 'react-router'
import LobbyVideo from './lobby-video'

describe('Lobby video component', () => {
  test('Video component renders without crashing', () => {
    const wrapper = shallow(
      <LobbyVideo />
    )
    expect(wrapper.find(Route)).toHaveLength(1)
  })

  test('Video component should pass down props to the player', () => {
    const wrapper = mount(
      <MemoryRouter>
        <LobbyVideo />
      </MemoryRouter>
    )
    const video = wrapper.find('video')

    expect(video.props().width).toEqual('100%')
    expect(video.props().height).toEqual('auto')
    expect(video.props().autoPlay).toEqual(true)
    expect(video.props().poster).toEqual('../media/presidio-cp-info-keyframe.jpg')
  })
})