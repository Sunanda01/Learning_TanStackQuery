import { Link, useSearchParams } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { useState } from "react";




function Product() {
  const [search, setSearch] = useState('');
  const [searchByCategory,setSearchByCategory]=useState('');
  const debouncedSearch = debounce((query) => {
    setSearchParams((prev) => {
      prev.set("q", query);
      prev.set("skip", 0);
      prev.delete("category");
      return prev;
    });
  }, 1000);
  const [searchParams, setSearchParams] = useSearchParams({
    limit: 4,
    skip: 0,
  });
  const skip = parseInt(searchParams.get("skip") || 0);
  const limit = parseInt(searchParams.get("limit") || 4);
  const q = searchParams.get("q") || 0;
  const category = searchParams.get("category") || "";

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`https://dummyjson.com/products/categories`);
      return res.json();
    },
  });

  const {
    isLoading,
    error,
    data: products,
  } = useQuery({
    queryKey: ["products", limit, skip, q, category],
    queryFn: async () => {
      let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
      if (q)
        url = `https://dummyjson.com/products/search?limit=${limit}&skip=${skip}&q=${q}`;
      if (category)
        url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`;

      let data = await fetch(url).then((res) => res.json());
      return data.products;
    },
    staleTime: 20000,
    placeholderData: keepPreviousData,
  });

  const handleDisplay = (lim) => {
    setSearchParams((prev) => {
      prev.set("skip", Math.max(skip + lim, 0));
      return prev;
    });
  };

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

  return (
    <>
      <div className="bg-white flex-col">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-4xl text-center pb-2 font-bold tracking-tight text-gray-900">
            Product Store
          </h2>

          <div className="flex justify-between">
            <div className="flex ">
              <form className="w-98 ">
                <label
                  htmlFor="default-search"
                  className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                >
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                  value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setSearchByCategory('');
                      debouncedSearch(e.target.value);
                    }}
                    type="search"
                    id="default-search"
                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search Mockups, Logos..."
                    required
                  />
                </div>
              </form>
            </div>

            <div className="flex">
              <select
              value={searchByCategory}
                className="border p-2"
                onChange={(e) => {
                  setSearchByCategory(e.target.value);
                  setSearch('');
                  setSearchParams((prev) => {
                    prev.set("skip", 0);
                    prev.delete("q");
                    prev.set("category", e.target.value);
                    return prev;
                  });
                }}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.slug}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                <img
                  alt={product.description}
                  src={product.thumbnail}
                  className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                />
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link to={`/product/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.description}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {product.category}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 ml-2">
                    ${product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-8 justify-center ">
          <button
            disabled={skip < limit}
            onClick={() => {
              handleDisplay(-limit);
            }}
            className={`flex rounded-md w-24 h-10 items-center justify-center text-xl font-bold ${
              skip < limit ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white"
            }`}
          >
            Prev
          </button>
          <button
          disabled={products.length < limit}
            onClick={() => {
              handleDisplay(limit);
            }}
            className={`flex rounded-md w-24 h-10 items-center justify-center text-xl font-bold ${
              products.length < limit ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default Product;
