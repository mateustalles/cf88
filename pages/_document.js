import React from 'react';
import Document, { Head, Main, NextScript, Html } from 'next/document';

// Import styled components ServerStyleSheet
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    // Step 1: Create an instance of ServerStyleSheet
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage

    // Step 2: Retrieve styles from components in the page
    ctx.renderPage = () => originalRenderPage({
      enhaceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
    });

    // Step 3: Extract the styles as <style> tags
    const styleTags = sheet.getStyleElement();

    const initialProps = await Document.getInitialProps(ctx)

    // Step 4: Pass styleTags as a prop
    return { ...initialProps, styleTags };
  }

  render() {
    return (
      <Html>
        <Head>
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
