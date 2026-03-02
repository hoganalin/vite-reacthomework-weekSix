import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function SingleProduct() {
  const { id } = useParams();
  const [singleProduct, setProduct] = useState(null);

  useEffect(() => {
    const viewProduct = async (id) => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/${API_PATH}/product/${id}`
        );
        setProduct(res.data.product);
        console.log('單一產品資料:', res.data.product);
      } catch (error) {
        console.error('取得單一產品資料錯誤:', error);
      }
    };
    viewProduct(id);
  }, [id]);
  const addCart = async (id, qty = 1) => {
    try {
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data: {
          product_id: id,
          qty: qty,
        },
      });
      console.log(res);
    } catch (error) {
      console.error('加入購物車錯誤:', error);
    }
  };
  return !singleProduct ? (
    '查無產品資料'
  ) : (
    <div className="container mt-4">
      <div className="card">
        <img
          src={singleProduct.imageUrl}
          className="card-img-top"
          alt={singleProduct.title}
          style={{
            height: '400px',
            width: '300px',
          }}
        />
        <div className="card-body">
          <h5 className="card-title">{singleProduct.title}</h5>
          <p className="card-text">{singleProduct.description}</p>
          <p className="card-text">
            <strong>價格:</strong> {singleProduct.price} 元
          </p>
          <p className="card-text">
            <small className="text-muted">單位: {singleProduct.unit}</small>
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              addCart(singleProduct.id);
            }}
          >
            加入購物車
          </button>
        </div>
      </div>
    </div>
  );
}
export default SingleProduct;
