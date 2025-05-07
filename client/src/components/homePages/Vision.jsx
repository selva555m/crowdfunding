import React from "react";

const Vision = () => {
  const articles = [
    {
      title: "Entrepreneurial Spirit",
      category: " Entrepreneurs",
      description:
        "From supporting small businesses to launching large-scale funding campaigns, Mr. Kasirajan has pioneered efforts in enabling entrepreneurs to turn their ideas into reality.",
      image: "../src/assets/vision1.jpg",
    },
    {
      title: " Community Growth",
      category: " Ecosystem",
      description:
        "With a deep-rooted belief in collective progress, Mr. Kasirajan has created platforms connecting funders with dreamers, bridging financial gaps and driving impactful community projects.",
      image: "../src/assets/vision4.jpg",
    },
    {
      title: " Startup Dreams",
      category: " Startups",
      description:
        "Through innovative funding solutions, Mr. Kasirajan has opened doors for startups to access capital, helping them bring groundbreaking ideas to market.",
      image: "../src/assets/vision3.jpg",
    },
    {
      title: "Revolutionizing Fundraising",
      category: " Technology",
      description:
        "With the launch of digital crowdfunding platforms, Mr. Kasirajan is on a mission to revolutionize fundraising by leveraging the power of online communities and social impact funding.",
      image: "../src/assets/vision2.jpg",
    },
  ];

  return (
    <section
      id="vision"
      className="w-screen bg-linear-to-bl from-indigo-200 to-purple-300 flex flex-col items-center justify-center py-20 sm:px-10 px-5"
    >
      <h3 className="text-indigo-800 text-center tracking-wide font-bold text-2xl max-xl:text-xl max-md:text-base uppercase">
        a vision for World
      </h3>
      <h1 className="font-extrabold text-center capitalize text-3xl max-xl:text-2xl max-md:text-xl mt-3 text-gray-700">
        Leading Global Crowdfunding Trends
      </h1>

      <div className="w-full flex flex-col items-center justify-center mt-10">
        <div className="flex flex-wrap justify-center xl:gap-7 sm:gap-5 gap-3">
          {articles.map((article, index) => (
            <div
              key={index}
              className="bg-white p-4 shadow-lg rounded-xl flex gap-3 sm:gap-4 2xl:gap-7 w-full lg:w-5/12 2xl:w-4/12"
            >
              <img
                src={article.image}
                alt={article.title}
                className="xl:w-[280px] xl:h-[170px] max-sm:w-28 w-36 max-sm:h-28 object-cover rounded-xl sm:mb-0 sm:mr-4"
              />
              <div className="flex flex-col justify-center">
                <div className="w-fit text-[10px] sm:text-[12px] xl:text-sm font-bold bg-gray-200 py-[3px] px-2 sm:py-1 text-center rounded-sm sm:rounded-md">
                  {article.category}
                </div>
                <h3 className="text-base sm:text-lg xl:text-xl font-semibold mt-1 sm:mt-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-[12px] mt-1 sm:mt-2 line-clamp-2">
                  {article.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-20 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-800">
          Browse Articles
        </button>
      </div>
    </section>
  );
};

export default Vision;
