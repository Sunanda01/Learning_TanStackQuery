import { useQueries } from "@tanstack/react-query";
import React, { useState } from "react";

function Parallel() {
  const [productId, setProductId] = useState([1, 2]);
  const result= useQueries({
    queries: productId.map((id) => {
      return {
        queryKey: ["product", id],
        queryFn: async () => {
          const res = await fetch(`https://dummyjson.com/products/${id}`);
          const data = await res.json();
          console.log(data)
          return data;
        },
      };
    }),
  });
 

  return (
    <div className="flex  flex-col items-center">
      <button
        className="flex bg-pink-300 p-2 font-bold rounded-md text-gray-700"
        onClick={() => {
          setProductId((prev) => {
            return [...prev, prev.length + 1];
          });
        }}
      >
        Load More
      </button>

      {result.map(({ data, isLoading }, index) => (
        <h1 key={productId[index]}>
          {isLoading ? "Loading..." : data?.title || "No title found"}
        </h1>
      ))}
    </div>
  );
}

export default Parallel;
