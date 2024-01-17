'use client' //cliente-side-rendering
import { getStripeJs } from "@/src/services/stripe-js";
import { signIn, useSession} from "next-auth/react";
import { useRouter } from "next/navigation";

interface SubscribeButtonProps{
    priceId: string;
    isSubscribeActive?: string;
}
export function SubscribeButton({priceId}:SubscribeButtonProps){

    const session = useSession();
    const router = useRouter()

     async function handleSubscribe(){
        if(session.status !== 'authenticated'){
            await signIn('github');
            return;
        }

        if(session.data.subscriptionStatus === 'active'){
            console.log(session.data?.subscriptionStatus)
            router.push('/posts')
            return;
        }
        
        try{
            const response = await fetch('http://localhost:3000/api/subscribe', {
                method: 'POST',
            })
            const data = await response.json();
            const stripe = await getStripeJs()
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