import { Link } from "react-router-dom";

import "./Home.scss";

const Home = () => {
  return (
    <div className="Home">
      <Link to="/p/abc">abc</Link>
    </div>
  );
};

export default Home;
