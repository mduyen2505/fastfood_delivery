import React, { useEffect, useState } from "react";
import "./Style.css";
import axios from "axios";
import { COUPONS_API } from "../../config/ApiConfig";
import { Link, useNavigate } from "react-router-dom";
import { FcHome } from "react-icons/fc";

const Offer = () => {
  const [coupons, setCoupons] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate(); 
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(COUPONS_API); 
        setCoupons(response.data);
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching coupons:", error);
        setLoading(false); 
      }
    };

    fetchCoupons();
  }, []); 

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="offer-Body">
      <div className="offer-headerSection">
        ĐẶT MÓN DỄ DÀNG - TẬN HƯỞNG MỌI LÚC, MỌI NƠI !
        <button className="offer-headerSection-button">Đặt ngay</button>
      </div>
      <div className="offer-bannerSection">DEALS & OFFERS</div>
      <div className="offer-cardsSection">
        <div className="offer-headingSection">KHUYẾN MÃI DÀNH CHO BẠN</div>
        <div className="offer-cards-Box">
          {coupons.map((coupon) => (
            <div
            key={coupon._id}
            className="offer-box1"
            style={{
              backgroundImage: `url(${coupon.image || "default-image.jpg"})`,
            }} 
          >
            <h1 className="offer-box1-title">{coupon.name}</h1>
            <p className="offer-box1-text">{coupon.description}</p>
            <div className="offer-box1-buttonSection">
              <Link to={`/coupon/${coupon._id}`} className="offer-box1-link">
                Xem Chi Tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Offer;
