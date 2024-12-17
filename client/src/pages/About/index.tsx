// import React from "react";
// import AboutContent from "./AboutContent";
// import AboutLeagueGif from "../../assets/Woxsen_s_Indian_Premier_League_a_k_a_Woxsen_Premier_League_5_FINALE.gif";

// const AboutPage = () => {
//   return (
//     <React.Fragment>
//       <AboutContent
//         backgroundGif={AboutLeagueGif}
//         title="About Us"
//         description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur aspernatur praesentium modi aliquid quis ad at in, minus, sint voluptate fugiat facilis rerum corrupti itaque saepe fugit ullam explicabo obcaecati?"
//       />{" "}
//     </React.Fragment>
//   );
// };

// export default AboutPage;

import AboutContent from "./AboutContent";
import AboutLeagueGif from "../../assets/Woxsen_s_Indian_Premier_League_a_k_a_Woxsen_Premier_League_5_FINALE.gif";

const AboutPage = () => {
  const handleGetStarted = () => {
    console.log("Get Started clicked!");
  };

  return (
    <div>
      <AboutContent
        backgroundGif={AboutLeagueGif}
        title="About Us"
        description="Lorem ipsum dolor sit amet, terdum nunc, at eleifend neque sagittis et.erdum nunc, at eleifend neque sagittis et.erdum nunc, at eleifend neque sagittis et. Donec dignissim quam eu aliquet fermentum. Suspendisse potenti."
        onGetStarted={handleGetStarted}
      />
    </div>
  );
};

export default AboutPage;
