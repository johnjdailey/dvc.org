import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'

import Link from '../../Link'

import { logEvent } from '../../../utils/ga'
import { getFirstPage } from '../../../utils/sidebar'

import CommunityBlock from '../Block'
import CommunitySection from '../Section'

import { useCommentsCount } from '../../../utils/api'
import getPosts from '../../../queries/posts'
import { pluralizeComments } from '../../../utils/i18n'

import {
  Button,
  Comments,
  HeaderLink,
  ImageLine,
  Item,
  Items,
  Line,
  Link as LinkSC,
  Meta,
  NbspWrapper,
  TextWrapper,
  Wrapper
} from '../styles'

import { Image } from './styles'

import data from '../data'

const docsPage = getFirstPage()
const { description, mobileDescription, title } = data.section.learn
const { documentation, userContent } = data

const logPostAll = () => logEvent('community', 'blog', 'all')
const logDocumentationAll = () => logEvent('community', 'documentation', 'all')

function CommunityBlogPost({
  url,
  title,
  date,
  color,
  commentsUrl,
  pictureUrl
}) {
  const logPost = useCallback(() => logEvent('community', 'blog', title), [
    title
  ])
  const { error, ready, result } = useCommentsCount(commentsUrl)

  return (
    <ImageLine key={url}>
      {pictureUrl && (
        <Link href={url} target="_blank" onClick={logPost}>
          <Image src={pictureUrl} alt="" />
        </Link>
      )}
      <TextWrapper>
        <Link
          as={LinkSC}
          color={color}
          href={url}
          target="_blank"
          onClick={logPost}
        >
          {title}
        </Link>
        <Meta>
          {ready && !error && (
            <>
              <Comments
                href={commentsUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                {pluralizeComments(result)}
              </Comments>
              {' • '}
            </>
          )}
          <NbspWrapper>{format(new Date(date), 'MMM, d')}</NbspWrapper>
        </Meta>
      </TextWrapper>
    </ImageLine>
  )
}

CommunityBlogPost.propTypes = {
  color: PropTypes.string,
  commentsUrl: PropTypes.string,
  pictureUrl: PropTypes.string,
  date: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string
}

function CommunityUserContent({ url, title, author, date, color, pictureUrl }) {
  const logUserContent = useCallback(
    () => logEvent('community', 'user-content', title),
    [title]
  )

  return (
    <ImageLine key={url}>
      {pictureUrl && (
        <Link href={url} as={LinkSC} target="_blank" onClick={logUserContent}>
          <Image src={pictureUrl} alt="" />
        </Link>
      )}
      <TextWrapper>
        <Link
          color={color}
          href={url}
          as={LinkSC}
          target="_blank"
          onClick={logUserContent}
        >
          {title}
        </Link>
        <Meta>
          {author} •{' '}
          <NbspWrapper>{format(new Date(date), 'MMM, d')}</NbspWrapper>
        </Meta>
      </TextWrapper>
    </ImageLine>
  )
}

CommunityUserContent.propTypes = {
  author: PropTypes.string,
  color: PropTypes.string,
  date: PropTypes.string,
  pictureUrl: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string
}

function CommunityDocumentation({ url, title, description, color }) {
  const logDocumentation = useCallback(
    () => logEvent('community', 'documentation', title),
    [title]
  )

  return (
    <Line key={url}>
      <Link
        href={url}
        as={LinkSC}
        color={color}
        large="true"
        onClick={logDocumentation}
      >
        {title}
      </Link>
      <Meta>{description}</Meta>
    </Line>
  )
}

CommunityDocumentation.propTypes = {
  color: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string
}

export default function CommunityLearn({ theme }) {
  const posts = getPosts()

  return (
    <Wrapper>
      <CommunitySection
        anchor="learn"
        background="/img/community/learn_bg.jpg"
        color={theme.color}
        description={description}
        icon="/img/community/learn.svg"
        mobileDescription={mobileDescription}
        title={title}
      >
        <Items>
          <Item>
            <CommunityBlock
              title={
                <Link
                  href={docsPage}
                  as={HeaderLink}
                  onClick={logDocumentationAll}
                >
                  Documentation
                </Link>
              }
              action={
                <Link
                  href={docsPage}
                  as={Button}
                  theme={theme}
                  onClick={logDocumentationAll}
                >
                  See all docs
                </Link>
              }
            >
              {documentation.map(documentation => (
                <CommunityDocumentation
                  {...documentation}
                  key={documentation.url}
                  color={theme.color}
                />
              ))}
            </CommunityBlock>
          </Item>
          <Item>
            <CommunityBlock
              title={
                <HeaderLink href="/blog" onClick={logPostAll}>
                  DVC Blog
                </HeaderLink>
              }
              action={
                posts && (
                  <Button theme={theme} href="/blog" onClick={logPostAll}>
                    See all Posts
                  </Button>
                )
              }
            >
              {posts.map(post => (
                <CommunityBlogPost
                  {...post}
                  key={post.url}
                  color={theme.color}
                />
              ))}
            </CommunityBlock>
          </Item>
          <Item>
            <CommunityBlock title="User Content">
              {userContent.map(userContent => (
                <CommunityUserContent
                  {...userContent}
                  key={userContent.url}
                  color={theme.color}
                />
              ))}
            </CommunityBlock>
          </Item>
        </Items>
      </CommunitySection>
    </Wrapper>
  )
}

CommunityLearn.propTypes = {
  theme: PropTypes.shape({
    backgroundColor: PropTypes.string,
    color: PropTypes.string
  })
}
