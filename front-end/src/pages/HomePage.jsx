import React from "react";
import Header from "../components/common/Header";
import Banner from "../components/Banner";
import Footer from "../components/common/Footer";
import NavBar from "./../components/NavBar";
import Content from "../components/Content";
import Video from "../components/visual/Video";
import Gallery from "../components/visual/Gallery";

const HomePage = () => {
  return (
    <div className="w-full">
      <Header />
      <Banner />
      <NavBar />
      <Content />
      <Video />
      <Gallery />
      <Footer />
    </div>
  );
};

export default HomePage;
