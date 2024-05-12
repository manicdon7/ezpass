import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

const Head = ({ title, description, image }) => {
  const [previewImage, setPreviewImage] = useState(image);

  // Function to handle image load errors
  const handleImageError = () => {
    // Set a default preview image if the provided image fails to load
    setPreviewImage('https://github.com/manicdon7/ezpass/blob/master/front/src/assets/home.png');
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={previewImage} onError={handleImageError} />
    </Helmet>
  );
};

export default Head;
