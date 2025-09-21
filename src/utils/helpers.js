export const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
};

export const getStatusBadge = (status) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    confirmed: "bg-green-100 text-green-800 border-green-300",
    completed: "bg-blue-100 text-blue-800 border-blue-300",
    cancelled: "bg-red-100 text-red-800 border-red-300"
  };
  return styles[status] || "bg-gray-100 text-gray-800 border-gray-300";
};

export const getPaymentBadge = (paymentStatus) => {
  const styles = {
    paid: "bg-green-100 text-green-800",
    unpaid: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800"
  };
  return styles[paymentStatus] || "bg-gray-100 text-gray-800";
};