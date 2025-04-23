import React from "react";
 // Make sure the path is correct
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={assets.home_vi}
        autoPlay
        loop
        muted
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>

      {/* Content */}
      <div className="text-center text-pretty relative z-10">
      <h1 className="text-5xl font-light bg-gradient-to-r from-gray-800 to-gray-200 text-transparent bg-clip-text">
           H e L l O ! W e L c O M e
            </h1><br/>
      <p className="text-3xl italic bg-gradient-to-r from-neutral-950 to-lime-950 text-transparent bg-clip-text">
        EnjOy  OuR CoMpAnY...
      </p>

       
      </div>
    </section>
  );
};

export default Hero;
