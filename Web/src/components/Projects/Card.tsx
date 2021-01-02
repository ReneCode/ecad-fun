import React from "react";

import "./Card.scss";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
};
const Card: React.FC<Props> = ({ children, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
