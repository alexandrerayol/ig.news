import type { Metadata } from 'next'
import { Roboto, Pacifico} from 'next/font/google'
import { NextAuthSessionProvider } from '../providers/sessionProvider';

import '../styles/globals.scss'
import { Header } from '../components/header';

const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"]
});

export const pacifico = Pacifico({
  weight: ["400"],
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: 'ig.news',
  description: 'Inscreva-se para ler nossos posts',
}

export default function RootLayout({children,}:{children: React.ReactNode}) {

  return (
    <html lang="pt-br">
      <link rel="icon" href="imagens/favicon.png" type="image/png"/>

      <body className={roboto.className}>
        <NextAuthSessionProvider>
          <Header/>
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}