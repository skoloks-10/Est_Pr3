import React, { useState } from "react";
import { Link } from "react-router-dom";
import { generateImageUrl } from "../../utils/imageUrl";
import defaultImage from "../../assets/images/default-profile.svg";
import "../../styles/profile/UserListItem.css";

const UserListItem = ({ user, onFollowToggle }) => {
  const myAccountname = localStorage.getItem("accountname");
  const [isFollowing, setIsFollowing] = useState(user.isfollow);
  const showButton = user.accountname !== myAccountname;

  const handleFollow = async () => {
    const token = localStorage.getItem("token");
    const action = isFollowing ? "unfollow" : "follow";
    const method = isFollowing ? "DELETE" : "POST";

    try {
      const res = await fetch(
        `https://dev.wenivops.co.kr/services/mandarin/profile/${user.accountname}/${action}`,
        {
          method: method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (data.profile) {
        setIsFollowing(data.profile.isfollow);
        // 부모 컴포넌트에 변경사항을 알리는 콜백 함수 호출
        if (onFollowToggle) {
          onFollowToggle(user.accountname, data.profile.isfollow);
        }
      }
    } catch (error) {
      console.error("팔로우 처리 중 오류:", error);
      alert(error.message);
    }
  };

  // 이미지 로딩 실패 시 기본 이미지로 교체하는 함수
  const handleImgError = (e) => {
    e.target.src = defaultImage;
  };

  return (
    <div className="user-list-item">
      <Link to={`/profile/${user.accountname}`} className="user-link">
        <img
          // 3. generateImageUrl 함수를 사용하여 올바른 이미지 주소 생성
          src={generateImageUrl(user.image)}
          alt={`${user.username}의 프로필`}
          className="user-image"
          onError={handleImgError} // 4. 이미지 로딩 실패 대비
        />
        <div className="user-details">
          <p className="user-name">{user.username}</p>
          <p className="user-intro">{user.intro}</p>
        </div>
      </Link>

      {/* 팔로우/언팔로우 버튼 (기능이 이미 구현되어 있다고 가정) */}
      {showButton && (
        <button
          onClick={handleFollow}
          className={`follow-button ${isFollowing ? "cancel" : ""}`}
        >
          {isFollowing ? "취소" : "팔로우"}
        </button>
      )}
    </div>
  );
};

export default UserListItem;
