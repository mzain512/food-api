import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = "kbzaGb5rM5eeTj5c08ragH5tBqz9DO4aQ25jqnXD"; // 👈 replace with USDA API key

  const searchFood = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setResults([]);

    try {
      const res = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&api_key=${API_KEY}`
      );
      const data = await res.json();
      setResults(data.foods || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">USDA Food Search</h1>

      <form onSubmit={searchFood} className="w-full max-w-md flex gap-2">
        <input
          type="text"
          className="flex-grow p-2 border rounded-lg"
          placeholder="Search for food..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Search
        </button>
      </form>

      {loading && <p className="mt-4">Loading...</p>}

      <ul className="mt-6 w-full max-w-md space-y-4">
        {results.map((food) => (
          <li key={food.fdcId} className="p-4 border rounded-lg bg-white shadow">
            <h2 className="font-semibold">{food.description}</h2>
            <p className="text-sm text-gray-600">
              Category: {`${food.foodCategory} | Brand: ${food.brandOwner}`}
            </p>
            {food.foodNutrients && (
              <p className="mt-1 text-sm">
                Calories:{" "}
                {
                  food.foodNutrients.find((n) => n.nutrientName === "Energy")
                    ?.value
                }{" "}
                kcal
                | Protein: {food.foodNutrients.find((n) => n.nutrientName === "Protein")?.value} g
                | Carbohydrates: {food.foodNutrients.find((n) => n.nutrientName === "Carbohydrate, by difference")?.value} g
                | Fat: {food.foodNutrients.find((n) => n.nutrientName === "Fatty acids, total saturated")?.value} g
                | Fiber: {food.foodNutrients.find((n) => n.nutrientName === "Fiber, total dietary")?.value} g
                | Sugar: {food.foodNutrients.find((n) => n.nutrientName === "Sugar, total")?.value} g
                | Serving Size: {food.servingSize} {food.servingSizeUnit}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
