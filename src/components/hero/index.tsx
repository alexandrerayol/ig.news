import styles from './styles.module.scss'
import { SubscribeButton } from '../subscribeButton';
import { stripe } from '@/src/services/stripe';

export async function Hero(){
/*     const baseurl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://ig-news-psi-ruby.vercel.app'
    
    const response = await fetch(`${baseurl}/api/product`, {
        next: {
            revalidate: 86400 //24h
        }
    })
    const product = await response.json(); */

    const price = await stripe.prices.retrieve(
        'price_1ODG4DCWzqMkMSNRGKyvn0me'
    )
    const product = {
        priceId: price.id,
        amount: new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format((price.unit_amount as number / 100)),
    }

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
