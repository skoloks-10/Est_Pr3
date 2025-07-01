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
      // encodeURIComponent()를 적용하여 한글과 특수문자를 안전하게 인코딩
      const encodedKeyword = encodeURIComponent(searchKeyword);

      const response = await fetch(
        `https://dev.wenivops.co.kr/services/mandarin/user/searchuser/?keyword=${encodedKeyword}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        }
      );
      const data = await response.json();

      // 응답 데이터 구조 디버깅
      console.log("API 검색 응답 데이터:", data);

      // 데이터가 배열인지 확인하고 적절히 처리
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && typeof data === "object") {
        // API가 { users: [...] } 또는 다른 구조로 반환할 경우를 대비
        // 객체에 users 키가 있는지 확인
        if (data.users && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          console.error("예상치 못한 응답 형식:", data);
          setUsers([]); // 빈 배열로 설정
        }
      } else {
        setUsers([]); // 빈 배열로 설정
      }
    } catch (error) {
      console.error("사용자 검색에 실패했습니다:", error);
      setUsers([]); // 오류 시 빈 배열로 설정
    }
  };

  const escapeRegExp = (string) => {
    // 정규표현식 특수 문자를 이스케이프 처리합니다
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const highlightKeyword = (text, keyword) => {
    if (!keyword) return text;
    try {
      // 검색어를 정규식으로 사용하기 전에 특수 문자들을 이스케이프 처리
      const escapedKeyword = escapeRegExp(keyword);
      const parts = text.split(new RegExp(`(${escapedKeyword})`, "gi"));
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
    } catch (error) {
      console.error("키워드 강조 처리 중 오류:", error);
      // 오류 발생시 원본 텍스트 반환
      return text;
    }
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
            to={`/profile/${encodeURIComponent(user.accountname)}`}
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
