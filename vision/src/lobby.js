import React, {Component} from "react"
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle, faTimes } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-modal'
import TestimonialSlider from './testimonial-slider'
import LobbyVideo from './lobby-video'

const LobbyPanel = styled.div`
  text-align: center;
  background: #000 url(/images/home-page-background.jpg) right 0 no-repeat;
  background-size: cover;
`

const PrimaryHeader = styled.h1`
  text-transform: uppercase;
  margin: 20px 0 0;
`

const SecondaryHeader = styled.h2`
  margin: 5px 0 55px;
`

const ModalLink = styled.button`
  border: 0;
  background: none;
  cursor: pointer;

  &:hover {
    opacity: .85;
  }
`

const CloseButton = styled.button`
  border: 0;
  background: 0;
  padding: 0;
  margin-bottom: 10px;
  cursor: pointer;
  
  &:hover {
    opacity: .85;
  }
`

const modalStyles = {
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    width: '620px',
    height: '410px',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    background: 'none'
  }
}

Modal.setAppElement('body')


class Lobby extends Component {
  constructor() {
    super()
 
    this.state = {
      isModalOpen: false
    }

    this.openModal = this.openModal.bind(this)
    this.afterOpenModal = this.afterOpenModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal() {
    this.setState({isModalOpen: true})
  }
 
  afterOpenModal() {
  }
 
  closeModal() {
    this.setState({isModalOpen: false})
  }

  render() {
    return (
      <LobbyPanel key="lobby">
        <PrimaryHeader>A New Vision</PrimaryHeader>
        <SecondaryHeader>Simplify your past, present, and future business with Presidio.</SecondaryHeader>
        <ModalLink onClick={this.openModal}>
          <FontAwesomeIcon icon={faPlayCircle} size='6x' color='#0190c0' />
        </ModalLink>
        <TestimonialSlider />
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={modalStyles}
        >
          <CloseButton onClick={this.closeModal}>
            <FontAwesomeIcon icon={faTimes} size='3x' color='#0190c0' />
          </CloseButton>
          <LobbyVideo />
        </Modal>
      </LobbyPanel>
    )
  }
}

export default withRouter(Lobby)