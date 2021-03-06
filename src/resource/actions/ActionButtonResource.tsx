import Axios from 'axios';
import * as React from 'react';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import useBoolean from 'react-use/lib/useBoolean';

import { loadActions, buttonClick } from './action-utils-service';
import './ActionButtonResource.scss';
import { ResourceActionComponent } from './ResourceActionComponent';

interface ActionButtonResourceProps {
  url: string;
  disabled?: boolean;
  controller?: any;
}

async function loadData(url) {
  const response = await Axios.get(url);
  const resource = response.data;
  const rawActions = await loadActions(resource);
  const actions = {};
  for (const key in rawActions) {
    if (!rawActions[key].tab) {
      actions[key] = rawActions[key];
    }
  }
  return { resource, actions };
}

export const ActionButtonResource: React.FC<ActionButtonResourceProps> = (
  props,
) => {
  const { url } = props;

  const [{ loading, error, value }, getActions] = useAsyncFn(
    () => loadData(url),
    [url],
  );

  const [open, onToggle] = useBoolean(false);

  const loadActionsIfOpen = React.useCallback(() => {
    open && getActions();
  }, [open, getActions]);

  React.useEffect(loadActionsIfOpen, [open]);

  const triggerAction = (name: string, action: any) => {
    if (!action.enabled || action.pending) {
      return;
    }
    const controller = props.controller || {
      handleActionException: () => undefined,
      reInitResource: () => undefined,
    };
    return buttonClick(controller, value.resource, name, action);
  };

  return (
    <ResourceActionComponent
      open={open}
      disabled={props.disabled}
      loading={loading}
      error={error}
      actions={value?.actions}
      onToggle={onToggle}
      onSelect={triggerAction}
    />
  );
};
