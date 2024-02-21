import { createClient } from "@/prismicio";
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

    if(!session || session.subscriptionStatus !== 'active'){
        redirect(`/posts/preview/${params.slug}`)
    }


    //O bloco try Catch serve para caso a requisição de post retorne um erro ou não exista.
    //dessa forma, impedimos que qualquer usuário fique interagindo com as rotas dinamicas.
    try{
        const prismic = createClient()
        const postResponse = await prismic.getByUID('post', params.slug)

        const post = {
            slug: postResponse.uid,
            title: asText(postResponse.data.title),
            content: asHTML(postResponse.data.content),
            updatedAt: new Date(postResponse.last_publication_date).toLocaleDateString('pt-BR', {day: "2-digit", month: 'long', year: 'numeric'})
        }

        return(
            <article className={styles.container}>
                <h1 className={styles.title}>{post.title}</h1>
                <time>{post.updatedAt}</time>
                <div className={styles.content} dangerouslySetInnerHTML={{__html: post.content}}></div>
            </article>
        )
    }catch{
        return(
            <div><h1>url inválida</h1></div>
        )
    }
}