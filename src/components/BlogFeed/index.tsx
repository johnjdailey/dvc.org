import { graphql } from 'gatsby'

import React from 'react'

import cn from 'classnames'

import Paginator, { IPaginatorPageInfo } from '../Paginator'
import BlogFeedItem, { IBlogFeedPostData } from './Item'

import styles from './styles.module.css'

export interface IBlogFeedPostList {
  edges: Array<{
    node: IBlogFeedPostData
  }>
}

interface IBlogFeedProps {
  feedPostList: IBlogFeedPostList
  bigFirst?: boolean
  header: React.ReactNode
  leadParagraph?: React.ReactNode
  pageInfo: IPaginatorPageInfo
}

const BlogFeed: React.SFC<IBlogFeedProps> = ({
  feedPostList: { edges },
  pageInfo,
  bigFirst = true,
  header,
  leadParagraph
}) => {
  return (
    <div className={styles.wrapper}>
      <div
        className={cn(styles.meta, {
          [styles.metaSlim]: bigFirst
        })}
      >
        <h2 className={styles.header}>{header}</h2>
        {leadParagraph && <div className={styles.lead}>{leadParagraph}</div>}
      </div>
      <div className={styles.posts}>
        {edges.map(({ node }, index) => (
          <BlogFeedItem
            feedPost={node}
            key={node.id}
            big={bigFirst && index === 0 && pageInfo.currentPage === 1}
          />
        ))}
      </div>
      <Paginator pageInfo={pageInfo} />
    </div>
  )
}

export const query = graphql`
  fragment FeedPostList on MarkdownRemarkConnection {
    edges {
      node {
        ...FeedPost
      }
    }
  }
`

export default BlogFeed
