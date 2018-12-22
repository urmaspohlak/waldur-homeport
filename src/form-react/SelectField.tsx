import * as React from 'react';
import Select, {ReactSelectProps} from 'react-select';

import { FormField } from './types';

export interface SelectFieldProps extends ReactSelectProps, FormField {
  name?: string;
}

export const SelectField = (props: SelectFieldProps) => {
  const {input, ...rest} = props;
  return (
    <Select
      {...rest}
      name={input.name}
      value={input.value}
      onChange={value => input.onChange(value)}
      // See also: https://github.com/erikras/redux-form/issues/1185
      onBlur={() => input.onBlur(input.value)}
    />
  );
};
