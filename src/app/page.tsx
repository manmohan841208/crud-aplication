"use client";

import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
  });

  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  const fetchProducts = async () => {
    const res = await fetch(`/api/products?page=${page}`);

    const data = await res.json();

    setProducts(data.products);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  // CREATE OR UPDATE PRODUCT
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
    };

    // UPDATE PRODUCT
    if (editingId) {
      await fetch(`/api/products/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      alert("Product updated successfully");
    } else {
      // CREATE PRODUCT
      await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      alert("Product added successfully");
    }

    // RESET FORM
    setForm({
      name: "",
      price: "",
      description: "",
    });

    setEditingId(null);

    fetchProducts();
  };

  // DELETE PRODUCT
  const deleteProduct = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete?"
    );

    if (!confirmDelete) return;

    await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    fetchProducts();
  };

  // EDIT PRODUCT
  const editProduct = (product: Product) => {
    setEditingId(product._id);

    setForm({
      name: product.name,
      price: String(product.price),
      description: product.description,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // CANCEL EDIT
  const cancelEdit = () => {
    setEditingId(null);

    setForm({
      name: "",
      price: "",
      description: "",
    });
  };

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Product CRUD App
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 border p-4 rounded bg-white"
      >
        <input
          type="text"
          placeholder="Product Name"
          className="border p-2 w-full rounded"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          required
        />

        <input
          type="number"
          placeholder="Price"
          className="border p-2 w-full rounded"
          value={form.price}
          onChange={(e) =>
            setForm({
              ...form,
              price: e.target.value,
            })
          }
          required
        />

        <textarea
          placeholder="Description"
          className="border p-2 w-full rounded"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded"
          >
            {editingId
              ? "Update Product"
              : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* PRODUCT LIST */}
      <div className="mt-8 space-y-4">
        {products?.map((product) => (
          <div
            key={product._id}
            className="border p-4 rounded bg-white shadow"
          >
            <h2 className="text-xl font-semibold">
              {product.name}
            </h2>

            <p className="mt-1">
              ₹ {product.price}
            </p>

            <p className="mt-2 text-gray-600">
              {product.description}
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() =>
                  editProduct(product)
                }
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteProduct(product._id)
                }
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex gap-4 mt-8 items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="border px-4 py-2 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="border px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
}