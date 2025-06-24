import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileHeader from "../common/ProfileHeader";
import ProfileInfo from "../profile/ProfileInfo";
import ProductList from "../profile/ProductList";
import PostList from "../profile/PostList";
import Footer from "../common/Footer";
import "../../styles/ProfilePage.css";

const ProfilePage = () => {
  const { accountname } = useParams();
  const navigate = useNavigate();

  // 1. 상태 관리 세분화
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true); // 전체 페이지 초기 로딩
  const [isPostsLoading, setIsPostsLoading] = useState(false); // 게시물 추가 로딩
  const [hasMorePosts, setHasMorePosts] = useState(true); // 더 불러올 게시물이 있는지
  const [skip, setSkip] = useState(0); // 건너뛸 게시물 수
  const POST_LIMIT = 10; // 한 번에 불러올 게시물 수

  const myAccountname = localStorage.getItem("accountname");
  const isMyProfile = accountname === myAccountname;

  // 2. 게시물만 불러오는 함수 (useCallback으로 최적화)
  const fetchPosts = useCallback(async () => {
    if (isPostsLoading || !hasMorePosts) return;

    setIsPostsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `https://estapi.mandarin.weniv.co.kr/post/${accountname}/userpost?limit=${POST_LIMIT}&skip=${skip}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      if (data.post && data.post.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...data.post]);
        setSkip((prevSkip) => prevSkip + data.post.length);
      } else {
        setHasMorePosts(false);
      }
    } catch (error) {
      console.error("게시물을 불러오는 데 실패했습니다.", error);
    } finally {
      setIsPostsLoading(false);
    }
  }, [accountname, isPostsLoading, hasMorePosts, skip]);

  // 3. 초기 데이터 로딩 (프로필, 상품, 첫 페이지 게시물)
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsPageLoading(true);
      // 프로필이 바뀔 때마다 상태 초기화
      setProfile(null);
      setProducts([]);
      setPosts([]);
      setSkip(0);
      setHasMorePosts(true);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };

      try {
        // 프로필 정보와 상품 정보를 동시에 요청
        const [profileRes, productRes] = await Promise.all([
          fetch(`https://estapi.mandarin.weniv.co.kr/profile/${accountname}`, {
            headers,
          }),
          fetch(`https://estapi.mandarin.weniv.co.kr/product/${accountname}`, {
            headers,
          }),
        ]);

        const profileData = await profileRes.json();
        const productData = await productRes.json();

        setProfile(profileData.profile);
        setProducts(productData.product || []);

        // 프로필, 상품 로딩 후 첫 페이지 게시물 로딩 시작
        // fetchPosts를 직접 호출하는 대신, 초기 상태를 설정하여 첫 로드를 유도할 수 있습니다.
        // 여기서는 명시적으로 호출합니다.
        if (profileData.profile) {
          // 첫 게시물 로드를 위해 임시로 상태를 조작하여 fetchPosts를 호출합니다.
          // 더 나은 방법은 별도의 초기 로드 함수를 사용하는 것이지만, 여기서는 간결함을 위해 이렇게 처리합니다.
          const initialPostRes = await fetch(
            `https://estapi.mandarin.weniv.co.kr/post/${accountname}/userpost?limit=${POST_LIMIT}&skip=0`,
            { headers }
          );
          const initialPostData = await initialPostRes.json();
          if (initialPostData.post && initialPostData.post.length > 0) {
            setPosts(initialPostData.post);
            setSkip(initialPostData.post.length);
          } else {
            setHasMorePosts(false);
          }
        }
      } catch (error) {
        console.error("프로필 데이터를 불러오는 데 실패했습니다.", error);
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchInitialData();
  }, [accountname, navigate]); // accountname이 바뀔 때마다 모든 데이터를 새로 불러옵니다.

  // 4. 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200
      ) {
        fetchPosts();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchPosts]);

  const handleFollowToggle = async () => {
    // 팔로우/언팔로우 로직 (기존과 동일)
    // ...
  };

  if (isPageLoading)
    return <div className="loading-indicator">프로필을 불러오는 중...</div>;

  return (
    <div className="profile-page-container">
      <ProfileHeader />
      <main className="profile-page-main">
        {profile && (
          <>
            <ProfileInfo
              profile={profile}
              isMyProfile={isMyProfile}
              isFollowing={profile.isfollow}
              onFollowToggle={handleFollowToggle}
            />
            <ProductList products={products} />
            <PostList posts={posts} />
            {isPostsLoading && (
              <div className="loading-indicator">
                게시물을 더 불러오는 중...
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
