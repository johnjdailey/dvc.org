import React, { useEffect, useState } from 'react'
import Link from '../Link'

import { Count, Github, Link as LinkSC, Star, Wrapper } from './styles'

const repo = `iterative/dvc`
const gh = `https://github.com/${repo}`
const api = `https://api.github.com/repos/${repo}`

export default function GithubLine() {
  const [count, setCount] = useState('–––')

  useEffect(() => {
    fetch(api).then(res => {
      res.json().then(data => setCount(data.stargazers_count))
    })
  }, [count, setCount])

  return (
    <Wrapper>
      <Github src="/img/github_small.png" width="20" height="20" />
      We’re on
      <Link href={gh} as={LinkSC}>
        GitHub
      </Link>
      <Star src="/img/star_small.svg" width="11.74" height="11.74" />{' '}
      <Count>{count}</Count>
    </Wrapper>
  )
}
