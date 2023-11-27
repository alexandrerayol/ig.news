import { stripe } from "@/src/services/stripe";
export async function GET(){
    const price = await stripe.prices.retrieve(
        'price_1ODG4DCWzqMkMSNRGKyvn0me'
    )
    const product = {
        priceId: price.id,
        amount: new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format((price.unit_amount as number / 100)),
    }

    return Response.json(product);
}