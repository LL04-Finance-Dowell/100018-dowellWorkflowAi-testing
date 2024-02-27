import React, { useState } from 'react';

const Iframe = ({ Skeleton, className, ...iframeProps }) => {
  const [iframeLoading, setIframeLoading] = useState(true);

  if (!Skeleton) {
    console.warn(
      'react-loading-iframe: Rendered without skeleton, consider using an html iframe'
    );
  }

  return (
    <>
      {iframeLoading && <Skeleton />}
      <iframe
        title='uni_iframe'
        className={className}
        {...iframeProps}
        style={{
          display: iframeLoading ? 'none' : 'block',
          height: '100%',
          width: '100%',
        }}
        onLoad={() => {
          setIframeLoading(false);
        }}
      />
    </>
  );
};

export default Iframe;
