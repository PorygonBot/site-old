import { useEffect } from 'react';
import { exchangeToken, saveTokens } from "../src/oauth";
import {useRouter} from 'next/router'

function Callback(props) {
    const router = useRouter();

    useEffect(async () => {
        if (props.code === undefined) {await router.push("/");}
        const data = await exchangeToken(props.code);
        if (data !== 400) {
            saveTokens(data.access_token, data.refresh_token);
        }
        await router.push("/");
    });

    return <p>Redirecting you to home...</p>;
}

Callback.getInitialProps = async (ctx) => {
    const code = ctx.query.code

    return {
        code: code
    }
}

export default Callback;