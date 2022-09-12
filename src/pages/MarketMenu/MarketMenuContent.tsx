import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ProductForm from "../../components/Product/ProductForm";
import ProductList from "../../components/Product/ProductList/ProductList";
import { getAllProducts } from "../../services/productService";

const MarketMenuContent = () => {
  const { option } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    switch (option) {
      case "all":
        getProducts();
        break;
      case "listing":
        break;
    }
  }, [option]);

  async function getProducts() {
    const { data } = await getAllProducts();
    setProducts(data);
  }

  const renderContent = () => {
    switch (option) {
      case "all":
        return <ProductList products={products} />;
      case "listing":
        return <ProductForm />;
    }
    return <></>;
  };

  return renderContent();
};

export default MarketMenuContent;
