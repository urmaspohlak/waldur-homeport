import * as React from 'react';

import { FormContainer, StringField } from '@waldur/form';
import { translate } from '@waldur/i18n';

export const RancherPluginOptionsForm = ({ container }) => {
  return (
    <FormContainer {...container}>
      <StringField
        name="flavors_regex"
        label={translate('Flavors regex')}
        description={translate('Regular expression to limit flavors list')}
      />
    </FormContainer>
  );
};
