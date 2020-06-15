import Axios from 'axios';

export const PriceEstimatesService = {
  isHardLimit(billing_price_estimate) {
    return (
      billing_price_estimate.limit > 0 &&
      billing_price_estimate.limit === billing_price_estimate.threshold
    );
  },

  update(billing_price_estimate) {
    return Axios.put(billing_price_estimate.url, {
      threshold: billing_price_estimate.threshold,
      limit: billing_price_estimate.limit,
    });
  },
};
