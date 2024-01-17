'use client'
import styles from './styles.module.scss'
import { useRouter } from "next/navigation"

export function PreviewSubscribeButton(){
    const router = useRouter()            

    return(
        <button className={styles.subscribeNow} type="button" onClick={ () => {
            router.push('/')
        }}>
            Wanna continue reading?
            <strong> Subscribe now 🤗</strong>
        </button>
    )
}