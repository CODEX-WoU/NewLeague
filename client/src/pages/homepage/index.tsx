import About from './About'
import TrainingClasses from "./TrainingClasses";
import Carousel from "./Carousel";

export const HomePage = () => {
  return (
    <div>
      <section>
        <Carousel slideContent={[]}></Carousel>
      </section>
      <section><About/></section>
      <div className="my-12">
        <section>
          <TrainingClasses />
        </section>
      </div>
    </div>
  );
};

export default HomePage;
