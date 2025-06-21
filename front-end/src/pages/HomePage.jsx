import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import NavBar from "./../components/NavBar";
import Content from "../components/Content";
import Video from "../components/visual/Video";
import Gallery from "../components/visual/Gallery";
import { getImages } from "../services/documentService";

const HomePage = () => {
  return (
    <div className="w-full">
      <Banner />
      <NavBar />
      <Content />
      <Video />
      <Gallery/>
    </div>
  );
};

export default HomePage;
