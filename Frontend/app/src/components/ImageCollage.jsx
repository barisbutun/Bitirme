import { Modal } from "antd";
import { useState } from "react";

const ImageCollage = ({ products = [] }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const images = products?.flatMap((product) => product.image || []);
  const maxDisplay = 4;

  const handlePreview = (img) => {
    setPreviewImage(img);
    setPreviewVisible(true);
  };

  return (
    <>
      <div style={{ position: "relative", width: "60px", height: "60px" }}>
        {images.slice(0, maxDisplay).map((imgSrc, index) => (
          <div
            key={index}
            onClick={() => handlePreview(imgSrc)}
            style={{
              position: "absolute",
              top: `${index * 8}px`, // Burayı değiştiriyoruz
              left: `${index * 8}px`, // Burayı değiştiriyoruz
              width: "40px",
              height: "40px",
              borderRadius: "6px",
              overflow: "hidden",
              border: "1px solid #fff",
              zIndex: images.length - index,
              cursor: "pointer",
              boxShadow: "0 0 3px rgba(0,0,0,0.2)",
              backgroundColor: "#f0f0f0",
            }}
          >
            <img
              src={imgSrc}
              alt={`Ürün ${index + 1}`}
              onError={(e) => (e.target.style.display = "none")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
            {index === maxDisplay - 1 && images.length > maxDisplay && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  borderRadius: "6px",
                }}
              >
                +{images.length - maxDisplay}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="Preview" src={previewImage} style={{ width: "100%" }} />
      </Modal>
    </>
  );
};
export default ImageCollage;
