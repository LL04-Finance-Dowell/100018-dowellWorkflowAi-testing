import React, { useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';

const Collapse = ({ children, open }) => {
  const childRef = useRef();
  const parentRef = useRef();
  const { rerender } = useAppContext();

  React.useEffect(() => {
    if (open) {
      parentRef.current.style.height = open
        ? `${childRef.current?.getBoundingClientRect().height}px`
        : 0;

      parentRef.current.style.overflow = 'hidden';
      parentRef.current.style.transition = '0.5s all ease';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerender]);

  return (
    <div
      style={{
        overflow: 'hidden',
        height: open
          ? `${childRef.current?.getBoundingClientRect().height}px`
          : 0,
        transition: '0.5s all ease',
      }}
      ref={parentRef}
    >
      <div ref={childRef}>{children}</div>
    </div>
  );
};

export default Collapse;
