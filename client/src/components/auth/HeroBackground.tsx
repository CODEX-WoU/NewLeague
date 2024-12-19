import Img from "../../assets/HomePage/HomePageLeague.webp";

export const HeroBackground = () => {
  return (
    <>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${Img})`,
          backgroundRepeat: "no-repeat",
          filter: "blur(4px)",
        }}
      />

      {/* Semi-transparent dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Gradient overlay - bottom right accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/80" />
    </>
  );
};
