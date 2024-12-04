import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { COUPON_API } from "../../config/ApiConfig";
import "./Style.css";


const OfferDetail = () => {
  const { id } = useParams(); 
  const [coupon, setCoupon] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const response = await axios.get(COUPON_API(id)); 
        setCoupon(response.data);
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching coupon details:", error);
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [id]); 

  if (loading) return <div>Loading...</div>; 

  if (!coupon) return <div>Coupon not found</div>; 

  return (
    <div 
    className="offer-detail-container"
    style={{ backgroundImage: `url(${coupon.image})` }} 
  >
    <div className="offer-detail-overlay">
      <h1>Chi tiết khuyến mãi </h1>
      <h3>{coupon.name}</h3>
      <p>{coupon.description}</p>
      <p>Expiry Date: {new Date(coupon.expiry).toLocaleDateString()}</p>
      <p>Discount: {coupon.discount}%</p>
      <button onClick={() => navigate("/offers")} className="back-button">
        Quay lại
      </button>
    </div>
  </div>
  
  );
};

export default OfferDetail;
