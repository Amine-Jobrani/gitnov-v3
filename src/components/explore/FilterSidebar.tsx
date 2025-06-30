import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Slider } from '../ui/Slider';
import { Tabs, TabsList, TabsTrigger } from '../ui/Tabs';
import { Filter, Star, MapPin, Home, Heart } from 'lucide-react';
import { ExploreResult, FilterState } from '../../types';
import { cn, formatPrice } from '../../lib/utils';
import { Link } from 'react-router-dom';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  results: ExploreResult[];
  onResultClick: (result: ExploreResult) => void;
  selectedResult: ExploreResult | null;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  results,
  onResultClick,
  selectedResult
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [likedResults, setLikedResults] = useState<Set<string>>(new Set());

  const categories = ['Activités', 'Restaurants', 'Événements'] as const;

  const handleCategoryChange = (category: string) => {
    onFilterChange({ ...filters, category: category as FilterState['category'] });
  };

  const handlePriceRangeChange = (value: number[]) => {
    onFilterChange({ ...filters, priceRange: [value[0], value[1]] as [number, number] });
  };

  const handleRadiusChange = (value: number[]) => {
    onFilterChange({ ...filters, radius: value[0] });
  };

  const handleReset = () => {
    onFilterChange({
      category: 'Activités',
      date: null,
      time: null,
      priceRange: [0, 500],
      radius: 5,
      amenities: []
    });
    setSearchTerm('');
  };

  const toggleLike = (resultId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newLiked = new Set(likedResults);
    if (newLiked.has(resultId)) {
      newLiked.delete(resultId);
    } else {
      newLiked.add(resultId);
    }
    setLikedResults(newLiked);
  };

  const filteredResults = results.filter(result =>
    result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Activités':   return '🎯';
      case 'Événements':  return '🎵';
      case 'Restaurants': return '🍽️';
      default:            return '📍';
    }
  };
  

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Explorer</h2>
          <Link to='/'>
            <Button
              variant="outline"
              size="icon"
              className="hover:bg-orange-50 hover:border-orange-200"
            >
              <Home className="w-5 h-5" />
            </Button>
          </Link>
        </div>
        
        {/* Search */}
        <div className="relative mb-6">
          <Input
            placeholder="Rechercher des lieux..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12"
          />
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {/* Category Tabs */}
        <Tabs value={filters.category} onValueChange={handleCategoryChange} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 gap-1 h-auto p-1">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="text-sm px-3 py-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Prix: {filters.priceRange[0]}MAD - {filters.priceRange[1]}MAD
          </label>
          <Slider
            value={[filters.priceRange[0], filters.priceRange[1]]}
            onValueChange={handlePriceRangeChange}
            max={[filters.priceRange[1]]}
            min={0}
            step={5}
            className="w-full"
          />
        </div>

        {/* Location Radius */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Rayon: {filters.radius}km
          </label>
          <Slider
            value={[filters.radius]}
            onValueChange={handleRadiusChange}
            max={50}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button className="flex-1 font-semibold">Appliquer</Button>
          <Button variant="outline" onClick={handleReset} className="flex-1 font-semibold">
            Réinitialiser
          </Button>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            Résultats ({filteredResults.length})
          </h3>
        </div>
        
        <div className="space-y-4">
          {filteredResults.map(result => (
            <div
              key={result.id}
              onClick={() => onResultClick(result)}
              className={cn(
                "bg-white rounded-xl border border-gray-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-orange-200",
                selectedResult?.id === result.id && "ring-2 ring-orange-500 shadow-lg border-orange-300"
              )}
            >
              <div className="flex space-x-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={result.image}
                    alt={result.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm">
                    {getCategoryIcon(result.category)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900 truncate pr-2">{result.name}</h4>
                    <button
                      onClick={(e) => toggleLike(result.id, e)}
                      className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Heart 
                        className={cn(
                          "w-5 h-5 transition-colors",
                          likedResults.has(result.id) 
                            ? "fill-red-500 text-red-500" 
                            : "text-gray-400 hover:text-red-500"
                        )} 
                      />
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{result.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{result.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{result.distance}km</span>
                      </div>
                    </div>
                    
                    <div className="text-sm font-bold text-orange-600">
                      {formatPrice(result.price)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
