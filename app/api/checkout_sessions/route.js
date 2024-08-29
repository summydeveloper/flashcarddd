import { formatDynamicAPIAccesses } from "next/dist/server/app-render/dynamic-rendering";
import { NextResponse } from "next/server";
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req){
   const formatAmountForStripe = (amount)=>{
      return Math.round(amount*100)
   }
 const params ={
    submit_type: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
         price_data :{
            curreny: 'usd',
            product_data:{
               name: 'Pro Subscription'
            },
            unit_amount:formatAmountForStripe(10),
            referring: {
               interval: 'month',
               interval_count: 1,
            }
         },
          
         quantity:1,

      }
    ],
    success_url:`${req.headers.origin}/results?sessio_id={CHECKOUT_SESSION_ID}`,
    cance_url:`${req.headers.origin}/results?sessio_id={CHECKOUT_SESSION_ID}`
 }
 const checkoutSession= await stripe.checkout.sessions.create(params)

 return NextResponse.json(checkoutSession,{
   status: 200
 })
}
