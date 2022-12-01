import "../carousel/Carousel.css";
import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";

const Carousell = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  return (
    <div className="carousel">
      <Carousel activeIndex={index} onSelect={handleSelect}>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://cdn.discordapp.com/attachments/996076477944701089/1047205823077699727/Workflow_Hero-1-300x150.webp"
            alt="Fir slide"
            style={{ height: "320px" }}
          />
          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://cdn.discordapp.com/attachments/996076477944701089/1047205822368845854/istockphoto-1367763430-612x612-1-300x200.webp"
            alt="Second slide"
            style={{ height: "320px" }}
          />

          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://cdn.discordapp.com/attachments/996076477944701089/1047205822721171456/pexels-thirdman-5256691-300x200.webp"
            alt="Third slide"
            style={{ height: "320px" }}
          />

          <Carousel.Caption></Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default Carousell;
