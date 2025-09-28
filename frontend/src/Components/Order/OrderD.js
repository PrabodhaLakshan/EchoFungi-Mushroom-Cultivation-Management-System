import React from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

function OrderD({ order, onDelete }) {
  const isPending = order.Status === "Pending";

  return (
    <tr>
      <td className="border px-4 py-2">{order.OrderId}</td>
      <td className="border px-4 py-2">{order.ShopName}</td>
      <td className="border px-4 py-2">{order.ProductId}</td>
      <td className="border px-4 py-2">{order.Quantity}</td>
      <td className="border px-4 py-2">{new Date(order.OrderDate).toLocaleDateString()}</td>
      <td className="border px-4 py-2">{order.Status}</td>
      <td className="border px-4 py-2">
        {order.DeliveredDate ? new Date(order.DeliveredDate).toLocaleDateString() : "Not Delivered"}
      </td>
      <td className="border px-4 py-2">{order.SalesId || "N/A"}</td>
      <td className="border px-4 py-2 text-center flex justify-center gap-2">
        <Link
          to={isPending ? `/Order/${order.OrderId}` : "#"}
          className={`px-2 py-1 rounded text-white ${isPending ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
        >
          <FaEdit />
        </Link>
        <button
          onClick={() => isPending && onDelete(order.OrderId)}
          className={`px-2 py-1 rounded text-white ${isPending ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"}`}
          disabled={!isPending}
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}

export default OrderD;
