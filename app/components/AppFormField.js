import React, { useRef } from 'react';
import { useFormikContext } from 'formik';

import AppTextInput from './AppTextInput';
import ErrorMessage from './ErrorMessage';
import Label from './Label';

function AppFormField({ label, name, isRequired, icon, ...otherProps }) {
  const inputRef = useRef(null);
  const { errors, setFieldTouched, setFieldValue, touched, values } =
    useFormikContext();

  return (
    <>
      <Label label={label} onPress={() => inputRef.current.focus()} isRequired={isRequired} />
      <AppTextInput
        myRef={inputRef}
        onBlur={() => setFieldTouched(name)}
        onChangeText={(text) => setFieldValue(name, text)}
        value={values[name]}
        icon={icon}
        {...otherProps}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default AppFormField;
