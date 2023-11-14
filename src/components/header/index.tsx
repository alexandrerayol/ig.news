import styles from './styles.module.scss'
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
                <div className={styles.button_container}>
                    <button type='button'>
                        <img src="/imagens/Github-icon.svg" alt="github icon" />
                        <span>Sing in with GitHub</span>
                    </button>
                </div>
            </div>
        </header>
    )
}