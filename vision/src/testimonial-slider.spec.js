import React from 'react'
import { shallow } from 'enzyme'
import TestimonialSlider from './testimonial-slider'

describe('Testimonial slider component', () => {
  let props

  beforeEach(() => {
    props = {}
  })

  test('Testimonial slider component renders without crashing', () => {
    const wrapper = shallow(<TestimonialSlider />)
    expect(wrapper.find('h2').text()).toEqual('Testimonials')
  })
})