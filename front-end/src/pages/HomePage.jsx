import Banner from "../components/Banner";
import NavBar from "./../components/NavBar";
import Content from "../components/Content";
import Video from "../components/visual/Video";
import Gallery from "../components/visual/Gallery";

const HomePage = () => {
  return (
    <div className="w-full">
      <Banner />
      <NavBar />
      <Content />
      <Video />
      <Gallery />
    </div>
  );
};

export default HomePage;
