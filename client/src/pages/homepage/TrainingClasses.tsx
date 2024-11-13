import TrainingClassCard from "../../components/layout/cards/TrainingClassCard";
import yogaImage from "../../assets/EventSectionImages/yoga.jpg";
import aerobicImage from "../../assets/EventSectionImages/aerobic.jpg";
import cardioImage from "../../assets/EventSectionImages/cardio.jpg";

const App: React.FC = () => {
  return (
    <div className="w-full mx-auto lg:w-3/5">
      <h2 className="text-lg text-gray-500 font-sans font-semibold text-center">
        Woxen Sports Academy
      </h2>
      <h2 className="text-4xl font-bold font-sans text-center mb-6">
        Our Training Classes
      </h2>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <TrainingClassCard
          eventName="Yoga"
          trainedBy="Bella"
          info="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          price={1050}
          image={yogaImage}
        />
        <TrainingClassCard
          eventName="Cardio"
          trainedBy="Cathe"
          info="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          price={1500}
          image={aerobicImage}
        />
        <TrainingClassCard
          eventName="Aerobic"
          trainedBy="Mary"
          info="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          price={750}
          image={cardioImage}
        />
      </div>
    </div>
  );
};

export default App;
