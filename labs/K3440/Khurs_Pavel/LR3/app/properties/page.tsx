'use client';

import { useState } from 'react';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { useProperties } from '@/hooks/useProperties';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PROPERTY_TYPES } from '@/lib/constants';
import { PropertyType } from '@/types/property';
import { Search } from 'lucide-react';

export default function PropertiesPage() {
  const [type, setType] = useState<PropertyType | undefined>();
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  const { properties, isLoading } = useProperties({
    type,
    location: location || undefined,
    minPrice,
    maxPrice,
  });

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Поиск недвижимости</h1>
        <p className="text-muted-foreground">
          Найдено объектов: {properties.length}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <aside className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Фильтры
                </h3>
              </div>

              <div className="space-y-2">
                <Label>Тип недвижимости</Label>
                <Select
                  value={type || 'all'}
                  onValueChange={(value) => setType(value === 'all' ? undefined : value as PropertyType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Все типы" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    {Object.entries(PROPERTY_TYPES).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Расположение</Label>
                <Input
                  id="location"
                  placeholder="Москва, Центральный..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minPrice">Мин. цена (₽/мес)</Label>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="От"
                  value={minPrice || ''}
                  onChange={(e) =>
                    setMinPrice(e.target.value ? parseInt(e.target.value) : undefined)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPrice">Макс. цена (₽/мес)</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="До"
                  value={maxPrice || ''}
                  onChange={(e) =>
                    setMaxPrice(e.target.value ? parseInt(e.target.value) : undefined)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Properties Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  Объекты не найдены. Попробуйте изменить фильтры.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
