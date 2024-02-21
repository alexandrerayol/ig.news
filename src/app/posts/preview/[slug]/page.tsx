import nextAuthOptions from "@/src/app/api/auth/[...nextauth]/authOptions";
import { createClient } from "@/prismicio"
import { RichTextField, asHTML, asText } from "@prismicio/client"
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import styles from './styles.module.scss';
import { PreviewSubscribeButton } from "@/src/components/previewSubscribeButton";

interface PreviewProps {
    params: { slug: string }
}

export default async function Preview({ params }: PreviewProps) {

    //validação caso o usuário esteja autenticado + inscrição ativa.
    const session = await getServerSession(nextAuthOptions)

    if (session && session.subscriptionStatus === 'active') {
        redirect(`/posts/${params.slug}`)
    }

    try {
        const prismic = createClient();
        const postResponse = await prismic.getByUID('post', params.slug);

        const postPreview = {
            slug: postResponse.uid,
            title: asText(postResponse.data.title),
            summary: asHTML(postResponse.data.content.splice(0,2) as RichTextField),
            updatedAt: new Date(postResponse.last_publication_date).toLocaleString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }

        console.log(postResponse.data.content)

        return (
            <article className={styles.container}>
                <div className={styles.postPreview}>
                    <h1>{postPreview.title}</h1>
                    <time>{postPreview.updatedAt}</time>
                    <div dangerouslySetInnerHTML={{__html: postPreview.summary }}></div>
                   <PreviewSubscribeButton/>
                </div>

            </article>
        )
    } catch {
        return (
            <h1>url inválida</h1>
        )
    }
}