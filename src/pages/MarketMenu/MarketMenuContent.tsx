import { useEffect, useState } from "react";
import { useParams } from "react-router";
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer";
import ProductForm from "../../components/Product/ProductForm";
import ProductList from "../../components/Product/ProductList/ProductList";
import {
  getAllProducts,
  getProductsByCategory as getProductsByCategoryService,
} from "../../services/productService";

const MarketMenuContent = () => {
  const { option } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (option) {
      switch (option) {
        case "all":
          getProducts();
          break;
        case "listing":
          setLoading(false);
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
    setLoading(false);
  }

  async function getProductsByCategory(category: string) {
    const { data } = await getProductsByCategoryService(category);
    setProducts(data);
    setLoading(false);
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
  };

  return (
    <>{loading ? <LoadingContainer labelSize="medium" /> : renderContent()}</>
  );
};

export default MarketMenuContent;
