/* eslint-disable react/prop-types */
export default function ItemCard({ item, quantity, onAdd }) {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img 
            src={item.avatar} 
            alt={item.name}
            className="w-full h-48 object-cover"
            />
            <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
            <div className="mt-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600">${item.price}</span>
                {quantity > 0 && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {quantity} in cart
                    </span>
                )}
                </div>
                <button
                onClick={onAdd}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                Add +
                </button>
            </div>
            </div>
        </div>
    );
}