import Lottie from "lottie-react";
import Animation from "../../assets/Loading-Files.json";

export default function LottieLoader() {
  return (
    <div className="flex items-center justify-center">
      <Lottie animationData={Animation} loop autoplay style={{ width: "20vw", height: "20vh" }} />
      {/* <div className=" animate-pulse text-gray-500 mt-4">Loading...</div> */}
    </div>
  );
}