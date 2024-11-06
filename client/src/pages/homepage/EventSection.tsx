import EventCard from '../../components/EventCardTemplate'
import yogaImage from '../../assets/EventSectionImages/yoga.jpg'
import aerobicImage from '../../assets/EventSectionImages/aerobic.jpg'
import cardioImage from '../../assets/EventSectionImages/cardio.jpg'

const App: React.FC = () => {

  return (
    <>
        <h2 className='text-lg text-gray-500 font-sans font-semibold text-center'>Woxen Sports Academy</h2>
        <h2 className="text-4xl font-bold font-sans text-center mb-6">Our Training Classes</h2>
        <div className="flex flex-col md:flex-row justify-center align-middle gap-4">
            <EventCard eventName="Yoga" trainedBy="Bella" info="Lorem ipsum dolor sit amet, consectetur adipiscing elit." price={50} image={yogaImage} />
            <EventCard eventName="Cardio" trainedBy="Cathe" info="Lorem ipsum dolor sit amet, consectetur adipiscing elit." price={100} image={aerobicImage} />
            <EventCard eventName="Aerobic" trainedBy="Mary" info="Lorem ipsum dolor sit amet, consectetur adipiscing elit." price={75} image={cardioImage} />
        </div>
    </>
  );
};

export default App;
