import React from 'react'
import css from './index.module.less'
interface TitleProps {
  title: string
}
const Title = (props: TitleProps) => {
  const { title } = props
  return <div className={css['title']}>
    {title}
  </div>
}

export default Title