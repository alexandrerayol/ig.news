import { stripe } from "@/src/services/stripe";
import { getServerSession } from "next-auth";
import  nextAuthOptions  from "../auth/[...nextauth]/authOptions";
import {collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/src/services/firebase";


export async function POST(){

        //pega informações sobre o usuário logado
        const session = await getServerSession(nextAuthOptions);

        let firebaseUserId = ''
        let stripeCustomerid  = ''

        //consulta no bd para saber se o usuário possui customerid
        const userRef = query(collection(db, "users"), where("email", "==", session?.user?.email))
        const querySnapshot = await getDocs(userRef);

        querySnapshot.forEach((doc) => {
            firebaseUserId = doc.id; //captura o id do documento referente ao email autenticado no momento.
            stripeCustomerid = doc.data().stripe_customer_id;
          });

        //se não possuir customerid no bd é criado um novo customer no stripe e no bd.
        if(!stripeCustomerid){
            const stripeCustomer = await stripe.customers.create({
                email: session?.user?.email as string,
                name: session?.user?.name as string
            })

            await updateDoc(doc(db, "users", firebaseUserId), {
                stripe_customer_id: stripeCustomer.id
            })

            //stripeCustomerid deixa de ser vazio para ter um valor. 
            stripeCustomerid = stripeCustomer.id;
        }
        
        
        //criação de sessão
        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomerid,
            payment_method_types: ['card'],
            line_items: [{
                price: 'price_1ODG4DCWzqMkMSNRGKyvn0me',
                quantity: 1
            }],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL
        })


        return Response.json({sessionId: stripeCheckoutSession.id})
}