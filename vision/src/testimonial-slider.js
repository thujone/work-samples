import React, {Component} from 'react'
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext
} from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronRight,
  faChevronLeft
} from '@fortawesome/free-solid-svg-icons'

const smartQuote = (quote) => `\u201C${quote}\u201D`  // Surround quote with &ldquo; and &rdquo; html entities

const quotes = [
  {
    quote: smartQuote`I cannot wait for customers to take full advantage of the Vision portal. This will truly be a game changer!`,
    position: 'Finance Manager',
    company: 'Presidio'
  },
  {
    quote: smartQuote`We are going to give you all of our business! Vision and Presidio have been such a great experience!`,
    position: 'IT Specialist',
    company: 'Customer'
  },
  {
    quote: smartQuote`We really needed to WOW Cisco, and they were very excited about Vision.`,
    position: 'Customer Success Manager',
    company: 'Presidio'
  },
  {
    quote: smartQuote`This is a great tool and I think we are going to do a lot of business together!`,
    position: 'Finance Specialist',
    company: 'Customer'
  },
  {
    quote: smartQuote`This is fantastic. I recently had [my customer] set up on this and it is wonderful.`,
    position: 'Account Executive',
    company: 'Presidio'
  }
]

const TestimonialsContainer = styled.div`
  margin-top: 53px;
  text-transform: uppercase;
`

const Divider = styled.hr`
  width: 10%;
  height: 1px;
  border: none;
  background-color: #0190c0;
  margin-bottom: 30px;
`

const StyledCarouselProvider = styled(CarouselProvider)`
  width: 95%;
  height: 160px;
  max-width: 705px;
  margin: 0 auto;
  position: relative;
`

const PreviousButton = styled(ButtonBack)`
  position: absolute;
  top: 8%;
  left: -5%;
  border: 0;
  background: #fff;

  &:disabled {
    opacity: .4
  }
`

const NextButton = styled(ButtonNext)`
  position: absolute;
  top: 8%;
  right: -5%;
  border: 0;
  background: #fff;

  &:disabled {
    opacity: .4
  }
`

const StyledSlide = styled(Slide)`
  text-transform: none;
  cursor: pointer;

  p {
    font-size: 22px;
    margin: 0 auto 10px;
    line-height: 1.2em;
    min-height: 52px;
    max-width: 90%;
    overflow: ellipsis;
  }

  footer {
    font-size: 18px;
    font-weight: bold;
  }
`


export default class TestimonialSlider extends Component {
  render() {
    return (
      <TestimonialsContainer>
        <h2>Testimonials</h2>
        <Divider />
        <StyledCarouselProvider
          naturalSlideWidth={640}
          naturalSlideHeight={160}
          totalSlides={quotes.length}
        >
          <Slider>
            {quotes.map((item, i) => {
              return (
                <StyledSlide key={i} index={i}>
                  <p>{item.quote}</p>
                  <footer>{item.position}, {item.company}</footer>
                </StyledSlide>
              )
            })}
          </Slider>
          <PreviousButton>
            <FontAwesomeIcon icon={faChevronLeft} size="4x" color="#410099" />
          </PreviousButton>
          <NextButton>
            <FontAwesomeIcon icon={faChevronRight} size="4x" color="#410099" />
          </NextButton>
        </StyledCarouselProvider>
      </TestimonialsContainer>
    )
  }
}