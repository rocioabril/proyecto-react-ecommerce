import { useCart } from "../contexts/CartContext";
import { useLang } from "../contexts/LangContext";
import { BsTrash3, BsArrowDown } from "react-icons/bs";
import QuantitySelector from "../components/QuantitySelector";
import PriceWithOffer from "../components/PriceWithOffer";
import EmptyCart from "../components/EmptyCart";
import { Link, useNavigate } from "react-router-dom";

function CartPage() {
  const {
    cart,
    totalPrice,
    totalPriceWithOffers,
    updateProductQuantity,
    updateProductChecked,
    removeProduct,
  } = useCart();

  const { language } = useLang();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div>
      <ul className="flex flex-col gap-4 p-4">
        {cart.map((product) => (
          <li
            key={product.id}
            className="flex items-center gap-4 px-16 cart_item_container"
          >
            <input
              type="checkbox"
              checked={product.checked}
              onChange={() => updateProductChecked(product.id)}
            />
            <Link
              key={product.id}
              to={`/detail/${product.id}`}
              className="max-w-xs flex flex-col items-center"
            >
              <img
                src={`/img/${product.name}.jpeg`}
                alt={product.name}
                className="cart_item_img h-fit"
              />
            </Link>
            <div className="flex items-start gap-8">
              <div>
                <p className="font-bold">{language[product.name]}</p>
                <p className="text-gray-400 max-w-md hidden lg:block">
                  {language[`${product.name}-description`].substring(0, 150)}{" "}
                  (...)
                </p>
                <QuantitySelector
                  quantity={product.quantity}
                  onIncrement={() =>
                    updateProductQuantity(
                      product.id,
                      product.quantity < product.stock
                        ? product.quantity + 1
                        : product.quantity
                    )
                  }
                  onDecrement={() =>
                    updateProductQuantity(
                      product.id,
                      product.quantity === 1
                        ? product.quantity
                        : product.quantity - 1
                    )
                  }
                />
              </div>
              {product.discount ? (
                <div className="flex flex-col-reverse gap-1">
                  <PriceWithOffer
                    price={product.price * product.quantity}
                    discount={product.discount}
                  />
                </div>
              ) : (
                <>
                  <p className="font-semibold">
                    ${(product.price * product.quantity).toFixed(2)}
                  </p>
                  <div className="invisible bg-red-700 p-1 text-white">30%</div>
                </>
              )}
              <button className="ml-6">
                <BsTrash3
                  size={20}
                  onClick={() => {
                    removeProduct(product);
                  }}
                />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-end gap-4 p-4">
        {totalPrice === totalPriceWithOffers ? (
          <p className="font-semibold">${totalPrice.toFixed(2)}</p>
        ) : (
          <div>
            <p className="text-gray-400 line-through">
              ${totalPrice.toFixed(2)}
            </p>
            <div className="flex items-center text-red-700 font-semibold">
              <BsArrowDown />
              <p>${totalPriceWithOffers.toFixed(2)}</p>
            </div>
          </div>
        )}
        <button
          className="bg-amber-200 p-4 rounded-2xl font-semibold hover:bg-amber-300 ease-in-out"
          onClick={() => navigate("/checkout")}
        >
          {language["tramitar_compra"]}
        </button>
      </div>
    </div>
  );
}

export default CartPage;
