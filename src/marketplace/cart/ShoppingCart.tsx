import * as React from 'react';
import { connect, useSelector } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';

import { translate } from '@waldur/i18n';
import { getActiveFixedPricePaymentProfile } from '@waldur/invoices/details/utils';
import { BillingPeriod } from '@waldur/marketplace/common/BillingPeriod';
import { OrderItemResponse } from '@waldur/marketplace/orders/types';
import { getCustomer } from '@waldur/workspace/selectors';

import { BillingPeriod as BillingPeriodType } from '../types';

import './ShoppingCart.scss';
import { ShoppingCartItem } from './ShoppingCartItem';
import * as actions from './store/actions';
import { ToSForm } from './store/constants';
import {
  getMaxUnit,
  getItems,
  isRemovingItem,
  getTermsOfServiceIsVisible,
} from './store/selectors';
import { OuterState } from './types';

interface ShoppingCartProps {
  items: OrderItemResponse[];
  maxUnit: BillingPeriodType;
  removeItem(uuid: string, project: string): void;
  isRemovingItem: boolean;
  termsOfServiceIsVisible?: boolean;
}

const PureShoppingCart = (props: ShoppingCartProps) => {
  const customer = useSelector(getCustomer);
  const activeFixedPricePaymentProfile = getActiveFixedPricePaymentProfile(
    customer.payment_profiles,
  );
  return props.items.length > 0 ? (
    <div className="table-responsive shopping-cart">
      <table className="table">
        <thead>
          <tr>
            <th>{translate('Item')}</th>
            {!activeFixedPricePaymentProfile ? (
              <th className="text-center">
                <BillingPeriod unit={props.maxUnit} />
              </th>
            ) : null}
            <th className="text-center">{translate('Actions')}</th>
            {props.termsOfServiceIsVisible && (
              <th className="text-center">{translate('Agree with ToS')}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {props.items.map((item, index) => (
            <ShoppingCartItem
              key={index}
              item={item}
              onRemove={() => props.removeItem(item.uuid, item.project)}
              isRemovingItem={props.isRemovingItem}
              termsOfServiceIsVisible={props.termsOfServiceIsVisible}
            />
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="text-center">
      {translate('Shopping cart is empty. You should add items to cart first.')}
    </p>
  );
};

const mapStateToProps = (state: OuterState) => ({
  items: getItems(state),
  maxUnit: getMaxUnit(state),
  isRemovingItem: isRemovingItem(state),
  termsOfServiceIsVisible: getTermsOfServiceIsVisible(state),
});

const mapDispatchToProps = {
  removeItem: actions.removeItemRequest,
};

interface TermsOfServiceFormData {
  [uuid: string]: boolean;
}

const enhancer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm<TermsOfServiceFormData, ShoppingCartProps>({ form: ToSForm }),
);

export const ShoppingCart = enhancer(PureShoppingCart);
