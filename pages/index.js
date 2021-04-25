import Head from 'next/head'
import { connectToDatabase } from '../util/mongodb'
import Verbatim from './stf/[sheet]/[id]/[verbatim]'

export default function Home({ isConnected }) {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

    <Verbatim />
    </div>
  )
};

export async function getServerSideProps(context) {
  const { client } = await connectToDatabase()

  const isConnected = await client.isConnected()

  return {
    props: { isConnected },
  }
}
