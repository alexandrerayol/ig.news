import GithubProvider from "next-auth/providers/github"
import {collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/src/services/firebase";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";

const nextAuthOptions: NextAuthOptions ={
    secret: process.env.AUTH_SECRET,
    providers: [
        GithubProvider({
          clientId: process.env.GITHUB_CLIENT_ID as string,
          clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
          }), 
      ],
      callbacks: {
        //Função para alterar as propriedades de retorno de useSession(), getSession() e getServerSession()
        //buscamos no banco de dados a propriedade status de inscrição
        //caso não exista ou retorne um erro, a propriedade session padrão é retornada e o status é null
        //no componente subscribeButton está dando erro de tipos mas está funcinando.
        async session({session}) {

            try{
                const userRef = query(collection(db, 'users'), where('email', '==', session.user?.email))
                const querySnapshot = await getDocs(userRef)
                let activeSubscription = '';
    
                querySnapshot.forEach( (doc) => {
                    activeSubscription = doc.data().stripe_subscription_data?.status
                } )
    
                return {
                    ...session,
                    subscriptionStatus: activeSubscription
                }
            }catch{
                return {
                    ...session,
                    subscriptionStatus : ''
                }
            }
        },


        async signIn({user}){
            const userRef = query(collection(db, "users"), where("email", "==", user.email));
            const querySnapshot = await getDocs(userRef);

            if(!querySnapshot.empty){
                return true;
            }else{
                const docRef = await addDoc(collection(db, "users"), {
                    email: user.email
                })
                return true;
            }
            
        },
      },
}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST, nextAuthOptions }