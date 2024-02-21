'use client' //cliente-side-rendering
import styles from './styles.module.scss'
import { signIn, useSession, signOut } from 'next-auth/react'

export function SingInButton(){

    const { data: session, status } = useSession();

    return status === "authenticated"? (
        <button
        type='button'
        className={styles.singInButton}
        onClick={ () =>  signOut()}
        >
        <img src="/imagens/Github-logged-icon.svg" alt="github icon" />
        <span>{session.user?.name}</span>
        <img src="/imagens/close-icon.svg" alt="close icon" />
        </button>
    ) 
    :
     (
        <button
        type='button'
        className={styles.singInButton}
        onClick={ () => signIn('github')}
        >
        <img src="/imagens/Github-logout-icon.svg" alt="github icon" />
        <span>Sing in with GitHub</span>
        </button>
    )
}