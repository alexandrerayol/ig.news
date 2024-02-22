import styles from './styles.module.scss'
import { SubscribeButton } from '../subscribeButton';
import { stripe } from '@/src/services/stripe';


async function getProduct(){
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

    return product
}


export async function Hero(){

    const product = await getProduct()
    
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
