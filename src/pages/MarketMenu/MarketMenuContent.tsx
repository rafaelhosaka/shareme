import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ProductForm from "../../components/Product/ProductForm";
import ProductList from "../../components/Product/ProductList/ProductList";
import {
  getAllProducts,
  getProductsByCategory as getProductsByCategoryService,
} from "../../services/productService";

const MarketMenuContent = () => {
  const { option } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (option) {
      switch (option) {
        case "all":
          getProducts();
          break;
        case "listing":
          break;
        default:
          getProductsByCategory(option);
          break;
      }
    }
  }, [option]);

  async function getProducts() {
    const { data } = await getAllProducts();
    setProducts(data);
  }

  async function getProductsByCategory(category: string) {
    const { data } = await getProductsByCategoryService(category);
    setProducts(data);
  }

  const renderContent = () => {
    switch (option) {
      case "all":
        return <ProductList products={products} />;
      case "listing":
        return <ProductForm />;
      default:
        return <ProductList products={products} />;
    }
    return <></>;
  };

  return renderContent();
};

export default MarketMenuContent;
