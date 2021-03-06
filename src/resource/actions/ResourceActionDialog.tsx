import * as React from 'react';
import { useDispatch } from 'react-redux';
import { reduxForm, initialize } from 'redux-form';

import { StringField, TextField } from '@waldur/form';
import { DateField } from '@waldur/form/DateField';
import { MonacoField } from '@waldur/form/MonacoField';
import { translate } from '@waldur/i18n';
import { ActionDialog } from '@waldur/modal/ActionDialog';

import { ResourceAction } from './types';

interface ResourceActionDialogOwnProps {
  resolve: { action: ResourceAction; resource: any };
}

const FORM_ID = 'ResourceActionDialog';

const validateJSON = (value: string) => {
  try {
    JSON.parse(value);
  } catch (e) {
    return translate('This value is invalid JSON.');
  }
};

export const ResourceActionDialog = reduxForm<{}, ResourceActionDialogOwnProps>(
  { form: FORM_ID },
)(({ resolve: { action, resource }, handleSubmit, submitting, invalid }) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (action.getInitialValues) {
      const initialValues = action.getInitialValues();
      dispatch(initialize(FORM_ID, initialValues));
    }
  }, [dispatch, action, resource]);

  const callback = (formData) => action.submitForm(dispatch, formData);
  return (
    <ActionDialog
      title={action.title}
      submitLabel={translate('Submit')}
      onSubmit={handleSubmit(callback)}
      submitting={submitting}
      invalid={invalid}
    >
      {Object.keys(action.fields).map((key) => {
        const field = action.fields[key];
        if (field.type === 'string') {
          return (
            <StringField
              key={key}
              name={key}
              label={field.label}
              required={field.required}
              maxLength={field.maxlength}
              pattern={field?.pattern?.source}
            />
          );
        } else if (field.type === 'text') {
          return (
            <TextField
              key={key}
              name={key}
              label={field.label}
              required={field.required}
              maxLength={field.maxlength}
            />
          );
        } else if (field.type === 'json') {
          return (
            <MonacoField
              key={key}
              name={key}
              label={field.label}
              required={field.required}
              description={field.help_text}
              mode="json"
              validate={validateJSON}
              height={300}
            />
          );
        } else if (field.type === 'datetime') {
          return (
            <DateField
              key={key}
              name={key}
              label={field.label}
              required={field.required}
              description={field.help_text}
            />
          );
        }
      })}
    </ActionDialog>
  );
});
