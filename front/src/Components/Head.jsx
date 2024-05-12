import React from 'react';
import { Helmet } from 'react-helmet';
import home from '../assets/home.png';

const Head = ({ title, description, image, imageAlt }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property='description' content={description}/>
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property='or:url' content={window.location.pathname + window.location.search}/>
      <meta name='twitter:card' content='summary_large_image'/>
      <meta property='og:url' content={home}/>
      <meta name='twitter:image:alt' content={imageAlt}/>
    </Helmet>
  );
};

export default Head;
