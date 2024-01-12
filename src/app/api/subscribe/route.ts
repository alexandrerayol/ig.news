import { stripe } from "@/src/services/stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../auth/[...nextauth]/route";
import {collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/src/services/firebase";


export async function POST(req: NextApiRequest, res: NextApiResponse){
    
    if(req.method === 'POST'){

        //pega informações sobre o usuário logado
        const session = await getServerSession(nextAuthOptions);

        let firebaseUserId = ''
        let stripeCustomerid  = ''

        //consulta no bd para saber se o usuário possui customerid
        const userRef = query(collection(db, "users"), where("email", "==", session?.user?.email))
        const querySnapshot = await getDocs(userRef);

        querySnapshot.forEach((doc) => {
            firebaseUserId = doc.id;
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

            stripeCustomerid = stripeCustomer.id;
        }
        
        
        //criação de sessão
        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomerid,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
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
    }else{
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed')
    }
}