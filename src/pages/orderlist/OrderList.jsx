import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import { MY_ORDERS_API } from "../../config/ApiConfig";
import './Style.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  

  // Hàm gọi API để lấy danh sách đơn hàng
  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    const username = localStorage.getItem("username");
    if (!username) return; 
    
    try {
      // Gọi API bằng axios
      const response = await fetch(`${MY_ORDERS_API}/${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setOrders(response.data); 
      } else {
        setError("Lỗi khi tải danh sách đơn hàng.");
      }
    } catch (err) {
      console.error("Lỗi khi gọi API:", err); 
      setError("Đã xảy ra lỗi khi tải danh sách đơn hàng.");
    } finally {
      setLoading(false); 
    }
  };

 
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

export default OrderList;/*import React from 'react';
import { Link } from 'react-router-dom';
import './Style.css';

const OrderList = () => {
  const orders = [
    { id: '12345', date: '01/12/2024', status: 'Đang xử lý', total: '1,200,000 VND' },
    { id: '12346', date: '30/11/2024', status: 'Đã giao', total: '800,000 VND' },
    { id: '12347', date: '28/11/2024', status: 'Đã giao', total: '2,000,000 VND' },
  ];

  return (
    <div className="order-list">
    <h2>Danh sách đơn hàng đã đặt của bạn</h2>
    <div className="order-container">
      {orders.map((order) => (
        <div className="order-card" key={order.id}>
          <div className="order-info">
            <p><strong>Mã đơn hàng:</strong> #{order.id}</p>
            <p><strong>Ngày đặt hàng:</strong> {order.date}</p>
            <p><strong>Trạng thái:</strong> {order.status}</p>
            <p><strong>Tổng giá trị:</strong> {order.total}</p>
          </div>
          <Link to={`/order-details/${order.id}`} className="view-details-btn">
            Xem chi tiết
          </Link>
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default OrderList;*/

