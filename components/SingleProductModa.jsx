import { useState, useEffect } from 'react';
function SingleProductModal({ addCart, closeModal, product, productRef }) {
  const [cartProductQty, setCartProductQty] = useState(1);
  const handleAddCart = () => {
    if (!product?.id) return;
    addCart(product.id, cartProductQty);
    setCartProductQty(1); //加入購物車後重設數量：
    closeModal();
  };
  //每次打開不同產品的查看更多, 數量都會重新更新為1
  useEffect(() => {
    setCartProductQty(1);
  }, [product]);
  return (
    <div
      className="modal fade"
      id="productModal"
      tabIndex="-1"
      ref={productRef}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">產品名稱：{product?.title}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeModal}
            ></button>
          </div>
          <div className="modal-body">
            <img className="w-100" src={product?.imageUrl} />
            <p className="mt-3">產品內容：{product?.content}</p>
            <p>產品描述：{product?.description}</p>
            <p>
              價錢：<del>原價 ${product?.origin_price}</del>，特價：$
              {product?.price}
            </p>
            <div className="d-flex align-items-center">
              <label style={{ width: '150px' }}>購買數量：</label>
              <button
                className="btn btn-danger"
                type="button"
                id="button-addon1"
                aria-label="Decrease quantity"
                onClick={() =>
                  setCartProductQty((prev) => (prev > 1 ? prev - 1 : 1))
                }
              >
                <i className="fa-solid fa-minus"></i>
              </button>
              <input
                className="form-control"
                type="number"
                min="1"
                max="10"
                value={cartProductQty}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (!isNaN(value) && value >= 1) {
                    setCartProductQty(value);
                  }
                }}
              />
              <button
                className="btn btn-primary"
                type="button"
                id="button-addon2"
                aria-label="Decrease quantity"
                onClick={() => setCartProductQty((prev) => prev + 1)}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleAddCart()}
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SingleProductModal;
