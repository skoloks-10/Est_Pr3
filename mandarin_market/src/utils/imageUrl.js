import defaultImage from "../assets/images/basic-profile.png";

const IMAGE_BASE_URL = "https://estapi.mandarin.weniv.co.kr/";

/**
 * 파일 이름을 완전한 이미지 URL로 변환합니다.
 * 여러 이미지 파일명이 쉼표로 구분된 경우 첫 번째 이미지만 사용합니다.
 * @param {string} filename - API로부터 받은 이미지 파일 이름(들)
 * @returns {string} - 완전한 이미지 URL 또는 기본 이미지 URL
 */
export const generateImageUrl = (filename) => {
  // 1. filename이 비어있거나, 문자열이 아니면 기본 이미지를 반환합니다.
  if (!filename || typeof filename !== "string") {
    return defaultImage;
  }

  // 2. 여러 이미지가 쉼표로 구분되어 있다면, 첫 번째 이미지만 사용하도록 처리합니다.
  //    이것이 이번 수정의 핵심입니다.
  let targetFilename = filename;
  if (filename.includes(",")) {
    targetFilename = filename.split(",")[0].trim();
  }

  // 3. filename이 이미 완전한 URL 형태이면 그대로 반환합니다. (방어 코드)
  if (
    targetFilename.startsWith("http://") ||
    targetFilename.startsWith("https://")
  ) {
    return targetFilename;
  }

  // 4. 파일 이름 앞에 이미지 서버 기본 URL을 붙여 완전한 주소를 만듭니다.
  return IMAGE_BASE_URL + targetFilename;
};
