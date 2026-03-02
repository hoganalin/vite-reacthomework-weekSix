import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  useEffect(() => {
    // 非同步取得產品資料
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/products`
        );
        setProducts(response.data.products);
        console.log('產品資料:', response.data.products);
      } catch (error) {
        console.error('取得產品資料錯誤:', error);
      }
    };
    getProducts();
  }, []); // 空依賴陣列表示只在組件掛載時執行一次
  const handleViewMore = (id) => {
    navigate(`/product/${id}`);
  };
  return (
    <div className="container mt-4">
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-3" key={product.id}>
            <div className="card">
              <img
                src={product.imageUrl}
                className="card-img-top"
                alt={product.title}
              />
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">
                  <strong>價格:</strong> {product.price} 元
                </p>
                <p className="card-text">
                  <small className="text-muted">單位: {product.unit}</small>
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleViewMore(product.id)}
                >
                  查看更多
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Products;
