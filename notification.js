/****************************************************************************
 ** Notification toasts and modals for the Xendee Optimization GUI app.
 ** For use with the Validator class (/js/optimization/validator.js),
 **
 ** @license
 ** Copyright (c) 2020 Xendee Corporation. All rights reserved.
 ***************************************************************************/

export default class Notification {
  constructor() {
      this.baseToastSettings = {
          theme: 'bootstrap-v4',
          layout: 'center',
          closeWith: ['click'],
          progressBar: true,
          queue: 'general',
          timeout: 2000
      }
      this.baseModalSettings = {
          theme: 'bootstrap-v4',
          layout: 'center',
          closeWith: ['button'],
          modal: true,
          killer: true,
          queue: 'general',
          callbacks: {
              onShow: () => {
                  $('#noty_layout__center').width(560).addClass('validation fixIssuesNoty')
              }
          }
      }
      this.warningButtonClasses = 'btn btn-warning',
      this.defaultButtonClasses = 'btn btn-default',
      this.successButtonClasses = 'btn btn-success',
      this.dangerButtonClasses = 'btn btn-danger',
      this.secondaryButtonClasses = 'btn btn-secondary',
      this.basicButtonClasses = 'btn'
  }

  closeAll(queue = 'general') {
      Noty.closeAll(queue)
      return this
  }

  showSuccess(message, settings = null) {
      this.closeAll()

      const successToast = new Noty({
          ...this.baseToastSettings,
          ...settings,
          type: 'success',
          text: message
      })
      successToast.show()
      return this
  }

  showWarning(message, settings = null) {
      this.closeAll()

      const successToast = new Noty({
          ...this.baseToastSettings,
          ...settings,
          type: 'warning',
          text: message
      })
      successToast.show()
      return this
  }

  showWarningModal(message, settings = null, buttonsArr = [{ label: 'OK', classList: notification.successButtonClasses, callback: null }]) {
      this.closeAll()

      const warningModal = new Noty({
          ...this.baseModalSettings,
          ...settings,
          type: 'warning',
          text: message,
          buttons: buttonsArr.map(item => {
              return Noty.button(item.label, item.classList, () => {
                  warningModal.close()
                  item.callback && item.callback()
              })
          })
      })
      warningModal.show()
      return this
  }

  showModalSuccess(message, buttonsArr = [{ label: 'OK', classList: notification.successButtonClasses, callback: null }]) {
      const messageModal = new Noty({
          ...this.baseModalSettings,
          type: 'success',
          text: message,
          buttons: buttonsArr.map(item => {
              return Noty.button(item.label, item.classList, () => {
                  messageModal.close()
                  item.callback && item.callback()
              })
          })
      })
      messageModal.show()
      return this
  }

  showInfo(message, settings = null) {
      this.closeAll()

      const infoToast = new Noty({
          ...this.baseToastSettings,
          ...settings,
          type: 'info',
          text: message
      })
      infoToast.show()
      return this
  }

  showError(message, callback = null) {
      this.closeAll()

      const errorModal = new Noty({
          ...this.baseModalSettings,
          type: 'error',
          text: message,
          id: 'validator-message',
          buttons: [
              Noty.button('OK', this.dangerButtonClasses, () => {
                  errorModal.close()
                  callback && callback()
              })
          ]
      })
      errorModal.show()
      return this
  }

  showImportantMessage(message, callback = null) {
      this.closeAll()

      const messageModal = new Noty({
          ...this.baseModalSettings,
          type: 'info',
          text: message,
          buttons: [
              Noty.button('OK', this.basicButtonClasses, () => {
                  messageModal.close()
                  callback && callback()
              })
          ]
      })
      messageModal.show()
      return this
  }

  showConfirm(message, confirmCallback = null, cancelCallback = null, buttonLabels = { confirm: 'Yes', cancel: 'No' }) {
      this.closeAll()

      const confirmModal = new Noty({
          ...this.baseModalSettings,
          type: 'warning',
          text: message,
          buttons: [
              Noty.button(buttonLabels.confirm, this.warningButtonClasses, () => {
                  confirmModal.close()
                  confirmCallback && confirmCallback()
              }),
              Noty.button(buttonLabels.cancel, this.basicButtonClasses, () => {
                  confirmModal.close()
                  cancelCallback && cancelCallback()
              })
          ]
      })
      confirmModal.show()
      return this
  }

}