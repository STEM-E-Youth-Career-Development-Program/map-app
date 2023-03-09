import React, { useRef } from 'react';
import { useFormikContext } from 'formik';

import AppTextInput from './AppTextInput';
import Label from './Label';

function AppFormField({ label, name, ...otherProps }) {
  const inputRef = useRef(null);
  const { setFieldTouched, setFieldValue, values } = useFormikContext();

  return (
    <>
      <Label label={label} onPress={() => inputRef.current.focus()} />
      <AppTextInput
        myRef={inputRef}
        onBlur={() => setFieldTouched(name)}
        onChangeText={(text) => setFieldValue(name, text)}
        value={values[name]}
        {...otherProps}
      />
    </>
  );
}

export default AppFormField;
