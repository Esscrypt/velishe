"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { SearchResultSkeleton } from "@/components/Skeleton";
import { Model } from "@/types/model";

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [allModels, setAllModels] = useState<Model[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(true);

  useEffect(() => {
    fetch("/api/models")
      .then((res) => res.json())
      .then((data) => setAllModels(data))
      .catch(() => setAllModels([]))
      .finally(() => setIsLoadingModels(false));
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

      <form
        className="relative mb-8"
        toolname="searchModels"
        tooldescription="Find a Velishe signed model by name and list matching profiles on this page."
        toolautosubmit=""
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          setSearchQuery(String(formData.get("query") ?? ""));
        }}
      >
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="search"
          name="query"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name..."
          className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-lg"
          autoFocus
          toolparamdescription="Model name or slug to search"
        />
      </form>

      {searchQuery.trim() && (
        <div>
          {isLoadingModels ? (
            <SearchResultSkeleton />
          ) : filteredModels.length > 0 ? (
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
              No models found matching &quot;{searchQuery}&quot;
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
