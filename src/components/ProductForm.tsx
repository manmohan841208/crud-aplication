"use client";

import { useState } from "react";

export default function ProductForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
      }),
    });

    setForm({
      name: "",
      price: "",
      description: "",
    });

    onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border p-4 rounded bg-white"
    >
      <input
        type="text"
        placeholder="Product Name"
        className="border p-2 w-full"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Price"
        className="border p-2 w-full"
        value={form.price}
        onChange={(e) =>
          setForm({ ...form, price: e.target.value })
        }
      />

      <textarea
        placeholder="Description"
        className="border p-2 w-full"
        value={form.description}
        onChange={(e) =>
          setForm({
            ...form,
            description: e.target.value,
          })
        }
      />

      <button className="bg-black text-white px-4 py-2 rounded">
        Add Product
      </button>
    </form>
  );
}
