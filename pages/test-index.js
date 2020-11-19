import { React } from "react";
import { useRouter } from "next/router";
import Image from 'next/image'
import {
    getUser,
    deleteTokens,
    getTokensForServer,
    getUserGuilds
} from "../src/oauth";
import { Button } from "theme-ui";

const LOGIN_OAUTH2_URL = `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_URL_DISCORD_REDIRECT_URI}&response_type=code&scope=identify%20guilds`

function Home({user, guilds}) {
    const router = useRouter();

    const logout = () => {
        deleteTokens();
        router.reload();
    };

    const AVATAR_URL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg`;
    console.log(AVATAR_URL)

    if (user) {
        const guildNames = guilds.map((guild) => <li key="">{guild.name}</li>);
        return (
            <div>
                <h3>Welcome, {user.username}!</h3>
                <Image src={AVATAR_URL} width={200} height={200} />
                <Button onClick={logout}>Logout</Button>
                <h4>Your guilds are as follows: </h4>
                <ul>{guildNames}</ul>
            </div>
        );
    }

    return (
        <div>
            <h3>You are not logged in!</h3>
            <a href={process.env.LOGIN_OAUTH2_URL}>
                <Button>Login</Button>
            </a>
        </div>
    );
}

export async function getServerSideProps(ctx) {
    const tokens = getTokensForServer(ctx.req);
    const user = await getUser(tokens);
    const guilds = await getUserGuilds(tokens.token);
    return {
        props: {
            user: user,
            guilds: guilds,
            avatar: avatar
        },
    };
}

export default Home;
