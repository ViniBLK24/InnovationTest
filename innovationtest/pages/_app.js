import '../styles/buttonfilter.css';
import '../styles/global.css';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Innovation Brindes</title>
            </Head>
            <Component {...pageProps} />
        </>
    );
}