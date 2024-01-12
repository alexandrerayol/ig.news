import { SingInButton } from '../singInButton'
import { ActiveLink } from '../activeLink'

import styles from './styles.module.scss'


export function Header(){
    return(
        <header className={styles.header}>
            <div className={styles.header_container}>
                <div className={styles.nav_container}>
                    <img src='/imagens/ig.news-icon.svg' alt="ig.news icon" />
                    <nav>
                        <ActiveLink href={`/`} fixedClassName={styles.link_navigation} activeClassName={styles.activeLink}>Home</ActiveLink>
                        <ActiveLink href={`/posts`} fixedClassName={styles.link_navigation} activeClassName={styles.activeLink}>Posts</ActiveLink>
                    </nav>
                </div>
                <div>
                    <SingInButton />
                </div>
            </div>
        </header>
    )
}