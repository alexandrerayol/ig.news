'use client'
import { getStripeJs } from "@/src/services/stripe-js";
import { signIn, useSession} from "next-auth/react";
import { useRouter } from "next/navigation";

interface SubscribeButtonProps{
    priceId: string;
    isSubscribeActive?: string;
}
export function SubscribeButton({priceId}:SubscribeButtonProps){

    const session:any = useSession();
    const router = useRouter()

     async function handleSubscribe(){
        //valida autenticação / next auth
        if(session.status !== 'authenticated'){
            await signIn('github');
        }

        //valida inscrição ativa / next auth
        if(session.data.subscriptionStatus === 'active'){
            console.log(session.data?.subscriptionStatus)
            router.push('/posts')
        }
        //   /api/subscribe
        try{
            const url = new URL('/api/subscribe', process.env.BASE_URL)
            const response = await fetch(url.toString(), {
                method: 'POST',
            })
            const data = await response.json(); //recebe session
            const stripe = await getStripeJs() //executa a função loadStripe()

            await stripe?.redirectToCheckout({
                sessionId: data.sessionId
            });
        }
        catch(e){
            alert(e)
        }
    }

    return(
        <button onClick={handleSubscribe}>
            Subscribe now
        </button>
    )
} 