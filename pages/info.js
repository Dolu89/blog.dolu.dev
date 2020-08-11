import Layout from '../components/Layout'
import matter from 'gray-matter'
import Head from 'next/head'

export default function Info({ frontmatter, title }) {
  return (
    <>
      <Head>
        
      </Head>

      <Layout
        pathname="info"
        bgColor={frontmatter.background_color}
        siteTitle={title}
      >
        <section className="info_blurb">
          <p>Ce site a pour but de vous faire découvrir ou redécouvrir une information sur Bitcoin par le biais de <span style={{ fontWeight: 'bold' }}>capsules</span></p>
          <p>Découvrez une nouvelle capsule tous les mercredi !</p>
          <p>Envie d'améliorer le site ou de créer une nouvelle capsule ? Le code source est disponible sur <a href="https://github.com/Dolu89/21bitcoin" target="_blank">github</a></p>
          <p>Fait avec ❤️ par <a href="https://twitter.com/Dolu_Web" target="_blank">Dolu</a>, ... vous ?</p>

          <p>D'humeur généreuse ? <a href="https://btcpay.lightningstream.io/apps/qUPTghdyTEqM5xUX9nHFkGWJpS2/pos" target="_blank">Faites un don</a></p>

        </section>
        <style jsx>{`
        .info_blurb {
          max-width: 800px;
          padding: 1.5rem 1.25rem;
        }
        .info_blurb p {
          color: #fff;
        }
        .info_blurb a {
          color: #f7931a;
        }

        @media (min-width: 768px) {
          .info_blurb {
            padding: 2rem;
          }
        }

        @media (min-width: 1440px) {
          .info_blurb {
            padding: 3rem;
          }
        }
      `}</style>
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  const content = await import(`../data/info.md`)
  const config = await import(`../data/config.json`)
  const data = matter(content.default)

  return {
    props: {
      title: config.title,
      frontmatter: data.data,
    },
  }
}
