import React, { useState } from "react";
import { Download, Loader2, Globe } from "lucide-react";
import type { MaterialType, Tier } from "../constants/gameData";
import {
  fetchMaterialPrices,
  type City,
  type MaterialPrices,
} from "../services/priceService";

interface PriceFetcherProps {
  materialType: MaterialType;
  tier: Tier;
  onPricesUpdated: (prices: MaterialPrices) => void;
}

export const PriceFetcher: React.FC<PriceFetcherProps> = ({
  materialType,
  tier,
  onPricesUpdated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City>("Caerleon");
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

  const cities: City[] = [
    "Caerleon",
    "Martlock",
    "Bridgewatch",
    "Lymhurst",
    "Fort Sterling",
    "Thetford",
  ];

  const handleFetchPrices = async () => {
    setIsLoading(true);
    try {
      const prices = await fetchMaterialPrices(materialType, tier, [
        selectedCity,
      ]);
      onPricesUpdated(prices);
      setLastFetchTime(new Date());
    } catch (error) {
      console.error("Error fetching prices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-4 animate-slide-up">
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        <Globe className="w-5 h-5 text-blue-500" />
        Fetch Live Prices
      </h3>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            City Market
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value as City)}
            className="input-field"
            disabled={isLoading}
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleFetchPrices}
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Fetching...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Fetch Prices
            </>
          )}
        </button>

        {lastFetchTime && (
          <div className="text-xs text-gray-400 text-center">
            Last updated: {lastFetchTime.toLocaleTimeString()}
          </div>
        )}

        <div className="text-xs text-gray-500 text-center">
          Data from Albion Data Project
        </div>
      </div>
    </div>
  );
};
