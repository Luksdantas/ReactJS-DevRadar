import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/pages/Home.module.css'

import { api } from '../services/api'
import { DevForm } from '../components/DevForm'
import { DevItem } from '../components/DevItem'

interface Devs {
  id: number;
  avatar_url: string;
  name: string;
  techs: [string]
  github_username: string
  bio: string;
}
export default function Home({ foundDevs }) {
  const [devs, setDevs] = useState(foundDevs)

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs')

      setDevs(response.data)
    }

    loadDevs()
  }, [])

  async function handleAddDev(data) {
    const response = await api.post('/devs', data)
    setDevs([...devs, response.data])
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>DevRadar</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleAddDev} />
      </aside>

      <main>
        <ul>
          {devs.map((dev: Devs) => (
            <DevItem key={dev.id} dev={dev} />
          ))}

        </ul>
      </main>
    </div>
  )
}

Home.getInitialProps = async () => {
  const response = await api.get('/devs').catch(err => {
    return {data: []}
  });
  return { foundDevs: response.data }
}
