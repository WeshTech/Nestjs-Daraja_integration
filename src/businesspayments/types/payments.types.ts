//stk push response
export type StkPushResponse = {
  success: boolean;
  message: string;
  data: {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
  } | null;
};

//authorization response
export type AuthorizationResponse = {
  access_token: string;
  expires_in: string;
};

//pending transaction response
export type PendingPaymentResponse = {
  success: boolean;
  message: string;
  data: null;
};
