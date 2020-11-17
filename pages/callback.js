import {React, useEffect} from 'react';
import { exchangeToken, saveTokens } from "../public/oauth";
import {useRouter} from 'next/router'

function Callback(props) {
    const router = useRouter();
    
    useEffect(async () => {
        if (props.code === undefined) await router.push("/"); stop();
        const data = await exchangeToken(props.code);
        if (data !== 400) {
            saveTokens(data.access_token, data.refresh_token);
        }
        await router.push("/");
    });

    return null;
}

Callback.getInitialProps = async (ctx) => {
    return {
        code: ctx.query.code
    }
}

export default Callback;