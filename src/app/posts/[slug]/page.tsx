import { createClient } from "@/src/prismicio";
import { asText, asHTML } from "@prismicio/client";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import styles from './styles.module.scss'


interface PostProps {
    params: {slug: string;}
}

export default async function Post({ params }:PostProps){

    const session = await getServerSession(nextAuthOptions) //auterado em api/auth/[...nextauth]/route.ts
    //session.subscribeStatus active or undefined

    //validação usuário não autenticado
    if(!session){
         redirect('/')
    }
    
    //validação usuário autenticado porém sem inscrição ativa.
    if(session?.subscriptionStatus !== 'active'){
        redirect('/preview')
    }

    try{
        const prismic = createClient()
        const postResponse = (await prismic.getByUID('post', params.slug))

        const post = {
            slug: postResponse.uid,
            title: asText(postResponse.data.title),
            content: asHTML(postResponse.data.content),
            updatedAt: new Date(postResponse.last_publication_date).toLocaleDateString('pt-BR', {day: "2-digit", month: 'long', year: 'numeric'})
        }

        return(
            <div className={styles.container}>
                <h1 className={styles.title}>{post.title}</h1>
                <time>{post.updatedAt}</time>
                <div className={styles.content} dangerouslySetInnerHTML={{__html: post.content}}></div>
            </div>
        )
    }catch{
        return(
            <div><h1>url inválida</h1></div>
        )
    }
}