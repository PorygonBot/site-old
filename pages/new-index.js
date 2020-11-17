import {React} from "react";
import {getUser, getTokensForBrowser} from '../public/oauth'
import {Button} from 'theme-ui'

const OAUTH2_URL = "https://discord.com/api/oauth2/authorize?client_id=776287149867270145&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fcallback&response_type=code&scope=identify%20guilds";

export default function Home(props) {
    const user = props.user || undefined;

    let userTags;
    if (user) {
        userTags = (
            <div>
                <h3>Welcome, {user.name}!</h3>
            </div>
        );
    }
    else {
        userTags = (<div><h3>You are not logged in!</h3></div>);
    }

    return (
        <div>
            <a href={OAUTH2_URL}><Button>Login</Button></a>

            {userTags}
        </div>
    );
}

Home.initialProps = async (ctx) => {
    const tokens = getTokensForBrowser();
    const user = await getUser(tokens.token);
    return {
        user: user
    }
}
