import React from "react";
import { generateImageUrl } from "../../utils/imageUrl";
import defaultImage from "../../assets/images/default-profile.svg"; // 상품 이미지가 없을 때를 대비한 기본 이미지
import "../../styles/profile/ProductList.css";

const ProductList = ({ products = [] }) => {
  // 상품이 없으면 아무것도 렌더링하지 않습니다.
  if (!products || products.length === 0) {
    return null;
  }

  const handleImgError = (e) => {
    e.target.src = defaultImage;
  };

  return (
    <section className="product-list-section">
      <h2 className="product-list-title">판매 중인 상품</h2>
      <div className="product-list-container">
        {products.map((product) => {
          // 1. 쉼표로 구분된 이미지 문자열에서 첫 번째 이미지만 가져옵니다.
          const firstImage = product.itemImage
            ? product.itemImage.split(",")[0].trim()
            : "";

          return (
            <article key={product.id} className="product-item">
              {/* 상품 판매 링크(product.link)로 이동하는 a 태그 */}
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="product-link"
              >
                <div className="product-image-wrapper">
                  <img
                    // 2. 첫 번째 이미지에 대해서만 URL을 생성합니다.
                    src={generateImageUrl(firstImage)}
                    alt={product.itemName}
                    className="product-image"
                    onError={handleImgError}
                  />
                </div>
                <p className="product-name">{product.itemName}</p>
                <p className="product-price">{`${product.price.toLocaleString()}원`}</p>
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ProductList;
