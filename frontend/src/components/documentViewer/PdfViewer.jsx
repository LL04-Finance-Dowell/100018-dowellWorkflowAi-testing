import React, { useEffect, useRef } from 'react';
import { Drawer, IconButton, Button } from '@mui/material';
import { BsArrowBarLeft } from 'react-icons/bs';

const PdfViewer = ({ onClose, open, pdfUrl, onSave }) => {
  console.log(pdfUrl, "pdfUrl",open, onSave);
  const containerRef = useRef(null);
  const screenHeight = window.screen.height;

  useEffect(() => {
    if (pdfUrl) {
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.src = pdfUrl;
          containerRef.current.style.width = `${1200}px`;
        }
      }, 1000);
    }
  }, [pdfUrl, containerRef]);

  const handleDrawerClose = () => {
    onClose(false);
  };

  const configButton = {
    variant: 'contained',
    color: 'success',
  }

  return (
    <div>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleDrawerClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: '1250px',
          },
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: '15px', marginTop: "5px" }}>
            <IconButton onClick={handleDrawerClose}>
            <BsArrowBarLeft style={{ color: '#2e7d32',  marginBottom: "5px" }}/>
              {/* <ChevronLeftIcon style={{ color: 'rgba(21, 101, 216, 1)' }} /> */}
            </IconButton>
            <h2>PDF View</h2>
            <Button
              {...configButton}
              style={{ 
                marginLeft: '67%',
                height: '30px',
                marginTop: '27px',
                width: '159px'
               }}
              onClick={onSave}
            >Open Document</Button>
          </div>
          <iframe
            title="PDF Preview"
            ref={containerRef}
            style={{ width: '100%', height: screenHeight - 300, border: 'none', marginLeft: '20px' }}
          />
        </div>

      </Drawer>
    </div>
  );
}

export default PdfViewer;

