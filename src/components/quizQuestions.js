import axios from "../utils/axiosConfig";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
function QuizScreen() {
  const { levelId } = useParams(); // Lấy levelId từ URL
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [topic, setTopic] = useState("");
  const [images, setImage] = useState("");
  const [modalStep, setModalStep] = useState(1);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null); // Trạng thái câu trả lời
  const [completed, setCompleted] = useState(false); // Hoàn thành level
  const [outOfLives, setOutOfLives] = useState(false); // Hết lượt
  const navigate = useNavigate();

  // Gọi API để lấy dữ liệu của level
  useEffect(() => {
    const fetchLevelData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      try {
        const response = await axios.get(`/levels/${levelId}`); // Lấy dữ liệu level theo ID
        const levelData = response.data;
        // Lưu trữ câu hỏi và chủ đề vào state
        setQuestions(levelData.questions);
        setImage(levelData.images);
        setTopic(levelData.topic);
        setCurrentQuestionIndex(0);
        setLives(3);
        setCompleted(false);
        setOutOfLives(false);
      } catch (error) {
        console.error("Error fetching levels:", error);
      }
    };

    fetchLevelData();
  }, [levelId]);

  const handleAnswer = (selectedOption) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.correctAnswer === selectedOption) {
      setIsAnswerCorrect(true);

      // Nếu câu trả lời đúng và đang ở câu cuối cùng, hiển thị modal hoàn thành luôn
      if (currentQuestionIndex + 1 === questions.length) {
        setCompleted(true); // Kích hoạt modal hoàn thành
        toast.success("Giỏi lắm, bạn đã hoàn thành màn chơi");
      }
    } else {
      setIsAnswerCorrect(false);
      if (lives - 1 === 0) {
        setOutOfLives(true); // Hết tim
        toast.error("Thua rùi !!! Thử lại nha");
      } else {
        setLives(lives - 1);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswerCorrect(null);
    } else {
      setCompleted(true); // Kết thúc level
    }
  };

  const handleFinish = async () => {
    const userId = localStorage.getItem("userId");
    try {
      // Gửi request đến API để lưu tiến trình hoàn thành level
      const response = await axios.post(`/users/${userId}/complete-level`, {
        levelId: levelId,
      });
      console.log(response.data); // Kiểm tra response từ server
    } catch (error) {
      console.error("Error updating level completion:", error);
    }

    navigate("/quiz-selection"); // Điều hướng người chơi về trang chọn level
  };

  const endGame = () => {
    navigate("/quiz-selection"); // Điều hướng người chơi về trang chọn level
  };
  if (questions.length === 0) {
    return (
      <div className="relative w-full max-w-full lg:max-w-[500px] mx-auto"></div>
    );
  }
  const handleButtonClick = () => {
    // Switch modal when button is clicked
    setModalStep(modalStep + 1); // Change to the next modal or do something else
  };

  return (
    <div className="relative w-full max-w-full lg:max-w-[500px] mx-auto">
      <div className="relative h-screen bg-[#bfe9ff] flex flex-col">
        <button
          className="absolute top-5 left-5"
          onClick={() => navigate("/quiz-selection")}
        >
          <img
            src="/images/question/quay_ve.png"
            alt="Back"
            className="w-[40px]"
          />
        </button>

        <div className="absolute top-5 right-5 flex space-x-2">
          {Array(lives)
            .fill()
            .map((_, index) => (
              <img
                key={index}
                src="/images/question/tim_dam.png"
                alt="Heart"
                className="w-[30px]"
              />
            ))}
        </div>

        <div className="flex-grow flex flex-col items-center justify-center h-auto">
          <div className="relative mt-[10px] left-5 ">
            <div className="absolute left-2 top-[-30px] z-20 w-full">
              <p
                className={`text-lg text-black font-semibold ${
                  topic.length > 25 ? "text-sm" : "text-lg"
                }`}
              >
                Chủ đề: {topic}
              </p>
            </div>
            <div>
              <img
                src="/images/question/bang_cauhoi.png"
                alt="Question Box"
                className="w-[90%] lg:w-[90%] lg:h-[200px]"
              />
              <p
                className={`absolute inset-0 flex items-center justify-center text-lg text-black w-[85%] px-2 mx-2 my-2 ${
                  questions[currentQuestionIndex].questionText.length > 20
                    ? "text-sm"
                    : "text-lg"
                }`}
              >
                {questions[currentQuestionIndex].questionText}
              </p>
            </div>
            <div className="absolute font-semibold mt-2 text-lg text-black z-10 left-[35%]">
              Câu {currentQuestionIndex + 1}/{questions.length}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-10 z-50">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)} // Truyền đáp án đã chọn
                className="relative"
              >
                <div className="relative flex flex-col items-center">
                  <img
                    src={`/images/question/${index + 1}.png`}
                    alt={`Number ${index + 1}`}
                    className={`absolute ${
                      index < 2 ? "top-[-20px]" : "top-[120px]"
                    } w-[20px] mb-2`}
                  />
                  <img
                    src="/images/question/bang_traloi.png"
                    alt={`Option ${index}`}
                    className="w-[160px]"
                  />
                  <p
                    className={`absolute inset-0 flex items-center justify-center text-black px-2 ${
                      option.length > 50 && option.length <= 100
                        ? "text-sm"
                        : option.length > 100
                        ? "text-xs"
                        : "text-lg"
                    }`}
                  >
                    {option}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Modal khi trả lời */}
        {isAnswerCorrect !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="p-6 bg-white rounded-lg flex flex-col items-center">
              {isAnswerCorrect ? (
                <>
                  {/* Check if there is an explanation for this question */}
                  {questions[currentQuestionIndex].explanation ? (
                    <>
                      <div className="relative">
                        <img
                          src="/images/Modal/9.png"
                          alt="Correct with Explanation"
                          className="w-[500px] lg:w-[300px]"
                        />
                        <p className=" w-[43%] absolute top-[33%] right-0 mr-4 mt-4 text-green-500 text-xs font-bold">
                          {questions[currentQuestionIndex].explanation}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src="/images/Modal/11.png"
                        alt="Correct"
                        className="w-[200px]"
                      />
                      <p className="text-green-500 font-bold">
                        Bạn đã trả lời đúng!
                      </p>
                    </>
                  )}
                </>
              ) : (
                <>
                  {questions[currentQuestionIndex].explanation ? (
                    <>
                      <div className="relative">
                        <img
                          src="/images/Modal/8.png"
                          alt="Correct with Explanation"
                          className="w-[500px] lg:w-[300px]"
                        />
                        <p className=" w-[43%] absolute top-[33%] right-0 mr-4 mt-4 text-red-500 text-xs font-bold">
                          {questions[currentQuestionIndex].explanation}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src="/images/Modal/10.png"
                        alt="Incorrect"
                        className="w-[200px]"
                      />
                      <p className="text-red-500 font-bold">
                        Bạn đã trả lời sai!
                      </p>
                    </>
                  )}
                </>
              )}
              <button
                onClick={handleNextQuestion}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Câu tiếp theo nào
              </button>
            </div>
          </div>
        )}

        {/* Modal khi hết lượt */}
        {outOfLives && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="p-6 bg-[#bfe9ff] rounded-lg flex flex-col items-center h-full w-full">
              <img
                src="/images/hetluot/2.png"
                alt="Out of Lives"
                className="w-[300px]"
              />
              <p className="text-red-500 font-bold">Bạn đã hết tim rùi!</p>
              <button
                onClick={endGame}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Quay lại trang chủ
              </button>
            </div>
          </div>
        )}

        {/* Modal khi hoàn thành */}
        {completed && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div
              className="relative p-6 bg-cover bg-center overflow-hidden rounded-lg flex flex-col items-center h-full w-full "
              // className="relative h-screen bg-cover bg-center overflow-hidden w-full"
              style={{ backgroundImage: "url(/images/hoanthanh/27.png)" }}
            >
              <div className="mt-[40%]">
                {modalStep === 1 && (
                  <div className="">
                    <img
                      src="/images/hoanthanh/1.png"
                      alt="Completed"
                      className="w-[320px]"
                      onClick={handleButtonClick}
                    />
                  </div>
                )}

                {modalStep === 2 && (
                  <div className="relative">
                    <img
                      src="/images/hoanthanh/2.png"
                      alt="Next Modal"
                      className="mt-3 w-[320px]"
                    />
                    <img
                      src={`/images/bogoc/${images[0].image}`}
                      alt="Next Modal"
                      className="absolute top-[15px] left-[20px] mt-3 w-[150px]"
                    />
                    <p className="absolute top-[154.5px] left-[190px] text-sm text-black font-semibold">
                      {images[0].nameImage}
                    </p>
                    <button
                      onClick={handleFinish} // Example of closing the modal
                      className="absolute top-[250px] right-[20px] mt-4 px-4 py-2 text-white"
                    >
                      <img
                        src="/images/hoanthanh/6.png"
                        alt="Back"
                        className="w-[100px]"
                      />
                    </button>
                    <p className="mt-[90px] text-lg text-black font-semibold">
                      Sưu tập trọn bộ 20 bo góc để trở thành Em Bé Phật Tử chính
                      hiệu nhaaa !!!!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Background Image */}
        <div className="absolute bottom-0 left-0 right-0">
          <img src="/images/question/dat.png" alt="Ground" className="w-full" />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default QuizScreen;
