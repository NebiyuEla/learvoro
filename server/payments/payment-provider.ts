export type CreatePaymentInput={amount:number;currency:string;orderId:string;userId:string;email:string};
export type CreatedPayment={id:string;clientSecret:string};
export interface PaymentProvider{createPayment(input:CreatePaymentInput,idempotencyKey:string):Promise<CreatedPayment>}
