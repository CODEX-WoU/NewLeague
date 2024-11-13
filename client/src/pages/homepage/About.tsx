// import React from 'react';

// interface AboutProps {
//   slot1: string;
//   time1: string;
//   slot2: string;
//   time2: string;
// }

// const About: React.FC<AboutProps> = ({
//   slot1 = "Monday - Sunday",
//   time1 = "10:00AM - 11:00PM",
//   slot2 = "Tuesday - Thursday",
//   time2 = "5:00AM - 12:00PM",
// }) => {
//   return (
//     <section className="flex items-center justify-center bg-black w-screen py-20">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-col lg:flex-row items-center justify-center">
//           <div className="flex flex-col justify-center lg:w-5/12 md:w-1/2 w-full lg:text-left mb-8 lg:mb-0">
//             <h2 className="text-4xl font-extrabold text-white mb-3">New to the League?</h2>
//             <h6 className="text-3xl mb-4 text-white">Vision and Mission</h6>
//             <p className="text-2xl text-zinc-400">
//               Lorem ipsum dolor sit amet consectetur adipisicing elite, for your commercial website. Bootstrap v4.2.1 Layout. Feel free to use it.
//             </p>
//             <a
//               href="#"
//               className="text-xl text-white no-underline text-center mt-4 bg-primary px-6 py-3"
//             >
//               LOREM
//             </a>
//           </div>
//           <div className="lg:ml-10">
//             <div className="border-l-2 border-zinc-400 h-80 pl-8">
//               <h2 className="text-4xl font-extrabold text-white mb-4">Lorem ipsum dolor.</h2>
//               <h3 className="mt-3 mb-0 text-2xl text-white">{slot1}</h3>
//               <p className="mb-4 text-xl text-zinc-400 font-bold">{time1}</p>
//               <h3 className="mt-3 mb-0 text-2xl text-white">{slot2}</h3>
//               <p className="mb-4 text-xl text-zinc-400 font-bold">{time2}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default About;

import React, { Fragment } from "react";

interface AboutProps {
  slot1?: string;
  time1?: string;
  slot2?: string;
  time2?: string;
}

const AboutTimingsElement = (props: { slot: string; time: string }) => {
  const { slot, time } = props;

  return (
    <Fragment>
      <h3 className="mt-3 mb-0 text-lg font-bold text-white">{slot}</h3>
      <p className="mb-4 text-lg text-[#666262]">{time}</p>
    </Fragment>
  );
};

const About: React.FC<AboutProps> = ({
  slot1 = "Monday - Sunday",
  time1 = "10:00AM - 11:00PM",
  slot2 = "Tuesday - Thursday",
  time2 = "5:00AM - 12:00PM",
}) => {
  return (
    <section className="flex items-center font-plain justify-center bg-[#171819] w-screen py-20">
      <div className="container mx-auto px-4">
        <div className="flex gap-x-12 flex-col lg:flex-row items-center mx-auto w-4/5 justify-center">
          <div className="flex flex-col justify-center lg:w-5/12 md:w-1/2 w-full lg:text-left mb-8 lg:mb-0">
            <h2 className="text-4xl font-extrabold text-white mb-3">
              New to the League?
            </h2>
            <h6 className="text-xl mb-6 mt-4 text-white">Vision and Mission</h6>
            <p className="text-lg mb-2 tracking-tight text-[#666262]">
              Lorem ipsum dolor sit amet consectetur adipisicing elite, for your
              commercial website. Bootstrap v4.2.1 Layout. Feel free to use it.
            </p>
            <a
              href="#"
              className="bg-primary text-sm text-white no-underline text-center mt-4 px-6 py-4"
            >
              LOREM
            </a>
          </div>
          <div className="lg:ml-10">
            <div className="border-l-2 border-[#666262] h-80 pl-8">
              <h2 className="text-4xl font-plain font-bold text-white mb-4">
                Timings
              </h2>
              <div className="mt-12">
                {slot1 && time1 && (
                  <AboutTimingsElement time={time1} slot={slot1} />
                )}
                {slot2 && time2 && (
                  <AboutTimingsElement time={time2} slot={slot2} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
