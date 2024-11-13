import About from "./About";
import TrainingClasses from "./TrainingClasses";
import Carousel from "./Carousel";
import EventSection from "./EventSection";

export const HomePage = () => {
  return (
    <div>
      <section>
        <Carousel slideContent={[]}></Carousel>
      </section>
      <section>
        <About />
      </section>
      <section className="bg-[#f9f9f9]">
        <EventSection />
      </section>
      <div className="my-12">
        <section>
          <TrainingClasses />
        </section>
      </div>
    </div>
  );
};

export default HomePage;
