import "../styles/globals.css";
import type { AppProps } from "next/app";
import "leaflet/dist/leaflet.css";
import { Provider } from "react-redux";
import store from "../redux/store";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../src/theme";
import MainLayout from "../components/Layouts/MainLayout";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </Provider>
    </ChakraProvider>
  );
}
