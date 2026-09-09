import type { CreatePaymentInput,CreatedPayment,PaymentProvider } from './payment-provider';
export class StripePaymentProvider implements PaymentProvider{
  constructor(private secretKey:string){}
  async createPayment(input:CreatePaymentInput,idempotencyKey:string):Promise<CreatedPayment>{
    const body=new URLSearchParams({amount:String(input.amount),currency:input.currency.toLowerCase(),'metadata[order_id]':input.orderId,'metadata[user_id]':input.userId,receipt_email:input.email,automatic_payment_methods:'{"enabled":true}'});
    const response=await fetch('https://api.stripe.com/v1/payment_intents',{method:'POST',headers:{Authorization:`Bearer ${this.secretKey}`,'Content-Type':'application/x-www-form-urlencoded','Idempotency-Key':idempotencyKey},body});
    if(!response.ok)throw new Error('PAYMENT_PROVIDER_ERROR');
    const data=await response.json() as {id:string;client_secret:string}; return {id:data.id,clientSecret:data.client_secret};
  }
}
