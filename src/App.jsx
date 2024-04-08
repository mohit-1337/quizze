import React, { useState, useEffect, useRef } from "react";
import quizData from "./data.json";
import "./styles.css";

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userSelections, setUserSelections] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showRestartButton, setShowRestartButton] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setQuestions(quizData.questions);
  }, []);

  const handleSelect = (optionIndex) => {
    setUserSelections((prevSelections) => {
      const updatedSelections = [...prevSelections];
      updatedSelections[currentQuestionIndex] = optionIndex;
      return updatedSelections;
    });

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        setShowRestartButton(true); // Show restart button when last question is reached
      }
    }, 2000);
  };

  useEffect(() => {
    setIsTransitioning(true);

    const timeoutId = setTimeout(() => {
      setIsTransitioning(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (
      currentQuestionIndex < questions.length - 1 &&
      userSelections[currentQuestionIndex] !== undefined
    ) {
      timerRef.current = setTimeout(handleSelect, 5000);
    }
    return () => clearTimeout(timerRef.current);
  }, [currentQuestionIndex, questions.length, userSelections]);

  const progressPercentage =
    ((currentQuestionIndex + 1) / questions.length) * 100;

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserSelections([]);
    setShowRestartButton(false); // Hide restart button when quiz restarts
  };

  return (
    <div className="box-border bg-gray-100 h-screen flex items-center justify-center text-center flex-col">
      <div className="w-72 flex flex-col h-screen m-5">
        {!showRestartButton ? (
          <>
            <div
              className={`bg-white h-1/2 p-8 flex flex-col justify-center rounded-t-md gap-7`}
            >
              <div className="flex flex-col xl:gap-0 md:gap-6">
                <div className="flex items-center gap-16">
                  <span
                    className="text-gray-500 text-2xl font-semibold cursor-pointer"
                    onClick={() => {
                      if (currentQuestionIndex > 0) {
                        setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
                      }
                    }}
                  >
                    {"<"}
                  </span>
                  <h3 className="text-2xl font-semibold mb-2">
                    {`0${currentQuestionIndex + 1}`}{" "}
                    <span className="text-gray-500 text-sm ">
                      / {`0${questions.length}`}
                    </span>
                  </h3>
                </div>

                <div className="relative h-0.5 bg-gray-300 mt-4">
                  <div
                    style={{ width: `${progressPercentage}%` }}
                    className="absolute h-1 left-0 bottom-0 bg-[#0E46FD] transition-width duration-500 ease-in-out"
                  />
                </div>
              </div>

              <div
                className={`text-left ${
                  isTransitioning ? "transition-slide-left" : ""
                }`}
              >
                {currentQuestionIndex < questions.length && (
                  <h2 className="text-3xl md:text-4xl xl:text-2xl font-semibold text-gray-800 mb-4 ">
                    {questions[currentQuestionIndex].question}
                  </h2>
                )}
              </div>
            </div>

            <div
              className={`bg-[#0E46FD] h-1/2 flex flex-col justify-center rounded-b-md`}
            >
              <div
                className={`text-left flex flex-col items-center absolute top-[50%] left-[20%] transform [-translate-x-1/2] [-translate-y-1/2] xl:top-[50vh] xl:left-[40.5vw] sm:top-[30vh] md:top-[50vh] md:left-[33.5%] ${
                  isTransitioning ? "animate-bars div" : ""
                }`}
              >
                <div className="bg-white w-64 h-1.5 bg-opacity-60"></div>
                <div className="bg-white w-60 h-1.5 bg-opacity-40"></div>
                <div className="bg-white w-56 h-1.5 bg-opacity-20"></div>
                <div className="bg-white w-52 h-1.5 bg-opacity-5"></div>
              </div>

              <div className="">
                <div className="p-8">
                  {currentQuestionIndex < questions.length && (
                    <div
                      className={`flex flex-col gap-2 ${
                        isTransitioning ? "transition-slide-left" : ""
                      }`}
                    >
                      {questions[currentQuestionIndex].options.map(
                        (option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`border-l-4 text-xl md:text-xl xl:text-sm border-white flex items-center bg-white bg-opacity-5 p-2 mb-2 cursor-pointer text-white transition-colors duration-300 ease-in-out ${
                              userSelections[currentQuestionIndex] ===
                              optionIndex
                                ? "bg-opacity-custom"
                                : ""
                            }`}
                            onClick={() => {
                              handleSelect(optionIndex);
                              clearTimeout(timerRef.current);
                            }}
                          >
                            <div className="flex gap-9">
                              <span className="ml-5 mr-0">
                                {String.fromCharCode(97 + optionIndex)}
                              </span>
                              <label
                                htmlFor={`option_${optionIndex}`}
                                className="flex-1 text-center option-text"
                              >
                                {option.label}
                              </label>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <button
            onClick={restartQuiz}
            className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
          >
            Restart Quiz
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
