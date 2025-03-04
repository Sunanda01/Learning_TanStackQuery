import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {  useParams } from "react-router-dom";

function Products() {
  const queryClient=useQueryClient();
  const params = useParams();
  const fetchProduct = async () => {
    const res = await axios.get(
      `https://dummyjson.com/products/${params.productId}`
    );
    return res.data;
  };

  const {
    isLoading,
    error,
    data: product,
  } = useQuery({
    queryKey: ["product", params.productId],
    queryFn: fetchProduct,
    staleTime: 20000,
  });
  
  const mutation = useMutation({
    mutationFn: async (newProduct) => {
      const res = await axios.put(
        `https://dummyjson.com/products/${params.productId}`,
        newProduct
      );

      return res.data;
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(["product",params.productId])
    }
  });

  if (isLoading) {
    return (
      <h2 className="text-4xl text-center pb-2 font-bold tracking-tight text-gray-900">
        Loading......
      </h2>
    );
  }

  if (error) {
    return (
      <h2 className="text-4xl text-center pb-2 font-bold tracking-tight text-gray-900">
        {error.message}
      </h2>
    );
  }

  if (mutation.isPending) {
    return (
      <h2 className="text-4xl text-center pb-2 font-bold tracking-tight text-gray-900">
        Updating......
      </h2>
    );
  }

  if (mutation.isError) {
    return (
      <h2 className="text-4xl text-center pb-2 font-bold tracking-tight text-gray-900">
        Mutation Error :{mutation.error.message}
      </h2>
    );
  }

  if(mutation.isSuccess){
    return (
      <h2 className="text-4xl text-center pb-2 font-bold tracking-tight text-gray-900">
       Updated......
      </h2>
    );
  }

  return (
    <>
      <div className="text-xl font-bold">Product: {product.title}</div>
      <button
        className="flex bg-pink-300 p-2 font-bold rounded-md text-gray-700"
        onClick={() => {
          mutation.mutate({ title: "Update Product" });
        }}
      >
        UPDATE PRODUCT
      </button>
    </>
  );
}

export default Products;
