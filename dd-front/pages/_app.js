import React from 'react';
import App from 'next/app';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import theme from '../modules/shared/utils/theme';
import { initialize } from '../modules/root';
import Layout from '../modules/shared/components/layout';

/**
 * Server side:
 * 1) app get initial props
 * 2) document get initial props
 * 3) app render
 * 4) page render
 * 5) document render
 */

/**
 * Client side:
 * 1) app get initial props
 * 2) app render
 * 3) page render
 */

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    ctx.reduxStore = await initialize({}, ctx);

    // prepare page props
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps, reduxState: ctx.reduxStore.getState() };
  }

  constructor(props) {
    super();
    this.reduxStore = initialize(props.reduxState);
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={this.reduxStore}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </ThemeProvider>
    );
  }
}

export default MyApp;
