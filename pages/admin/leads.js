/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { getLeads } from '@/models/leadsModel';
import { useRouter } from 'next/router';
import { useCurrentUser } from '@/hooks/index';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Head from 'next/head';
import dynamic from 'next/dynamic'

const LeadsTable = dynamic(() => import('@/components/LeadsTable'))
const Navbar = dynamic(() => import('@/components/Navbar'))

const ControlPanel = ({ data }) => {
  const router = useRouter();
  const [user] = useCurrentUser();

  useEffect(() => {
    if (!user || user.role !== 'admin') return router.push('/login');
  }, [user, router]);


  return (
    <Container>
      <Head>
        <title>Painel Administrativo</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
          integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
          crossOrigin="anonymous"
        />
      </Head>
      <Row>
        <Col lg={12}>
          <Row>
            <Navbar />
          </Row>
          <Row>
            <h1>Leads Captados</h1>
          </Row>
          <Row>
            <LeadsTable data={data} />
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export async function getStaticProps() {
  const leads = await getLeads();
  return {
    props: {
      data: leads,
    },
    revalidate: 1,
  }
}

export default ControlPanel;
