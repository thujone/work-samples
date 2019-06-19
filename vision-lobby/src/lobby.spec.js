import React from 'react'
import { shallow, mount } from 'enzyme'
import Modal from 'react-modal'
import { Route, MemoryRouter } from 'react-router'
import Lobby from './lobby'


describe('Lobby component', () => {
  let props
  let openModal

  beforeEach(() => {
    props = {}
    openModal = jest.fn()
  })

  test('Lobby component renders without crashing', () => {
    const wrapper = shallow(<Lobby />)
    expect(wrapper.find(Route)).toHaveLength(1)
  })

  test('Lobby component renders proper header text', () => {
    const wrapper = mount(
      <MemoryRouter>
        <Lobby />
      </MemoryRouter>
    )
    expect(wrapper.find('h1').text()).toEqual('A New Vision')
    expect(wrapper.find('h2').at(0).text()).toEqual('Simplify your past, present, and future business with Presidio.')
  })

  test('Play Video button opens the modal', () => {
    const wrapper = mount(
      <MemoryRouter>
        <Lobby />
      </MemoryRouter>
    )

    let modal = wrapper.find(Modal)
    expect(modal.props().isOpen).toEqual(false)

    // Click the play video button
    wrapper.find('button').at(0).simulate('click')
    modal = wrapper.find(Modal)
    expect(modal.props().isOpen).toEqual(true)
  })

  test('Clicking the Close Modal button closes the modal', () => {
    const wrapper = mount(
      <MemoryRouter>
        <Lobby />
      </MemoryRouter>
    )

    // Click the play video button
    wrapper.find('button').at(0).simulate('click')

    // Now the last button is the Close Modal button, so click that
    wrapper.find('button').at(3).simulate('click')
    expect(wrapper.find(Modal).props().isOpen).toEqual(false)
  })
})

