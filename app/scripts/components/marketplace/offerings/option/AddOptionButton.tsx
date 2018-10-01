import * as React from 'react';

import { withTranslation } from '@waldur/i18n';

export const AddOptionButton = withTranslation(props => (
  <button
    type="button"
    className="btn btn-default"
    onClick={props.onClick}>
    <i className="fa fa-plus"/>
    {' '}
    {props.translate('Add option')}
  </button>
));
