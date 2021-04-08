import React from 'react'
import { KeyboardTimePicker } from '@material-ui/pickers'
import { ValidatorComponent } from 'react-material-ui-form-validator'

class KeyboardDatePickerValidatorElement extends ValidatorComponent {
  renderValidatorComponent() {
    const {
      error,
      errorMessages,
      validators,
      requiredError,
      helperText,
      validatorListener,
      withRequiredValidator,
      containerProps,
      ...rest
    } = this.props

    const { isValid } = this.state
    return (
      <KeyboardTimePicker
        {...rest}
        error={!isValid || error}
        helperText={(!isValid && this.getErrorMessage()) || helperText}
      />
    )
  }
}

export default KeyboardDatePickerValidatorElement
