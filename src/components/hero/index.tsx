import styles from './styles.module.scss'
import { SubscribeButton } from '../subscribeButton';

export async function Hero(){
    const response = await fetch("http://localhost:3000/api/product", {
        next: {
            revalidate: 86400 //24h
        }
    })
    const product = await response.json();

    return(
        <main className={styles.main}>
            <div className={styles.main_content}>
                <span>👏 Hey, welcome</span>
                <h1>News about the <strong>React</strong> world</h1>
                <p>
                    Get acess to all the publications
                    <br />
                    <strong>
                        for {product.amount} month
                    </strong>
                    
                </p>
                
                <SubscribeButton priceId={product.priceId}/>
            </div>
            <div className={styles.main_image}>
                <img src="/imagens/main-image.svg" alt="illustration of girl coding in react"/>
            </div>
        </main>
    )
}
