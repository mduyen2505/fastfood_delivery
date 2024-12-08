import React, { useEffect, useState } from 'react';import { Link } from 'react-router-dom';
import { MY_ORDERS_API } from "../../config/ApiConfig";
import './Style.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  

  // Hàm gọi API để lấy danh sách đơn hàng
  useEffect(() => {
    console.log("test")
    fetchOrders();
  }, []);
  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    
    
    try {
      // Gọi API bằng fetch
      const response = await fetch(`${MY_ORDERS_API}}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log(data)
        setOrders(data); 
      } else {
        setError("Lỗi khi tải danh sách đơn hàng.");
      }
    } catch (err) {
      console.error("Lỗi khi gọi API:", err); 
      setError("Đã xảy ra lỗi khi tải danh sách đơn hàng.");
    } 
  };

  // Gọi fetchOrders khi component được render lần đầu tiên
  if (orders.length === 0 && !loading && !error) {
    fetchOrders(); // Gọi API nếu chưa có dữ liệu đơn hàng
  }
  

  return (
    <div className="main-content">
      <div className="order-list">
        <h2>Danh sách đơn hàng đã đặt của bạn</h2>
        <div className="order-container">
          {loading ? (
            <div>Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div className="order-card" key={order._id}>
                <div className="order-info">
                  <p><strong>Mã đơn hàng:</strong> #{order._id}</p>
                  <p><strong>Ngày đặt hàng:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p><strong>Trạng thái:</strong> {order.orderStatus}</p>
                  <p><strong>Tổng giá trị:</strong> {order.totalPrice.toLocaleString()} VND</p>
                </div>
                <Link to={`/order-details/${order._id}`} className="view-details-btn">
                  Xem chi tiết
                </Link>
              </div>
            ))
          ) : (
            <div className="no-orders">
              <p>Bạn chưa có đơn hàng nào.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
