import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function QuizStartPage() {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [username, setUsername] = useState(""); // State để lưu username
  const [password, setPassword] = useState(""); // State để lưu password
  const [confirmPassword, setConfirmPassword] = useState(""); // State để lưu confirm password
  const [errorMessage, setErrorMessage] = useState(""); // State để hiển thị lỗi đăng ký
  const [loginUsername, setLoginUsername] = useState(""); // State to store username
  const [loginPassword, setLoginPassword] = useState(""); // State to store password
  const [loginError, setLoginError] = useState(""); // State to store error message

  const handleStartClick = () => {
    navigate("/quiz-selection");
  };

  useEffect(() => {
    // Check if the user is already logged in
    const token = localStorage.getItem("tokenALPT");
    if (token) {
      // If logged in, navigate directly to quiz selection page
      setIsLoginModalOpen(false);
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    try {
      // Call login API
      const response = await axios.post("/users/login", {
        username: loginUsername,
        password: loginPassword,
      });

      // If login is successful
      if (response.status === 200) {
        // Store token (optional)
        localStorage.setItem("tokenALPT", response.data.token);
        localStorage.setItem("userId", response.data.user.id);
        setIsLoginModalOpen(false);
        toast.success("Đăng nhập thành công, chiến thôi nào !!!");
      }
    } catch (error) {
      // Handle login error
      setLoginError("Sai tài khoản & mật khẩu ???");
    }
  };

  const handleRegisterClick = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true); // Open register modal
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu không trùng rùi!!!");
      return;
    }

    try {
      const response = await axios.post("/users/register", {
        username,
        password,
        confirmPassword,
      });

      if (response.status === 201) {
        // Đăng ký thành công
        setIsRegisterModalOpen(false);
        setIsLoginModalOpen(true);
        toast.success("Đăng ký thành công");
      }
    } catch (error) {
      // Hiển thị thông báo lỗi cụ thể từ server
      setErrorMessage(
        error.response && error.response.data
          ? error.response.data.message
          : "Registration failed: " + error.message
      );
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      // audioRef.current.play();
    }
  }, []);

  return (
    <div className="relative w-full max-w-full lg:max-w-[500px] mx-auto">
      <audio ref={audioRef} src="/images/IgHome/start.mp3" loop />

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ">
          <div className="bg-[#c0c0c0] border-2 border-black p-6 rounded-lg shadow-lg w-[80%] lg:w-[25%]">
            <h2 className="text-xl font-bold mb-4">Đăng nhập !!!</h2>
            {loginError && <p className="text-red-500">{loginError}</p>}{" "}
            {/* Display error message */}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-black">Tài khoản</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Nhập tài khoản của bạn"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)} // Update username
                />
              </div>
              <div className="mb-4">
                <label className="block text-black ">Mật khẩu</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Nhập mật khẩu của bạn"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)} // Update password
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Đăng ký
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-[#c0c0c0] border-2 border-black p-6 rounded-lg shadow-lg w-[80%] lg:w-[25%]">
            <h2 className="text-xl font-bold mb-4">Đăng ký</h2>
            <form>
              <div className="mb-4">
                <label className="block text-black">Tài khoản</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Nhập tài khoản"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} // Cập nhật giá trị username
                />
              </div>
              <div className="mb-4">
                <label className="block text-black">Mật khẩu</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Cập nhật giá trị password
                />
              </div>
              <div className="mb-4">
                <label className="block text-black">Nhập lại mật khẩu</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} // Cập nhật confirm password
                />
              </div>
              {errorMessage && (
                <div className="mb-4 text-red-600">{errorMessage}</div>
              )}
              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  onClick={handleRegister}
                >
                  Đăng ký
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsRegisterModalOpen(false);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Trở về
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div
        className="relative h-screen bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url(/images/IgHome/nen.png)" }}
      >
        {/* Title Images */}
        <div className="relative">
          {/* Sun and Buddha Image */}
          <img
            src="images/IgHome/phat.png"
            alt="Sun and Buddha"
            className="absolute left-[220px] md:left-[350px] lg:left-1/2 transform -translate-x-1/2 w-[250px]"
          />

          {/* AI LÀ PHẬT TỬ? Title Image */}
          <img
            src="images/IgHome/phude1.png"
            alt="AI LÀ PHẬT TỬ?"
            className="absolute top-[40px] left-1/2 transform -translate-x-1/2 w-72"
          />

          {/* QUIZZ PHẬT HỌC Title Image */}
          <img
            src="images/IgHome/phude2.png"
            alt="QUIZZ PHẬT HỌC"
            className="absolute top-[120px] left-1/2 transform -translate-x-1/2 w-72"
          />
          <img
            src="images/IgHome/may1.png"
            alt="Mây 1"
            className="absolute top-[30px] left-[30px] lg:left-[400px] transform -translate-x-1/2 w-[100px]"
          />
          <img
            src="images/IgHome/may1.png"
            alt="Mây 1"
            className="absolute top-[200px] right-[-30px] lg:right-[400px] transform w-[100px]"
          />
          <img
            src="images/IgHome/may2.png"
            alt="Mây 2"
            className="absolute top-[200px] left-[50px] lg:left-[500px] transform -translate-x-1/2 w-[80px]"
          />
          <img
            src="images/IgHome/may2.png"
            alt="Mây 2"
            className="absolute top-[30px] right-[10px] lg:right-[500px] transform w-[70px]"
          />
        </div>

        {/* Character */}
        <div className="relative">
          <img
            src="/images/IgHome/hoasen.png"
            alt="Character"
            className="absolute top-[328px] left-[20px] lg:left-[600px] xl:left-[220px] transform w-[200px]"
          />
          <img
            src="/images/IgHome/chua.png"
            alt="Character"
            className="absolute top-[318px] right-[10px] lg:right-[600px] xl:right-[240px] transform w-[200px]"
          />
          <img
            src="/images/IgHome/embe.png"
            alt="Character"
            className="absolute top-[270px] left-1/2 transform -translate-x-1/2 w-[220px]"
          />
        </div>

        {/* Button */}
        <div className="relative">
          <img
            onClick={handleStartClick}
            src="/images/IgHome/batdau.png"
            alt="Character"
            className="absolute cursor-pointer top-[350px] left-1/2 transform -translate-x-1/2 w-[300px] z-40"
          />
          <img
            onClick={handleStartClick}
            src="/images/IgHome/Click.png"
            alt="Character"
            className="absolute top-[500px] left-2/3 xl:left-[1050px] transform -translate-x-1/2 w-[20px] z-40"
          />
        </div>

        {/* Ground Image */}
        <div className="relative h-screen">
          <img
            src="/images/IgHome/dat.png"
            alt="Ground"
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 sm:h-auto lg:h-40 w-full z-20"
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default QuizStartPage;
