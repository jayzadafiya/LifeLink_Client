import Layout from "@/components/layout/layout";
import store from "@/store/store";
import "@/styles/globals.css";
import Head from "next/head";
import { Provider } from "react-redux";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
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
      </Provider>
    </>
  );
}
