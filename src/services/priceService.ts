import axios from "axios";
import type { MaterialType, Tier } from "../constants/gameData";

const ALBION_DATA_API =
  "https://www.albion-online-data.com/api/v2/stats/prices";

// City IDs for Albion Data Project API
const CITIES = {
  Caerleon: "Caerleon",
  Martlock: "Martlock",
  Bridgewatch: "Bridgewatch",
  Lymhurst: "Lymhurst",
  "Fort Sterling": "Fort Sterling",
  Thetford: "Thetford",
} as const;

export type City = keyof typeof CITIES;

// Item ID patterns for Albion Online
const getItemId = (
  materialType: MaterialType,
  tier: Tier,
  isRefined: boolean = false
): string => {
  const tierNames = {
    ore: isRefined
      ? [
          "",
          "",
          "METALBAR",
          "METALBAR",
          "METALBAR",
          "METALBAR",
          "METALBAR",
          "METALBAR",
          "METALBAR",
        ]
      : ["", "", "ORE", "ORE", "ORE", "ORE", "ORE", "ORE", "ORE"],
    hide: isRefined
      ? [
          "",
          "",
          "LEATHER",
          "LEATHER",
          "LEATHER",
          "LEATHER",
          "LEATHER",
          "LEATHER",
          "LEATHER",
        ]
      : ["", "", "HIDE", "HIDE", "HIDE", "HIDE", "HIDE", "HIDE", "HIDE"],
    fiber: isRefined
      ? ["", "", "CLOTH", "CLOTH", "CLOTH", "CLOTH", "CLOTH", "CLOTH", "CLOTH"]
      : ["", "", "FIBER", "FIBER", "FIBER", "FIBER", "FIBER", "FIBER", "FIBER"],
    wood: isRefined
      ? [
          "",
          "",
          "PLANKS",
          "PLANKS",
          "PLANKS",
          "PLANKS",
          "PLANKS",
          "PLANKS",
          "PLANKS",
        ]
      : ["", "", "WOOD", "WOOD", "WOOD", "WOOD", "WOOD", "WOOD", "WOOD"],
    stone: isRefined
      ? [
          "",
          "",
          "STONEBLOCK",
          "STONEBLOCK",
          "STONEBLOCK",
          "STONEBLOCK",
          "STONEBLOCK",
          "STONEBLOCK",
          "STONEBLOCK",
        ]
      : ["", "", "ROCK", "ROCK", "ROCK", "ROCK", "ROCK", "ROCK", "ROCK"],
  };

  const baseName = tierNames[materialType][tier];
  return `T${tier}_${baseName}`;
};

export interface PriceData {
  item_id: string;
  city: string;
  quality: number;
  sell_price_min: number;
  sell_price_max: number;
  buy_price_min: number;
  buy_price_max: number;
  sell_price_min_date: string;
  sell_price_max_date: string;
  buy_price_min_date: string;
  buy_price_max_date: string;
}

export interface MaterialPrices {
  rawMaterialPrice: number;
  refinedMaterialPrice: number;
  lowerTierRefinedPrice: number;
}

export const fetchMaterialPrices = async (
  materialType: MaterialType,
  tier: Tier,
  cities: City[] = ["Caerleon"]
): Promise<MaterialPrices> => {
  try {
    const rawMaterialId = getItemId(materialType, tier, false);
    const refinedMaterialId = getItemId(materialType, tier, true);
    const lowerTierRefinedId =
      tier > 2 ? getItemId(materialType, (tier - 1) as Tier, true) : "";

    const itemIds = [rawMaterialId, refinedMaterialId];
    if (lowerTierRefinedId) {
      itemIds.push(lowerTierRefinedId);
    }

    const response = await axios.get<PriceData[]>(ALBION_DATA_API, {
      params: {
        items: itemIds.join(","),
        locations: cities.map((city) => CITIES[city]).join(","),
        qualities: "1", // Normal quality
      },
    });

    const priceData = response.data;

    // Find prices for each material type
    const rawPriceData = priceData.find(
      (item) => item.item_id === rawMaterialId
    );
    const refinedPriceData = priceData.find(
      (item) => item.item_id === refinedMaterialId
    );
    const lowerTierPriceData = lowerTierRefinedId
      ? priceData.find((item) => item.item_id === lowerTierRefinedId)
      : null;

    return {
      rawMaterialPrice: rawPriceData?.sell_price_min || 0,
      refinedMaterialPrice: refinedPriceData?.buy_price_max || 0,
      lowerTierRefinedPrice: lowerTierPriceData?.sell_price_min || 0,
    };
  } catch (error) {
    console.error("Error fetching material prices:", error);
    // Return default prices if API fails
    return {
      rawMaterialPrice: 100,
      refinedMaterialPrice: 300,
      lowerTierRefinedPrice: 200,
    };
  }
};

export const getAllCityPrices = async (
  materialType: MaterialType,
  tier: Tier
): Promise<Record<City, MaterialPrices>> => {
  const cities = Object.keys(CITIES) as City[];
  const results: Record<City, MaterialPrices> = {} as Record<
    City,
    MaterialPrices
  >;

  try {
    const promises = cities.map(async (city) => {
      const prices = await fetchMaterialPrices(materialType, tier, [city]);
      return { city, prices };
    });

    const cityPrices = await Promise.all(promises);

    cityPrices.forEach(({ city, prices }) => {
      results[city] = prices;
    });

    return results;
  } catch (error) {
    console.error("Error fetching all city prices:", error);
    // Return default prices for all cities if API fails
    cities.forEach((city) => {
      results[city] = {
        rawMaterialPrice: 100,
        refinedMaterialPrice: 300,
        lowerTierRefinedPrice: 200,
      };
    });
    return results;
  }
};
