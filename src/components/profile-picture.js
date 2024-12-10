import React from "react";

const ProfilePicture = ({ src, alt, size = 100 }) => {
  const style = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  return (
    <div style={style}>
      <img src={src} alt={alt} style={imgStyle} />
    </div>
  );
};

export default ProfilePicture;
