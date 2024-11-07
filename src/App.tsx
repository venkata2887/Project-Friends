import React, { useState, useMemo } from 'react';
import { Search, Building2, LogIn, Plus } from 'lucide-react';
import SearchFilters from './components/SearchFilters';
import PGCard from './components/PGCard';
import type { PG } from './types';

// Mock data - replace with API calls later
const mockPGs: PG[] = [
  {
    id: 1,
    name: "Comfort Stay PG",
    address: "123 MG Road, Bangalore",
    city: "Bangalore",
    price: 12000,
    rating: 4.5,
    type: "male",
    amenities: ["WiFi", "AC", "Food", "Laundry", "Parking", "Security"],
    images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80"],
    roomTypes: ["Single", "Double", "Triple"],
    occupancy: ["Single", "Double"]
  },
  {
    id: 2,
    name: "Green View PG",
    address: "456 Koramangala, Bangalore",
    city: "Bangalore",
    price: 15000,
    rating: 4.8,
    type: "unisex",
    amenities: ["WiFi", "AC", "Food", "Gym", "Power Backup"],
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80"],
    roomTypes: ["Single", "Double"],
    occupancy: ["Single"]
  },
  {
    id: 3,
    name: "Student Hub PG",
    address: "789 HSR Layout, Bangalore",
    city: "Bangalore",
    price: 10000,
    rating: 4.2,
    type: "female",
    amenities: ["WiFi", "Food", "Security", "Library"],
    images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80"],
    roomTypes: ["Double", "Triple"],
    occupancy: ["Double", "Triple"]
  }
];

interface Filters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  amenities?: Set<string>;
  occupancy?: Set<string>;
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    amenities: new Set(),
    occupancy: new Set()
  });

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => {
      const updated = { ...prev };
      
      if ('amenity' in newFilters) {
        const amenity = newFilters.amenity as string;
        const newAmenities = new Set(prev.amenities);
        if (newFilters.checked) {
          newAmenities.add(amenity);
        } else {
          newAmenities.delete(amenity);
        }
        updated.amenities = newAmenities;
      }
      
      if ('occupancy' in newFilters) {
        const occupancy = newFilters.occupancy as string;
        const newOccupancy = new Set(prev.occupancy);
        if (newFilters.checked) {
          newOccupancy.add(occupancy);
        } else {
          newOccupancy.delete(occupancy);
        }
        updated.occupancy = newOccupancy;
      }
      
      if ('location' in newFilters) updated.location = newFilters.location as string;
      if ('minPrice' in newFilters) updated.minPrice = Number(newFilters.minPrice) || undefined;
      if ('maxPrice' in newFilters) updated.maxPrice = Number(newFilters.maxPrice) || undefined;
      if ('type' in newFilters) updated.type = newFilters.type as string;
      
      return updated;
    });
  };

  const filteredPGs = useMemo(() => {
    return mockPGs.filter(pg => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        pg.name.toLowerCase().includes(searchLower) ||
        pg.address.toLowerCase().includes(searchLower) ||
        pg.city.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;

      if (filters.location && !pg.address.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      if (filters.minPrice && pg.price < filters.minPrice) return false;
      if (filters.maxPrice && pg.price > filters.maxPrice) return false;

      if (filters.type && pg.type !== filters.type) return false;

      if (filters.amenities?.size > 0) {
        const hasAllAmenities = Array.from(filters.amenities).every(amenity =>
          pg.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }

      if (filters.occupancy?.size > 0) {
        const hasMatchingOccupancy = Array.from(filters.occupancy).some(occ =>
          pg.occupancy.includes(occ)
        );
        if (!hasMatchingOccupancy) return false;
      }

      return true;
    });
  }, [searchTerm, filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 
                bg-clip-text text-transparent">
                PG Hunt
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="btn-secondary flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Login
              </button>
              <button className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                List Your PG
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search by location, PG name, or landmark..."
            className="w-full px-4 py-3 pl-12 bg-white border border-gray-300 rounded-xl
              shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <SearchFilters onFilterChange={handleFilterChange} />
          </div>

          <div className="lg:col-span-3">
            {filteredPGs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="max-w-md mx-auto">
                  <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No PGs Found
                  </h3>
                  <p className="text-gray-500">
                    We couldn't find any PGs matching your criteria. Try adjusting your filters
                    or search terms.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPGs.map((pg) => (
                  <PGCard key={pg.id} pg={pg} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;