// src/views/front/Cart.jsx
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import * as bootstrap from 'bootstrap';
import SingleProductModal from '../../../components/SingleProductModa';
import { currency } from '../../utils/filter';
import { RotatingLines } from 'react-loader-spinner';
import { emailValidation } from '../../utils/validation';
import SingleProduct from './SingleProduct';
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [loadingCartId, setLoadingCartId] = useState(null);
  const [loadingProductId, setloadingProductId] = useState(null);
  const productRef = useRef(null);
  const myProductRef = useRef(null);
  const getCart = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(res.data.data);
      console.log('購物車資料:', res.data.data);
    } catch (error) {
      console.error('取得購物車資料錯誤:', error);
    }
  };
  const getProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
      setProducts(response.data.products);
      console.log('產品資料:', response.data.products);
    } catch (error) {
      console.error('取得產品資料錯誤:', error);
    }
  };
  useEffect(() => {
    getProducts();
    getCart();
  }, []);

  const handleViewProduct = async (id) => {
    setloadingProductId(id);
    openModal();
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
      setProduct(res.data.product);
      console.log('單一產品資料:', res.data.product);
    } catch (error) {
      console.error('取得單一產品資料錯誤:', error);
    } finally {
      setloadingProductId(null);
    }
  };

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      name: '',
      tel: '',
      address: '',
    },
  });
  // 加入購物車
  const addCart = async (id, qty = 1) => {
    setLoadingCartId(id);
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
    } finally {
      setLoadingCartId(null); //把 加入購物車的loading 清空
    }
    getCart(); //重新取得購物車
  };
  const onSubmit = async (formData) => {
    const data = {
      user: formData,
      message: formData.message,
    };
    try {
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/order`, {
        data,
      });
      console.log(response.data);
      getCart(); //重新取得購物車
    } catch (error) {
      console.log(error.response.data);
    }
  };
  //初始化Modal
  useEffect(() => {
    myProductRef.current = new bootstrap.Modal(productRef.current);
    // Modal 關閉時移除焦點
    const handleHide = () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    };

    productRef.current.addEventListener('hide.bs.modal', handleHide);

    return () => {
      productRef.current.removeEventListener('hide.bs.modal', handleHide);
    };
  }, []);

  const openModal = () => myProductRef.current.show();
  const closeModal = () => myProductRef.current.hide();
  return (
    <>
      <div className="container">
        {/* 產品列表 */}
        {products.map((product) => (
          <table className="table align-middle" key={product.id}>
            <thead>
              <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ width: '200px' }}>
                  <div
                    style={{
                      height: '100px',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundImage: `url(${product.imageUrl})`,
                    }}
                  ></div>
                </td>
                <td>{product.title}</td>
                <td>
                  <del className="h6">原價：{product.origin_price}</del>
                  <div className="h5">特價：{product.price}</div>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        handleViewProduct(product.id);
                      }}
                      disabled={loadingProductId === product.id}
                    >
                      {/* <i className="fas fa-spinner fa-pulse"></i> */}
                      {loadingProductId === product.id ? (
                        <RotatingLines color="grey" width={80} height={16} />
                      ) : (
                        '查看更多'
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => {
                        addCart(product.id);
                      }}
                      disabled={loadingCartId === product.id}
                    >
                      {/* <i className="fas fa-spinner fa-pulse"></i> */}
                      {loadingCartId === product.id ? (
                        <RotatingLines color="grey" width={80} height={16} />
                      ) : (
                        '加入購物車 '
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        ))}
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
                      type="number"
                      className="form-control"
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                      defaultValue={item.qty}
                      onBlur={(e) => {
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
        {/* 結帳頁面 */}
        <div className="my-5 row justify-content-center">
          <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="請輸入 Email"
                defaultValue="test@gamil.com"
                {...register('email', {
                  emailValidation,
                })}
              />
              {errors.email && (
                <span className="text-danger">{errors.email.message}</span>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                收件人姓名
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-control"
                placeholder="請輸入姓名"
                defaultValue="小明"
                {...register('name', {
                  required: '請輸入姓名',
                  minLength: {
                    value: 2,
                    message: '請輸入至少兩個字元',
                  },
                })}
              />
              {errors.name && (
                <span className="text-danger">{errors.name.message}</span>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="tel" className="form-label">
                收件人電話
              </label>
              <input
                id="tel"
                name="tel"
                type="tel"
                className="form-control"
                placeholder="請輸入電話"
                defaultValue="0912345678"
                {...register('tel', {
                  required: '請輸入手機號碼',
                  minLength: {
                    value: 8,
                    message: '至少 8 碼',
                  },
                  pattern: {
                    value: /^09\d{8}$/,
                    message: '請輸入正確手機格式',
                  },
                })}
              />
              {errors.tel && (
                <span className="text-danger">{errors.tel.message}</span>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                收件人地址
              </label>
              <input
                id="address"
                name="address"
                type="text"
                className="form-control"
                placeholder="請輸入地址"
                defaultValue="臺北市信義區信義路5段7號"
                {...register('address', {
                  required: '請輸入地址',
                })}
              />
              {errors.address && (
                <span className="text-danger">{errors.address.message}</span>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                留言
              </label>
              <textarea
                id="message"
                className="form-control"
                cols="30"
                rows="10"
                {...register('message')}
              ></textarea>
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-danger">
                送出訂單
              </button>
            </div>
          </form>
          {/* 以下為modal */}
          <SingleProductModal
            addCart={addCart}
            closeModal={closeModal}
            product={product}
            productRef={productRef}
          />
        </div>
      </div>
    </>
  );
};

export default Checkout;
