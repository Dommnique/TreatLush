import "../../app/pagenotfound/pagenotfound.css";
import { FiSearch } from "react-icons/fi";

function PageNotFound() {
  return (
    <div>
      <section className="Notfound-page">
        <div className="subcon">
          <div className="icon">
            <FiSearch />
          </div>
          <div className="Notfound-info">
            <div className="code-row">
              <span className="digit">4</span>
              <span className="digit">0</span>
              <span className="digit">4</span>
            </div>
            <h1 className="display">Oops! This Treat Doesn't Exist</h1>
            <p className="sub">
              The product you're looking for isn't on our menu. It may have been
              removed, renamed , or the link just isn't right.
            </p>
          </div>
          <div className="btn-row">
            <a href="/">
              <button className="btn-primary">Back to Home</button>
            </a>

            <a href="/products">
              <button className="btn-outline">Browse Products</button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PageNotFound;
