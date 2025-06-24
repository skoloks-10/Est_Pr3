import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchHeader from "../components/common/SearchHeader";
import Footer from "../components/common/Footer";
import { generateImageUrl } from "../utils/imageUrl"; // 1. imageUrl.js에서 함수를 가져옵니다.
import defaultImage from "../assets/images/basic-profile.png"; // 2. 기본 이미지를 가져옵니다.
import "../styles/SearchPage.css";

const SearchPage = () => {
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (keyword) {
        searchUsers(keyword);
      } else {
        setUsers([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [keyword]);

  const searchUsers = async (searchKeyword) => {
    const token = localStorage.getItem("token");
    try {
      // 🔴 API 주소 오타 수정: 'estapi' -> 'api'
      const response = await fetch(
        `https://estapi.mandarin.weniv.co.kr/user/searchuser/?keyword=${searchKeyword}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        }
      );
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("사용자 검색에 실패했습니다:", error);
    }
  };

  const highlightKeyword = (text, keyword) => {
    if (!keyword) return text;
    const parts = text.split(new RegExp(`(${keyword})`, "gi"));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === keyword.toLowerCase() ? (
            <strong key={index} className="highlight">
              {part}
            </strong>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // 이미지 로딩 실패 시 기본 이미지로 교체하는 함수
  const handleImgError = (e) => {
    e.target.src = defaultImage;
  };

  return (
    <div className="search-page-container">
      <SearchHeader keyword={keyword} setKeyword={setKeyword} />
      <main className="search-main-content">
        {users.map((user) => (
          <Link
            to={`/profile/${user.accountname}`}
            key={user._id}
            className="user-item"
          >
            <img
              // 3. generateImageUrl 함수로 user.image 값을 처리하여 src에 넣습니다.
              src={generateImageUrl(user.image)}
              alt={`${user.username} 프로필`}
              className="user-profile-img"
              onError={handleImgError} // 4. 이미지 로딩 실패에 대비합니다.
            />
            <div className="user-info">
              <p className="user-name">
                {highlightKeyword(user.username, keyword)}
              </p>
              <p className="user-account">
                @{highlightKeyword(user.accountname, keyword)}
              </p>
            </div>
          </Link>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
