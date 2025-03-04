import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Product from "./Components/Product";
import Home from "./Components/Home";
import Products from "./Components/Products";
import Parallel from "./Components/Parallel";
import DependentQuery from "./Components/DependentQuery";
import OptimisticUpdate from "./Components/OptimisticUpdate";


function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path="/product/:productId" element={<Products />} />
            <Route path="/parallel" element={<Parallel />} />
            <Route path="/dependent" element={<DependentQuery />} />
            <Route path="/optimistic" element={<OptimisticUpdate/>}/>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
