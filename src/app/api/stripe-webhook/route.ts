/*
  Essa parte do código recebe informações(eventos) do stripe
  e baseado nessas informações nosso código toma decisões.
*/

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { saveSubscription } from "../_lib/managerSubscription";
import Stripe from "stripe";

const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const secret = process.env.ENDPOINT_SECRET || "";

export async function POST(req: Request) {
  try {
    //aguardamos o corpo da requisição
    const body = await req.text();
    
    //Assinatura do stripe para garantir que somente o stripe consiga interagir com este endpoint
    const signature = headers().get("stripe-signature");
    
    //construimos o evento baseado em três parametros, body signature and secret.
    const event: Stripe.Event = stripe.webhooks.constructEvent(body, signature, secret);
    

    const relevantEvents = new Set(
      [
        'checkout.session.completed',
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted',

      ]
    )

    //Tomada de decisão a partir do nome dos eventos.
    if(relevantEvents.has(event.type)){

      try{
        switch(event.type){
          case 'customer.subscription.created':
          case 'customer.subscription.updated': 
          case 'customer.subscription.deleted':
            const subscription = event.data.object as Stripe.Subscription;
            await saveSubscription(subscription.id, subscription.customer.toString())
            break


          case 'checkout.session.completed':
            const checkoutSession = event.data.object as Stripe.Checkout.Session;
            await saveSubscription( checkoutSession.subscription?.toString() || "", checkoutSession.customer?.toString() || "")
            break;

          default: 
            throw new Error('Tipo de evento não disponivel.')
        }
      }catch(error){
        NextResponse.json({error: 'Webhook handler failed'})
      }
    }

    //retorno caso o bloco try funcione.
    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    
    //retorno caso o bloco try não funcione.
    return NextResponse.json(
      {
        message: "Aconteceu algo de errado!",
        ok: false,
      },
      { status: 500 }
    );
  }
} 