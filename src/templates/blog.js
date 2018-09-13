// @flow
import * as React from 'react'
import styled from 'react-emotion'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import Spacer from '../components/spacer'
import Container from '../components/container'
import Header from '../components/header'
import WithLogo from '../components/with-logo'
import { H1 as Title } from '../components/body'
import Filters from '../components/filters'
import PostPreview from '../components/post-preview'
import Pager from '../components/pager'
import * as CATEGORY from '../constants/categories'

const Divider = styled.div`
  margin: 2rem 0;
`

type Props = {
  pageContext: {
    category: $Keys<typeof CATEGORY>,
    categoryPath: string,
    pageNumber: *,
    numberOfPages: *,
    previousPagePath: *,
    nextPagePath: *,
  },
  data: {
    allMdx: {
      edges: Array<{
        node: {
          fields: {
            path: string,
            date: string,
          },
          exports: {
            meta: {
              title: string,
            },
          },
          excerpt: string,
        },
      }>,
    },
  },
}

const Blog = ({
  pageContext: {
    category,
    categoryPath,
    pageNumber,
    numberOfPages,
    previousPagePath,
    nextPagePath,
  },
  data: {
    allMdx: { edges },
  },
}: Props) => (
  <Layout
    title={category != null ? `Blog (${CATEGORY[category].name})` : 'Blog'}
    description="Posts about frontend development, love and other topics"
  >
    <Header>
      <WithLogo>
        <Title>Blog</Title>
      </WithLogo>
      <Filters
        basePath="/blog"
        currentPath={categoryPath}
        items={['DEV', 'NON_DEV'].map(category => CATEGORY[category])}
        closePath="/blog"
      />
    </Header>
    <Container>
      {edges.reduce((acc, edge, i) => {
        const {
          fields: { path, date },
          exports: {
            meta: { title },
          },
          excerpt,
        } = edge.node
        const post = (
          <PostPreview
            key={path}
            path={path}
            title={title}
            dateTime={date}
            excerpt={excerpt}
          />
        )
        if (i > 0) {
          const prevPath = edges[i - 1].node.fields.path
          const dividerKey = `${prevPath}-${path}`
          return acc.concat(<Divider key={dividerKey} />, post)
        }
        return acc.concat(post)
      }, [])}
    </Container>
    <Spacer />
    <Pager
      page={pageNumber}
      total={numberOfPages}
      prevLabel="Newer"
      prevPath={previousPagePath}
      nextLabel="Older"
      nextPath={nextPagePath}
    />
    <Spacer />
  </Layout>
)

Blog.defaultProps = {
  pageContext: {
    categoryPath: null,
  },
}

export default Blog

export const query = graphql`
  query BlogQuery($category: String, $skip: Int!, $limit: Int!) {
    allMdx(
      sort: { fields: [fields___date], order: DESC }
      filter: { exports: { meta: { category: { eq: $category } } } }
      skip: $skip
      limit: $limit
    ) {
      edges {
        node {
          fields {
            path
            date
          }
          exports {
            meta {
              title
            }
          }
          excerpt
        }
      }
    }
  }
`
