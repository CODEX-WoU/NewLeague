import TrainingClasses from "./TrainingClasses";
import Carousel from "./Carousel";

export const HomePage = () => {
  return (
    <div>
      <section>
        <Carousel></Carousel>
      </section>
      <section>
        <TrainingClasses />
      </section>
    </div>
  );
};

export default HomePage;
