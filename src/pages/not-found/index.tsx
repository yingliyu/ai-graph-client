import React from 'react';

interface INotFoundProps {
  msg: string;
}

const NotFound: React.FC<INotFoundProps> = (props: INotFoundProps) => {
  const { msg } = props;
  return <div>{msg}</div>;
};
NotFound.defaultProps = {
  msg: '404 not found',
};
export default NotFound;
