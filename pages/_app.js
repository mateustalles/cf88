import '../styles/globals.css'
import App from 'next/app';
import CF88Provider from '../context/CF88Context';

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <CF88Provider>
        <Component {...pageProps} />
      </CF88Provider>
    )
  }
}
