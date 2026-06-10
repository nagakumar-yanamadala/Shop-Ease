import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import SellerOnly from "./SellerOnly";
import ProductItem from "../../components/ProductItem";

export default function MyProducts() {
  const { user, loading } = useContext(AuthContext);
  const url = import.meta.env.VITE_API_URL;
  const [myProducts, setMyProducts] = useState([]);

  // States for handling the edit modal
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (user?._id) {
      fetchProducts();
    }
  }, [user, url]);

  const fetchProducts = () => {
    fetch(`${url}/products`)
      .then((res) => res.json())
      .then((data) => {
        const products = Array.isArray(data) ? data : [];

        const filteredProducts = products.filter(
          (product) => product?.hostId?.toString() === user?._id?.toString(),
        );

        setMyProducts(filteredProducts);
      })
      .catch((err) => console.error("Error fetching products:", err));
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const response = await fetch(`${url}/product/${productId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        setMyProducts(myProducts.filter((p) => p._id !== productId));
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product._id);
    setEditForm(product);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${url}/product/${editingProduct}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await response.json();

      if (data.success) {
        setMyProducts(
          (myProducts||[]).map((p) => (p._id === editingProduct ? data.product : p)),
        );
        setEditingProduct(null);
      } else {
        alert(data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-500 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user?.loginType === "seller" ? (
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-medium tracking-tight text-gray-900">
              My Products
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage the products you are selling on ShopEase
            </p>
          </div>

          {myProducts?.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-sm text-gray-500">
                You haven't listed any products for sale yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(myProducts || []).map((product) => (
                <div key={product._id} className="relative group">
                  <ProductItem product={product} />

                  {/* Action overlay that appears on hover */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/80 p-1 rounded-lg shadow-sm">
                    <button
                      onClick={() => openEditModal(product)}
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Simple Edit Modal */}
          {editingProduct && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
                <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                <form onSubmit={submitEdit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title || ""}
                      onChange={handleEditChange}
                      required
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={editForm.category || ""}
                      onChange={handleEditChange}
                      required
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Price
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={editForm.price || ""}
                        onChange={handleEditChange}
                        required
                        className="mt-1 w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Old Price
                      </label>
                      <input
                        type="text"
                        name="oldPrice"
                        value={editForm.oldPrice || ""}
                        onChange={handleEditChange}
                        className="mt-1 w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Image URL
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={editForm.image || ""}
                      onChange={handleEditChange}
                      required
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        <SellerOnly />
      )}
    </div>
  );
}
