import Cookie from "js-cookie";
import axios from "axios";

async function exchangeToken(code) {
    const URL = `code=${code}&grant_type=authorization_code&client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_SECRET}&redirect_uri=${process.env.NEXT_PUBLIC_URL_DISCORD_REDIRECT_URI}&scope=guilds%20identify`;
    return await axios
        .post("https://discordapp.com/api/v6/oauth2/token", URL, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                if (error.response.status.toString() === "400") {
                    return error.response.status;
                }
            }
        );
}

async function refreshToken(refreshToken) {
    console.log("yuh yuh")
    const res = await axios
        .post(
            "https://discordapp.com/api/oauth2/token",
            `refresh_token=${refreshToken}&grant_type=refresh_token&client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_SECRET}&redirect_uri=${process.env.NEXT_PUBLIC_URL_DISCORD_REDIRECT_URI}&scope=guilds%20identify`,
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .catch(console.error);
    return res.data;
}

function saveTokens(token, refreshToken) {
    Cookie.set("token", token);
    Cookie.set("refreshToken", refreshToken);
}

function deleteTokens() {
    Cookie.remove("token");
    Cookie.remove("refreshToken");
}

function getTokensForBrowser() {
    let token = Cookie.getJSON("token");
    let refreshToken = Cookie.getJSON("refreshToken");
    return {
        token: token,
        refreshToken: refreshToken,
    };
}

function getTokensForServer(req) {
    let token = "";
    let refreshToken = "";

    if (req.headers.cookie) {
        const cookieToken = req.headers.cookie
            .split(";")
            .find((c) => c.trim().startsWith("token="));
        const cookieRefreshToken = req.headers.cookie
            .split(";")
            .find((c) => c.trim().startsWith("refreshToken="));

        token = cookieToken.split("=")[1];
        refreshToken = cookieRefreshToken.split("=")[1];
    }

    return {
        token: token,
        refreshToken: refreshToken,
    };
}

async function getUser(tokens) {
    const accessToken = tokens.token;
    const URL = "https://discord.com/api/v6/users/@me";
    if (!accessToken) return null;
    const res = await axios.get(URL, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });
    const data = res.data;

    if (res.status === 401) {
        const { access_token } = await refreshToken(tokens.refreshToken);
        return await getUser(access_token);
    }

    return data;
}

async function getUserGuilds(accessToken) {
    const URL = "https://discord.com/api/v6/users/@me/guilds";
    if (!accessToken) return null;
    const res = await axios.get(URL, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });

    return res.data;
}

export {
    exchangeToken,
    refreshToken,
    saveTokens,
    deleteTokens,
    getTokensForBrowser,
    getTokensForServer,
    getUser,
    getUserGuilds,
};
