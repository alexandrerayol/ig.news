import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { saveSubscription } from "../_lib/managerSubscription";
import Stripe from "stripe";

const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const secret = process.env.ENDPOINT_SECRET || "";

export async function POST(req: Request) {
    //recebemos o corpo da requisição
    const body = await req.text();

    //Assinatura do stripe para garantir que somente o stripe consiga interagir com este endpoint
    const signature = headers().get("stripe-signature");

    try {
        
        if (!signature || !secret) {
            throw new Error('Signature or Secret Key invalid')
        }

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

        if (relevantEvents.has(event.type)) {

            try {
                switch (event.type) {
                    case 'customer.subscription.created':
                    case 'customer.subscription.updated':
                    case 'customer.subscription.deleted':
                        const subscription = event.data.object as Stripe.Subscription;
                        await saveSubscription(subscription.id, subscription.customer.toString())
                        break


                    case 'checkout.session.completed':
                        const checkoutSession = event.data.object as Stripe.Checkout.Session;
                        await saveSubscription(checkoutSession.subscription?.toString() as string, checkoutSession.customer?.toString() as string)
                        break;

                    default:
                        throw new Error('Tipo de evento não disponivel.')
                }
            } catch (error) {
                NextResponse.json({ error: 'Webhook handler failed', message: error })
            }
        }
    } catch (error) {
        //retorno caso o bloco try não funcione.
        return NextResponse.json(
            {
                message: error,
                ok: false,
            },
            { status: 500 }
        );
    }

    //retorno padrão
    return NextResponse.json({ received: true });


}