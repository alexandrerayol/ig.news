import styles from './styles.module.scss'
import { SingInButton } from '../singInButton'
export function Header(){
    return(
        <header className={styles.header}>
            <div className={styles.header_container}>
                <div className={styles.nav_container}>
                    <img src='/imagens/ig.news-icon.svg' alt="ig.news icon" />
                    <nav>
                        <a href='/'>Home</a>
                        <a>Posts</a>
                    </nav>
                </div>
                <div>
                    <SingInButton />
                </div>
            </div>
        </header>
    )
}