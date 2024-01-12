import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/src/services/firebase";
import { stripe } from "@/src/services/stripe";


export async function saveSubscription(
    subscriptionId: string,
    customerId: string
) {

    //faz uma query no bd para capturar o id do documento que corresponde ao customer_id
    const userRef = query(collection(db, "users"), where("stripe_customer_id", "==", customerId))
    const querySnapshot = await getDocs(userRef);

    let documentId = ""
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const subscriptionData = {
        id: subscription.id,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id
    }

    //tratamento de erro para verificar se o querysnapshot é válido
    if(querySnapshot.empty){
        throw new Error('querysnapshot is empty')
    }else{
        querySnapshot.forEach((doc) => {
            documentId = doc.id;
        })
    
        await updateDoc(doc(db, "users", documentId), {
            stripe_subscription_data: subscriptionData
        })
    }
}