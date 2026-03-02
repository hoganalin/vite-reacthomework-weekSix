// src/views/front/Cart.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { currency } from '../../utils/filter';
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const Cart = () => {
  const [cart, setCart] = useState([]);
  const getCart = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(res.data.data);
      console.log('購物車資料:', res.data.data);
    } catch (error) {
      console.error('取得購物車資料錯誤:', error);
    }
  };
  useEffect(() => {
    getCart();
  }, []);

  //刪除單一產品
  const deleteCart = async (cartId) => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${cartId}`);
      getCart();
    } catch (error) {
      console.log(error.response.data);
    }
  };
  // 清空購物車
  const deleteCartAll = async () => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/carts`;
      await axios.delete(url);
      getCart();
    } catch (error) {
      console.log(error.response.data);
    }
  };
  // 更新商品數量

  const updateCart = async (cartId, productId, qty = 1) => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart/${cartId}`;

      const data = {
        product_id: productId,
        qty,
      };
      await axios.put(url, { data });
      getCart();
    } catch (error) {
      console.log(error.response.data);
    }
  };
  return (
    <>
      <div className="container">
        <h2>購物車列表</h2>
        <div className="text-end mt-4">
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={deleteCartAll}
          >
            清空購物車
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">品名</th>
              <th scope="col">數量/單位</th>
              <th scope="col">小計</th>
            </tr>
          </thead>
          <tbody>
            {cart?.carts?.map((item) => (
              <tr key={item.id}>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => deleteCart(item.id)}
                  >
                    刪除
                  </button>
                </td>
                <th scope="row">{item.product.title}</th>
                <td>
                  <div className="input-group input-group-sm mb-3">
                    <input
                      type="Number"
                      className="form-control"
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                      defaultValue={item.qty}
                      onChange={(e) => {
                        updateCart(
                          item.id,
                          item.product_id,
                          Number(e.target.value)
                        );
                      }}
                    />
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      {item.product.unit}
                    </span>
                  </div>
                </td>
                <td>${item.total}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="text-end" colSpan="3">
                總計
              </td>
              <td className="text-end">${currency(cart?.final_total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};

export default Cart;
