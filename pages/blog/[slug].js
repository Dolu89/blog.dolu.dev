import * as React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
const glob = require('glob')

import Layout from '../../components/Layout'
import { reformatDate, getPosts, getNextPostSlug, getPreviousPostSlug } from '../../utils/utils'

export default function BlogTemplate({ frontmatter, markdownBody, siteTitle, nextPost, previousPost }) {

  /*
   ** Odd fix to get build to run
   ** It seems like on first go the props
   ** are undefined — could be a Next bug?
   */

  if (!frontmatter) return <></>

  return (
    <Layout siteTitle={siteTitle}>

      <Head>
        <title>{frontmatter.title}</title>
        <meta name="Description" content={frontmatter.description}></meta>
      </Head>

      <article className="blog">
        <figure className="blog__hero">
          <iframe src={`${frontmatter.slides}/embed`} className="slide__viewer" scrolling="no" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
        </figure>

        <div className="blog__info">
          <h1>{frontmatter.title}</h1>
          <h3>{reformatDate(frontmatter.date)}</h3>
        </div>
        <div className="blog__body">
          <ReactMarkdown source={markdownBody} />
        </div>
        <h2 className="blog__footer">Capsule proposée par {frontmatter.author}</h2>
        <div className="blog__navigation">
          {previousPost && (<Link href={`/blog/[slug]`} as={`/blog/${previousPost}`}><a className="navigation"><i className="fas fa-chevron-left mr-5"></i> <span>Capsule précédente</span></a></Link>)}
          {nextPost && (<><span>&nbsp;</span><Link href={`/blog/[slug]`} as={`/blog/${nextPost}`}><a className="navigation"><span className="mr-5">Capsule suivante</span> <i className="fas fa-chevron-right"></i></a></Link></>)}
        </div>
      </article>
      <style jsx>
        {`
          .blog h1 {
            margin-bottom: 0.7rem;
          }

          .blog__hero {
            min-height: 300px;
            height: 60vh;
            width: 100%;
            margin: 0;
            overflow: hidden;
          }
          .blog__hero .slide__viewer {
            margin-bottom: 0;
            object-fit: cover;
            min-height: 100%;
            min-width: 100%;
            object-position: center;
          }
          .blog__navigation {
            display: flex;
            justify-content: space-between;
            margin: 15px 15px
          }
          .blog__navigation .navigation {
            display: flex;
            align-items: center;
          }
          .blog__navigation .navigation .mr-5 {
            margin-right: 5px;
          }

          .blog__info {
            padding: 1.5rem 1.25rem;
            width: 100%;
            max-width: 768px;
            margin: 0 auto;
          }
          .blog__info h1 {
            margin-bottom: 0.66rem;
          }
          .blog__info h3 {
            margin-bottom: 0;
          }

          .blog__body {
            width: 100%;
            padding: 0 1.25rem;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .blog__body a {
            padding-bottom: 1.5rem;
          }
          .blog__body:last-child {
            margin-bottom: 0;
          }
          .blog__body h1 h2 h3 h4 h5 h6 p {
            font-weight: normal;
          }
          .blog__body p {
            color: inherit;
          }
          .blog__body ul {
            list-style: initial;
          }
          .blog__body ul ol {
            margin-left: 1.25rem;
            margin-bottom: 1.25rem;
            padding-left: 1.45rem;
          }

          .blog__footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 1.25rem;
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
          }
          .blog__footer h2 {
            margin-bottom: 0;
          }
          .blog__footer a {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .blog__footer a svg {
            width: 20px;
          }

          @media (min-width: 768px) {
            .blog {
              display: flex;
              flex-direction: column;
            }
            .blog__body {
              max-width: 800px;
              padding: 0 2rem;
            }
            .blog__body span {
              width: 100%;
              margin: 1.5rem auto;
            }
            .blog__body ul ol {
              margin-left: 1.5rem;
              margin-bottom: 1.5rem;
            }
            .blog__hero {
              min-height: 600px;
              height: 75vh;
            }
            .blog__info {
              text-align: center;
              padding: 2rem 0;
            }
            .blog__info h1 {
              max-width: 500px;
              margin: 0 auto 0.66rem auto;
            }
            .blog__footer {
              padding: 2.25rem;
            }
          }

          @media (min-width: 1440px) {
            .blog__hero {
              height: 70vh;
            }
            .blog__info {
              padding: 3rem 0;
            }
            .blog__footer {
              padding: 2rem 2rem 3rem 2rem;
            }
          }
        `}
      </style>
    </Layout>
  )
}

export async function getStaticProps({ ...ctx }) {
  const { slug } = ctx.params
  const content = await import(`../../posts/${slug}.md`)
  const config = await import(`../../data/config.json`)
  const data = matter(content.default)

  const posts = getPosts(require.context('../../posts', true, /\.md$/))
  const currentPostIndex = posts.findIndex(post => post.slug === slug)
  const previousPost = getPreviousPostSlug(currentPostIndex, posts)
  const nextPost = getNextPostSlug(currentPostIndex, posts)

  return {
    props: {
      siteTitle: config.title,
      frontmatter: data.data,
      markdownBody: data.content,
      nextPost: nextPost,
      previousPost: previousPost
    },
  }
}

export async function getStaticPaths() {
  //get all .md files in the posts dir
  const blogs = glob.sync('posts/**/*.md')

  //remove path and extension to leave filename only
  const blogSlugs = blogs.map(file =>
    file
      .split('/')[1]
      .replace(/ /g, '-')
      .slice(0, -3)
      .trim()
  )

  // create paths with `slug` param
  const paths = blogSlugs.map(slug => `/blog/${slug}`)
  return {
    paths,
    fallback: false,
  }
}
