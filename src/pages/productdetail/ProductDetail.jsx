import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Image,
  Text,
  Heading,
  Spinner,
  Button,
  Stack,
  Flex,
  Icon,
  HStack,
  Divider,
  Textarea
} from "@chakra-ui/react";
import { PRODUCTS_API, CARTS_API, IMAGE_URL, REVIEWS_API } from "../../config/ApiConfig";
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart,FaUser } from "react-icons/fa";
import "./Style.css"; // Import định dạng từ file CSS riêng
import { toast } from "react-toastify";
import logo from '../../assets/logo.png';
import axios from "axios";

const ProductDetail = () => {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [newReview, setNewReview] = useState({ rating: "", comment: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product data
        const productResponse = await fetch(`${PRODUCTS_API}/${id}`);
        if (!productResponse.ok) throw new Error(`Không tìm thấy sản phẩm: ${productResponse.status}`);
        const productData = await productResponse.json();
        productData.image = productData.image ? IMAGE_URL + productData.image : logo;
        setProduct(productData);

        // Fetch product reviews
        const reviewsResponse = await axios.get(`${REVIEWS_API}/${id}`);
        setReviews(reviewsResponse.data.data || []);
      } catch (err) {
        toast.error("Failed to load product or reviews.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);


  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(CARTS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Token đăng nhập
        },
        body: JSON.stringify({
          product_id: product.ID_Product,
          quantity: 1,
          price: product.price,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
          return;
        }
        throw new Error("Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.");
      }

      const data = await response.json();

      toast.success("Sản phẩm đã được thêm vào giỏ hàng!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });


    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      toast.error("Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!product) {
    return <Text className="not-found">Không tìm thấy sản phẩm.</Text>;
  }
    
  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.floor(rating || 0);
    let stars = [];
    for (let i = 0; i < totalStars; i++) {
      if (i < filledStars) {
        stars.push(<FaStar key={i} color="gold" />);
      } else if (i < Math.ceil(rating)) {
        stars.push(<FaStarHalfAlt key={i} color="gold" />);
      } else {
        stars.push(<FaRegStar key={i} color="gray" />);
      }
    }
    return stars;
  };

  const submitReview = async () => {
    if (!token) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    setLoading(true);
    try {
      const reviewResponse = await axios.post(
        `${REVIEWS_API}`,
        { product_id: id, ...newReview },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReviews((prev) => [...prev, reviewResponse.data.data]); // Add the new review to the list
      setNewReview({ rating: "", comment: "" }); // Reset review form
      toast.success("Review submitted successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review.");
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };





  return (
    <Box className="product-detail-container">
      {/* Khung chi tiết sản phẩm */}
      <Box className="product-detail-box">
        <Stack direction={{ base: "column", md: "row" }} spacing="10">
          <Image
            src={product.image}
            alt={product.name}
            className="product-image"
            fallbackSrc="https://via.placeholder.com/400"
          />
          <Box className="product-info">
            <Heading className="product-title">{product.name}</Heading>
            <Text className="product-description">{product.description}</Text>
            <Text className="product-price">
              Giá: {product.price.toLocaleString("vi-VN")} VND
            </Text>

            {/* Đánh giá sản phẩm */}
            <Box className="rating-box">
              <Flex className="rating-stars">
                <HStack spacing="2">
                  {/* Render ngôi sao từ rating */}
                  {renderStars(product.averageRating || 0)}
                </HStack>
                <Text className="rating-text">({product.averageRating || 0} / 5 từ {product.reviewCount || 0} lượt đánh giá)</Text>
              </Flex>
            </Box>

            {token ? (
              <Button className="add-to-cart-btn" onClick={handleAddToCart}>
                <Icon as={FaShoppingCart} mr="2" />
                Thêm vào giỏ hàng
              </Button>
            ) : (
              <Button className="goto-to-login-btn" disabled>
                <Text>
                  Vui lòng đăng nhập
                </Text>
              </Button>
            )}
          </Box>
        </Stack>

        <Divider className="divider" />
      </Box>

       {/* Khung đánh giá sản phẩm */}
       <Box className="review-box">
        <Heading className="review-heading">Đánh giá sản phẩm</Heading>
        <Stack spacing="2">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Box className="review-item" key={review._id}>
                <Flex justify="space-between" align="center">
                  <HStack spacing="2" align="center">
                    <Icon as={FaUser} boxSize={5} color="gray.500" />
                    <Text className="review-author">{review.user_id?.name || "Anonymous"}</Text>
                  </HStack>
                  <HStack spacing="1">{renderStars(review.rating)}</HStack>
                </Flex>
                <Text className="review-text">{review.comment}</Text>
              </Box>
            ))
          ) : (
            <Text className="no-reviews">Chưa có đánh giá nào cho sản phẩm này.</Text>
          )}
        </Stack>
      </Box>

      {/* Add Review Section */}
      <Box className="add-review-box">
      <Heading fontSize ="1.2rem" textAlign="left">Thêm Đánh Giá</Heading>

        <Stack gap="2">
          <Textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            placeholder="Viết bình luận của bạn"
          />
          <Box className="add-review-stars">
            {[1, 2, 3, 4, 5].map((ratingValue) => (
              <button
                key={ratingValue}
                className={`star-button ${newReview.rating >= ratingValue ? "active" : ""}`}
                onClick={() => setNewReview({ ...newReview, rating: ratingValue })}
              >
                <FaStar />
              </button>
            ))}
          </Box>
          <Button
            onClick={submitReview}
            isLoading={loading}
            isDisabled={!newReview.comment || !newReview.rating}
          >
            Gửi Đánh Giá
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ProductDetail;