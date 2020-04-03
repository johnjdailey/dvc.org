import React, { useCallback } from 'react'
import cn from 'classnames'
import format from 'date-fns/format'

import { ICommunitySectionTheme } from '../'
import LayoutWidthContainer from '../../LayoutWidthContainer'
import Link from '../../Link'
import Block from '../Block'
import Section from '../Section'

import { logEvent } from '../../../utils/ga'
import { getFirstPage } from '../../../utils/sidebar'
import { useCommentsCount } from '../../../utils/api'
import getPosts from '../../../queries/posts'
import { pluralizeComments } from '../../../utils/i18n'

import data from '../data.json'
import sharedStyles from '../styles.module.css'
import styles from './styles.module.css'

const docsPage = getFirstPage()
const { description, mobileDescription, title } = data.section.learn
const { documentation, userContent } = data

const logPostAll = () => logEvent('community', 'blog', 'all')
const logDocumentationAll = () => logEvent('community', 'documentation', 'all')

interface ICommunityBlogPost {
  color: string
  commentsUrl?: string
  pictureUrl: string | null
  date: string
  title: string
  url: string
}

const BlogPost: React.SFC<ICommunityBlogPost> = ({
  url,
  title,
  date,
  color,
  commentsUrl,
  pictureUrl
}) => {
  if (!commentsUrl) {
    return null
  }

  const logPost = useCallback(() => logEvent('community', 'blog', title), [
    title
  ])

  const { error, ready, result } = useCommentsCount(commentsUrl)

  return (
    <div className={cn(sharedStyles.line, sharedStyles.image)} key={url}>
      {pictureUrl && (
        <Link href={url} target="_blank" onClick={logPost}>
          <img className={styles.image} src={pictureUrl} alt="" />
        </Link>
      )}
      <div>
        <Link
          className={sharedStyles.link}
          style={{ color }}
          href={url}
          target="_blank"
          onClick={logPost}
        >
          {title}
        </Link>
        <div className={sharedStyles.meta}>
          {ready && !error && (
            <>
              <Link
                className={sharedStyles.commentsLink}
                href={commentsUrl}
                target="_blank"
              >
                {pluralizeComments(result)}
              </Link>
              {' • '}
            </>
          )}
          <span className={sharedStyles.nbsp}>
            {format(new Date(date), 'MMM, d')}
          </span>
        </div>
      </div>
    </div>
  )
}

interface ICommunityUserContentProps {
  author: string
  color: string
  date: string
  pictureUrl: string
  title: string
  url: string
}

const UserContent: React.SFC<ICommunityUserContentProps> = ({
  url,
  title,
  author,
  date,
  color,
  pictureUrl
}) => {
  const logUserContent = useCallback(
    () => logEvent('community', 'user-content', title),
    [title]
  )

  return (
    <div className={cn(sharedStyles.line, sharedStyles.image)} key={url}>
      {pictureUrl && (
        <Link
          className={sharedStyles.link}
          href={url}
          target="_blank"
          onClick={logUserContent}
        >
          <img className={styles.image} src={pictureUrl} alt="" />
        </Link>
      )}
      <div>
        <Link
          className={sharedStyles.link}
          style={{ color }}
          href={url}
          target="_blank"
          onClick={logUserContent}
        >
          {title}
        </Link>
        <div className={sharedStyles.meta}>
          {author} •{' '}
          <span className={sharedStyles.nbsp}>
            {format(new Date(date), 'MMM, d')}
          </span>
        </div>
      </div>
    </div>
  )
}

interface ICommunityDocumentationProps {
  color: string
  description: string
  title: string
  url: string
}

const Documentation: React.SFC<ICommunityDocumentationProps> = ({
  url,
  title,
  description,
  color
}) => {
  const logDocumentation = useCallback(
    () => logEvent('community', 'documentation', title),
    [title]
  )

  return (
    <div className={sharedStyles.line} key={url}>
      <Link
        className={cn(sharedStyles.link, sharedStyles.large)}
        style={{ color }}
        href={url}
        onClick={logDocumentation}
      >
        {title}
      </Link>
      <div className={sharedStyles.meta}>{description}</div>
    </div>
  )
}

const Learn: React.SFC<{ theme: ICommunitySectionTheme }> = ({ theme }) => {
  const posts = getPosts()

  return (
    <LayoutWidthContainer className={sharedStyles.wrapper}>
      <Section
        anchor="learn"
        background="/img/community/learn_bg.jpg"
        color={theme.color}
        description={description}
        icon="/img/community/learn.svg"
        mobileDescription={mobileDescription}
        title={title}
      >
        <div className={sharedStyles.items}>
          <div className={sharedStyles.item}>
            <Block
              title={
                <Link
                  className={sharedStyles.headerLink}
                  href={docsPage}
                  onClick={logDocumentationAll}
                >
                  Documentation
                </Link>
              }
              action={
                <Link
                  className={sharedStyles.button}
                  style={theme}
                  href={docsPage}
                  onClick={logDocumentationAll}
                >
                  See all docs
                </Link>
              }
            >
              {documentation.map(documentation => (
                <Documentation
                  {...documentation}
                  key={documentation.url}
                  color={theme.color}
                />
              ))}
            </Block>
          </div>
          <div className={sharedStyles.item}>
            <Block
              title={
                <Link
                  className={sharedStyles.headerLink}
                  href="/blog"
                  onClick={logPostAll}
                >
                  DVC Blog
                </Link>
              }
              action={
                posts && (
                  <Link
                    className={sharedStyles.button}
                    style={theme}
                    href="/blog"
                    onClick={logPostAll}
                  >
                    See all Posts
                  </Link>
                )
              }
            >
              {posts.map(post => (
                <BlogPost {...post} key={post.url} color={theme.color} />
              ))}
            </Block>
          </div>
          <div className={sharedStyles.item}>
            <Block title="User Content">
              {userContent.map(userContent => (
                <UserContent
                  {...userContent}
                  key={userContent.url}
                  color={theme.color}
                />
              ))}
            </Block>
          </div>
        </div>
      </Section>
    </LayoutWidthContainer>
  )
}

export default Learn
