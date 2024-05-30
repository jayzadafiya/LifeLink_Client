import Head from "next/head";
import Layout from "../components/layout/layout";
import store from "../store/store";
import { Provider } from "react-redux";
import "../styles/globals.css";
import "../styles/style.css";
import { AppProps } from "next/app";
import { SocketProvider } from "../context/SocketContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <SocketProvider>
          <Layout>
            <Head>
              <title>Life Link</title>
              <meta name="description" content="Doctor Appointment " />
              <meta
                name="viewport"
                content="initial-scale=1.0, width=device-width"
              />
            </Head>
            <Component {...pageProps} />;
          </Layout>
        </SocketProvider>
      </Provider>
    </>
  );
}
