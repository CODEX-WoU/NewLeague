import EventsLandingPageCard from "../../components/layout/cards/EventsLandingPageCard";

const App = () => {
  return (
    <div className="container bg-[#f9f9f9] mx-auto">
      <div className="flex p-12 flex-wrap justify-center gap-8">
        {/* Events Section */}
        <div className="mt-10 mb-6 lg:mb-0 lg:w-5/12 md:w-10/12 w-full">
          <h2
            className="text-3xl font-bold mb-4"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            EVENTS
          </h2>

          <p
            className="text-gray-600 mb-4"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio nemo
            porro provident, quis accusamus non.
          </p>

          <p className="text-gray-600" data-aos="fade-up" data-aos-delay="500">
            Lorem ipsum dolor sit amet consectetur immediately. Thank you.
          </p>
        </div>

        {/* Team Member 1 */}
        <EventsLandingPageCard
          imageUrl="https://woxsen.edu.in/uploads/A20240813081416.webp"
          sport="Volleyball"
          title="Volleyball League"
          socialLinks={[
            { name: "x", url: "#" },
            { name: "linkedIn", url: "#" },
          ]}
        />

        {/* Team Member 2 */}
        <EventsLandingPageCard
          imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi2DgLTiEQCY_UcvZDXQId_FSZQl9ofrsG0Q&amp;s"
          sport="Olympics"
          title="Olympics 2024"
          socialLinks={[
            { name: "facebook", url: "" },
            { name: "insta", url: "" },
            { name: "x", url: "" },
            { name: "linkedIn", url: "" },
          ]}
        />
      </div>
    </div>
  );
};

export default App;
