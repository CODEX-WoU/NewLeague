import EventCard from './components/EventCard'
import yogaImage from './assets/yoga.jpg'
import aerobicImage from './assets/aerobic.jpg'
import cardioImage from './assets/cardio.jpg'
import './App.css'

const App: React.FC = () => {

  return (
    <>
      <h2 className='text-lg text-customColor font-sans font-semibold'>Woxen Sports Academy</h2>
      <h2 className="text-4xl font-bold font-sans text-center mb-6">Our Training Classes</h2>
      <div className="flex flex-col md:flex-row justify-between">
        <EventCard eventName="Yoga" trainedBy="Bella" info="Lorem ipsum dolor sit amet, consectetur adipiscing elit." price={50} image={yogaImage} />
        <EventCard eventName="Cardio" trainedBy="Cathe" info="Lorem ipsum dolor sit amet, consectetur adipiscing elit." price={100} image={aerobicImage} />
        <EventCard eventName="Aerobic" trainedBy="Mary" info="Lorem ipsum dolor sit amet, consectetur adipiscing elit." price={75} image={cardioImage} />
      </div>
    </>
  );
};

export default App;
