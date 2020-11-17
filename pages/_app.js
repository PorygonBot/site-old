import React from "react";
import { ThemeProvider } from "theme-ui";
import theme from "../components/theme";

function MyApp({ Component, pageProps }) {
    return (
        <div>
            <ThemeProvider theme={theme}>
                <Component {...pageProps} />
            </ThemeProvider>
        </div>
    );
}

export default MyApp;
