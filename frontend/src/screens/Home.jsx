import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Cards";  

export default function Home() {
  const [search, setSearch] = useState("");
  const [foodItems, setFoodItems] = useState([]);
  const [foodCat, setFoodCat] = useState([]);

  const loadData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/food_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFoodItems(data[0] || []);
      setFoodCat(data[1] || []);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div>
        <Navbar search={search} setSearch={setSearch} />
      </div>
      <div>
        <div
          id="carouselExampleControlsNoTouching"
          className="carousel slide"
          data-bs-touch="false"
          style={{ objectFit: "contain !important" }}
        >
          <div className="carousel-inner" style={{ maxHeight: "none", height: "100vh" }}>
            <div className="carousel-caption z-1">
              <div className="d-flex justify-content-center" role="search">
                <input
                  className="form-control me-2 text-white"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  style={{
                    background: "#181818",
                    color: "white",
                    WebkitTextFillColor: "white",
                  }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="carousel-item active mt-5 position-relative pt-3 mb-5">
              <img
                src="https://images.unsplash.com/photo-1528873981-36c6afde7b9d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="d-block w-100"
                style={{ filter: "brightness(30%)" }}
                alt="..."
              />
            </div>
            <div className="carousel-item mb-5 pb-5">
              <img
                src="https://plus.unsplash.com/premium_photo-1677003833682-bfc88d4d7b85?q=80&w=1882&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="d-block w-100"
                style={{ filter: "brightness(30%)" }}
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://plus.unsplash.com/premium_photo-1695822018668-72355fc4ee7c?q=80&w=1848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="d-block w-100"
                style={{ filter: "brightness(30%)" }}
                alt="..."
              />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleControlsNoTouching"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleControlsNoTouching"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <div className="container">
        {foodCat.length > 0 ? (
          foodCat.map((category) => (
            <div key={category._id} className="row mb-3">
              <div className="fs-3 m-3">{category.CategoryName}</div>
              <hr />
              {foodItems.length > 0 ? (
                foodItems
                  .filter((item) => item.CategoryName === category.CategoryName)
                  .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
                  .map((item) => (
                    <div
                      key={item._id}
                      className="col-12 col-md-6 col-lg-3 mb-3"
                    >
                      <Card
                        foodItems={item}
                        options={item.options[0]}
                      />
                    </div>
                  ))
              ) : (
                <div className="col-12">No items found</div>
              )}
            </div>
          ))
        ) : (
          <div className="col-12">No categories found</div>
        )}
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}
