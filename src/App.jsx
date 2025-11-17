import { useState } from 'react'
import './App.css'


export default function App() {
  const [query, setQuery] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Remove hardcoded token
  const API_TOKEN = import.meta.env.VITE_WELLAGRAM_TOKEN;

  const searchFood = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setApiResponse(null);
    setError("");

    try {
      if (!API_TOKEN) {
        setError("API token is missing. Please set VITE_WELLAGRAM_TOKEN in your environment variables.");
        setLoading(false);
        return;
      }
      const res = await fetch(
        `https://api.dev.wellagram.com/api/analyze-text/`,
        {
          headers: {
            'Authorization': `token ${API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({ text: query })
        }
      );
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "API call failed");
        setApiResponse(null);
      } else {
        setApiResponse(data);
      }
    } catch (err) {
      setError("Network or server error");
      setApiResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">AI Text Entry (Wellagram)</h1>
      <a href="supercal://authredirect?token=dummy123">Test Mobile Redirect</a>
      <form onSubmit={searchFood} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Analyze food or drinks with AI..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="search-btn"
        >
          Search
        </button>
      </form>

      {loading && <p className="mt-4">Loading...</p>}
      {error && <div className="error-message">{error}</div>}
      {apiResponse && apiResponse.success && (
        <div className="api-results-container">
          {/* Render Items */}
          <div className="items-section">
            <h2 className="section-title">Items</h2>
            {apiResponse.data && apiResponse.data.items && apiResponse.data.items.length > 0 ? (
              apiResponse.data.items.map((item, idx) => (
                <div className="item-card" key={idx}>
                  <div className="item-header">{item.name}</div>
                  <div className="item-details">
                    <span className="portion">Portion: {item.portion}</span>
                    <span className="calories">Calories: <b>{item.calories_kcal}</b> kcal</span>
                    <span className="protein">Protein: <b>{item.protein_g}</b> g</span>
                    <span className="confidence">Confidence: {item.confidence}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-items">No items found.</div>
            )}
          </div>
          {/* Render Totals */}
          {apiResponse.data && apiResponse.data.totals && (
            <div className="totals-section">
              <h2 className="section-title">Total</h2>
              <div className="totals-details">
                <span className="calories">Calories: <b>{apiResponse.data.totals.calories_kcal}</b> kcal</span>
                <span className="protein">Protein: <b>{apiResponse.data.totals.protein_g}</b> g</span>
              </div>
            </div>
          )}
          {/* Render Assumptions */}
          {apiResponse.data && apiResponse.data.assumptions && apiResponse.data.assumptions.length > 0 && (
            <div className="assumptions-section">
              <h2 className="section-title">Assumptions</h2>
              <ul className="assumptions-list">
                {apiResponse.data.assumptions.map((assumption, idx) => (
                  <li key={idx} className="assumption-item">{assumption}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <ul className="mt-6 w-full max-w-md space-y-4">
        {/* {results.map((food) => (
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
        ))} */}
        
      </ul>
    </div>
  );
}
