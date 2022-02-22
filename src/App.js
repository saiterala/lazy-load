import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const URL = "https://reqres.in/api/users";

function App() {
  const [appData, setData] = useState({
    list: [],
    currentPage: 0,
    isLoading: false,
    error: false,
  });
  const appDataRef = useRef({})
  appDataRef.current = appData

  const timerId = useRef()
  
  const fetchData = async () => {
    const { list, currentPage } = appDataRef.current;
    try {
      setData({
        list,
        error: false,
        isLoading: true,
        currentPage
      });

      const res = await fetch(`${URL}?page=${currentPage + 1}`);
      const { data } = await res.json();

      setData({
        list: [...list, ...data],
        currentPage: currentPage + 1,
        isLoading: false,
        error: false
      });
    } catch (e) {
      setData({
        error: true,
        isLoading: false
      });
    }
  };

  const handleLazyLoad = () => {
    const advance = 100;
    const innerHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const offsetHeight = document.body.offsetHeight;

    if (advance + scrollY + innerHeight >= offsetHeight) {
      clearTimeout(timerId.current)
      timerId.current = setTimeout(() => {
        fetchData();
        clearTimeout(timerId.current)
      }, 500)
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener("scroll", handleLazyLoad);
    window.addEventListener("resize", handleLazyLoad);

    return () => {
      window.removeEventListener("scroll", handleLazyLoad);
      window.removeEventListener("resize", handleLazyLoad);
    };
  },[]);

  const {list, isLoading, error} = appData
  const items = 
    list.map((e) => (
      <div key={e.id} className="item">
        <div className="wrapper">
          <img src={e.avatar} alt={e.first_name} />
          <span>
            Name: {e.first_name} {e.last_name}
          </span>
          <span>Email: {e.email}</span>
        </div>
      </div>
    ));

  return (
    <React.Fragment>
      {isLoading && <div className="fullScreenLoader"></div>}
      <div className="container">{items }</div>
      {error && (
        <div className="error">
          {" "}
          There was some error while fetching the data
        </div>
      )}
    </React.Fragment>
  );
}

export default App;
