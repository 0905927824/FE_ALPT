import axios from "../utils/axiosConfig";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function QuizSelectionScreen() {
  const [levels, setLevels] = useState([]); // State để lưu danh sách level từ API
  const [userProgress, setUserProgress] = useState([]); // State để lưu tiến trình người chơi từ API
  const navigate = useNavigate(); // Sử dụng hook để điều hướng
  const [modalOpen, setModalOpen] = useState(false);
  const [numberLevel, setNumberLevel] = useState();
  const [idLevel, setIdLevel] = useState();

  const audioRef = useRef(null);

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Lấy userId từ localStorage hoặc nguồn khác
        const response = await axios.get(`/users/${userId}/progress`); // Gọi API lấy tiến trình người chơi
        setUserProgress(response.data); // Lưu tiến trình vào state
      } catch (error) {
        console.error("Error fetching user progress:", error);
      }
    };

    fetchUserProgress();
  }, []);

  // Gọi API để lấy danh sách các level
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await axios.get("levels"); // URL API của bạn
        setLevels(response.data); // Lưu dữ liệu trả về từ API vào state
      } catch (error) {
        console.error("Error fetching levels:", error);
      }
    };
    fetchLevels();
  }, []);

  const handleStartClick = () => {
    // Điều hướng đến trang chọn màn
    navigate("/");
  };

  const handleLevelSelect = (levelId, levelNumber) => {
    // Kiểm tra điều kiện chọn màn
    if (levelNumber > 1) {
      const previousLevelCompleted = userProgress.some(
        (progress) => progress.level.levelNumber === levelNumber - 1
      );

      if (!previousLevelCompleted) {
        // Hiển thị thông báo nếu màn trước chưa hoàn thành
        toast.error(
          "Bạn chưa vượt qua màn trước nên không được chọn màn này.",
          2000
        );
        return;
      }
    }
    setNumberLevel(levelNumber);
    setIdLevel(levelId);
    setModalOpen(true);
  };

  const next = () => {
    navigate(`/level/${idLevel}`);
  };
  // Hàm kiểm tra xem màn đã hoàn thành chưa
  const isLevelCompleted = (levelId) => {
    return userProgress.some((progress) => progress.level._id === levelId);
  };

  return (
    <div className="relative w-full max-w-full lg:max-w-[500px] mx-auto">
      <ToastContainer /> {/* Container cho toast */}
      <audio ref={audioRef} src="/images/trang_chon_man/choose.mp3" loop />
      {modalOpen && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className="relative p-6 bg-cover bg-center overflow-hidden rounded-lg flex flex-col items-center h-full w-full "
            // className="relative h-screen bg-cover bg-center overflow-hidden w-full"
            style={{ backgroundImage: "url(/images/hoanthanh/27.png)" }}
          >
            <div className="mt-[60%] flex flex-col items-center justify-center w-full">
              {" "}
              {/* Đảm bảo các hình ảnh được căn giữa */}
              <img
                src={`/images/chude/${numberLevel}.png`}
                alt="123"
                className="w-[100%] mb-2"
              />
              <img
                src="images/chude/play.png"
                alt="Chơi tiếp"
                className="w-[50%] mb-2"
                onClick={() => next()}
              />
              <img
                src="images/chude/return.png"
                alt="Trở về"
                className="w-[50%] mb-2"
                onClick={() => {
                  setModalOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
      <div className="relative h-screen bg-cover bg-[#bfe9ff] bg-center overflow-hidden">
        {/* Grid for cards */}
        <div className="grid grid-cols-4 gap-6 justify-items-center mx-5 my-[10px] z-20 h-auto">
          {levels.map((level, index) => {
            const levelCompleted = isLevelCompleted(level._id); // Kiểm tra xem màn đã hoàn thành hay chưa
            const cardImage = levelCompleted
              ? `/images/bogoc/${level.images[0]?.image}` // Đường dẫn ảnh màn đã hoàn thành
              : `/images/trang_chon_man/Element.png`; // Đường dẫn ảnh mặc định
            return (
              <div
                key={level._id}
                onClick={() => handleLevelSelect(level._id, level.levelNumber)}
                className="relative mb-2 z-10"
              >
                {/* Card Image */}
                <img
                  src={cardImage}
                  alt={`Card ${index + 1}`}
                  className="w-[50px] mb-2"
                />
                {/* Number Image */}
                <img
                  src={`/images/trang_chon_man/${level.levelNumber}.png`}
                  alt={`Number ${level.levelNumber}`}
                  className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-[30px]"
                />
              </div>
            );
          })}
        </div>

        {/* Background Image (like the grass and trees) */}
        <div className="absolute bottom-0 left-0 right-0">
          <img
            onClick={() => handleStartClick()}
            src="/images/trang_chon_man/quay_ve.png"
            alt="Ground"
            className="absolute bottom-[30px] right-[20px] transform -translate-x-1/2 w-[60px] z-[49]"
          />
          <img
            src="/images/trang_chon_man/dat.png"
            alt="Ground"
            className="w-full"
          />
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default QuizSelectionScreen;
