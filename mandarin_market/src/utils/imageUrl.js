import defaultImage from "../assets/images/basic-profile.png";

// 서버의 기본 URL 정의
const IMAGE_BASE_URL = "https://dev.wenivops.co.kr/services/mandarin";

/**
 * 파일 이름을 완전한 이미지 URL로 변환합니다.
 * 여러 이미지 파일명이 쉼표로 구분된 경우 첫 번째 이미지만 사용합니다.
 * @param {string} imagePath - API로부터 받은 이미지 경로
 * @returns {string} - 완전한 이미지 URL 또는 기본 이미지 URL
 */
export const generateImageUrl = (imagePath) => {
  // 1. imagePath가 비어있거나, 문자열이 아니면 기본 이미지를 반환합니다.
  if (!imagePath || typeof imagePath !== "string") {
    return defaultImage;
  }

  // 2. 여러 이미지가 쉼표로 구분되어 있다면, 첫 번째 이미지만 사용합니다.
  let targetPath = imagePath;
  if (imagePath.includes(",")) {
    targetPath = imagePath.split(",")[0].trim();
  }

  // 3. URL이 중복되는 문제 처리
  const duplicateUrlPattern =
    /https:\/\/dev\.wenivops\.co\.kr\/services\/mandarin\/https:\/\/dev\.wenivops\.co\.kr\/services\/mandarin\//g;
  if (duplicateUrlPattern.test(targetPath)) {
    targetPath = targetPath.replace(
      "https://dev.wenivops.co.kr/services/mandarin/",
      ""
    );
  }

  // 4. 이미 완전한 URL 형태이면 그대로 반환합니다.
  if (targetPath.startsWith("http://") || targetPath.startsWith("https://")) {
    return targetPath;
  }

  // 5. 경로가 /로 시작하면 앞에 슬래시를 제거
  const cleanPath = targetPath.startsWith("/")
    ? targetPath.slice(1)
    : targetPath;

  // 6. Ellipse.png인 경우 로컬 이미지로 바로 대체
  if (cleanPath === "Ellipse.png" || cleanPath === "/Ellipse.png") {
    return defaultImage;
  }

  // 7. 이미지 서버 기본 URL과 합쳐서 완전한 주소를 만듭니다.
  return `${IMAGE_BASE_URL}/${cleanPath}`;
};
