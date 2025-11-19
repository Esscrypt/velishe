"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { getAllModelsSync } from "@/lib/models";
import { Model } from "@/types/model";

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [allModels, setAllModels] = useState<Model[]>(getAllModelsSync());

  useEffect(() => {
    const staticModels = getAllModelsSync();
    setAllModels(staticModels);
    
    // Fetch models from API asynchronously
    fetch("/api/models")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch models");
        }
        return res.json();
      })
      .then((dbModels: Model[]) => {
        if (Array.isArray(dbModels)) {
          // Merge logic: override all if DB has equal/more, merge if fewer, keep static if empty
          if (dbModels.length === 0) {
            // Keep static models
            return;
          } else if (dbModels.length >= staticModels.length) {
            // Override completely
            setAllModels(dbModels);
            console.log(`✅ Overrode all models with database: ${dbModels.length} models`);
          } else {
            // Merge: override matching items by slug
            const dbModelsMap = new Map<string, Model>();
            dbModels.forEach((model) => {
              dbModelsMap.set(model.slug, model);
            });
            
            const merged = staticModels.map((staticModel) => {
              const dbModel = dbModelsMap.get(staticModel.slug);
              return dbModel || staticModel;
            });
            
            setAllModels(merged);
            console.log(`✅ Merged database models (${dbModels.length}) with static models (${staticModels.length})`);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching models from API:", error);
        // Keep using initial models on error
      });
  }, []);

  const filteredModels = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase().trim();
    return allModels.filter(
      (model) =>
        model.name.toLowerCase().includes(query) ||
        model.slug.toLowerCase().includes(query)
    );
  }, [searchQuery, allModels]);

  const handleModelClick = (slug: string) => {
    router.push(`/models/${slug}/`);
  };

  const handleKeyPress = (e: React.KeyboardEvent, slug: string) => {
    if (e.key === "Enter") {
      handleModelClick(slug);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Search Models</h1>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name..."
          className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-lg"
          autoFocus
        />
      </div>

      {searchQuery.trim() && (
        <div>
          {filteredModels.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-4">
                Found {filteredModels.length} model{filteredModels.length !== 1 ? "s" : ""}
              </p>
              {filteredModels.map((model) => (
                <div
                  key={model.id}
                  onClick={() => handleModelClick(model.slug)}
                  onKeyPress={(e) => handleKeyPress(e, model.slug)}
                  tabIndex={0}
                  className="p-4 border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 cursor-pointer transition-colors"
                  role="button"
                  aria-label={`View ${model.name}`}
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {model.name}
                  </h3>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-12">
              No models found matching "{searchQuery}"
            </p>
          )}
        </div>
      )}

      {!searchQuery.trim() && (
        <p className="text-gray-600 text-center py-12">
          Start typing to search for models...
        </p>
      )}
    </div>
  );
}

