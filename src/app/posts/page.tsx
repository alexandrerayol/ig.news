import { createClient } from "@/prismicio"
import { asText,  } from "@prismicio/client"
import Link from "next/link"

import styles from './styles.module.scss';
import { Suspense } from "react";

export default async function Posts(){
    //Busca de dados
    const prismic = createClient()
    const postsResponse = await prismic.getAllByType("post") 
    //trocar por prismic.getAllbyType("summary")

    const posts = postsResponse.map( post => (
        {
            slug: post.uid,
            title: asText(post.data.title), //asText converte o titulo de forma direta para string
            summary: '', 
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year:  'numeric'
                    })
        }
    ))

    return(
        <main className={styles.container}>
            <div className={styles.postsList}>
                {
                    posts.map( post => (
                        <Suspense fallback={<p>Carregando post...</p>} key={post.slug}>
                        <Link className={styles.link} href={`/posts/${post.slug}`}>
                            <time>{post.updatedAt}</time>
                            <span className={styles.title}>{post.title}</span>
                            <p>{post.summary}</p>
                        </Link>
                        </Suspense> 
                    ) )
                }
            </div>
        </main>
    )
}