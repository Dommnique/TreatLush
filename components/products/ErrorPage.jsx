function ErrorPage(props) {
  const setDisplay = props.setItem;
  const fullArr = props.arrItem;
  const setActive = props.activeItem;
  const setTheSearchValue = props.setSearchValue;

  return (
    <div>
      <div className="error-state">
        <div className="error-icon">🥣</div>
        <h3>No treat match that search</h3>
        <p>
          Please enter a different product or <br /> clear your filter to see
          full menu
        </p>
        <button
          className="clearfilter-btn"
          onClick={() => {
            setDisplay(fullArr);
            setActive("All");
            setTheSearchValue("");
          }}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;
