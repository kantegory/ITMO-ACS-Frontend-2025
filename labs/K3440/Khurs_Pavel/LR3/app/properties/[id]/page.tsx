'use client';

import { useParams } from 'next/navigation';
import { useProperty } from '@/hooks/useProperty';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Home, DoorOpen, Ruler, ParkingCircle, PawPrint, Heart } from 'lucide-react';
import { PROPERTY_TYPES } from '@/lib/constants';
import { useFavorites } from '@/contexts/FavoritesContext';

export default function PropertyPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const { property, isLoading } = useProperty(propertyId);
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  const favorite = property ? isFavorite(property.id) : false;

  const toggleFavorite = () => {
    if (!property) return;
    if (favorite) {
      removeFromFavorites(property.id);
    } else {
      addToFavorites(property.id);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8 space-y-6">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Объект не найден</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Images */}
      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
        {property.images[0] ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Нет фото
          </div>
        )}
      </div>

      {/* Title and Price */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <Badge>{PROPERTY_TYPES[property.type]}</Badge>
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {property.location.city}, {property.location.district}
          </p>
          <p className="text-sm text-muted-foreground">{property.location.address}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">
            {property.price.toLocaleString('ru-RU')} ₽
          </div>
          <div className="text-muted-foreground">/ месяц</div>
          <Button
            variant="outline"
            className="mt-2"
            onClick={toggleFavorite}
          >
            <Heart
              className={`h-4 w-4 mr-2 ${favorite ? 'fill-red-500 text-red-500' : ''}`}
            />
            {favorite ? 'В избранном' : 'Добавить в избранное'}
          </Button>
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Описание</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{property.description}</p>
        </CardContent>
      </Card>

      {/* Characteristics */}
      <Card>
        <CardHeader>
          <CardTitle>Характеристики</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Ruler className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Площадь</div>
                <div className="font-semibold">{property.characteristics.area} м²</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DoorOpen className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Комнат</div>
                <div className="font-semibold">{property.characteristics.rooms}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Этаж</div>
                <div className="font-semibold">
                  {property.characteristics.floor} / {property.characteristics.totalFloors}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ParkingCircle className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Парковка</div>
                <div className="font-semibold">
                  {property.characteristics.hasParking ? 'Есть' : 'Нет'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Животные</div>
                <div className="font-semibold">
                  {property.characteristics.petsAllowed ? 'Разрешены' : 'Запрещены'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Условия аренды</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Залог:</span>
            <span className="font-semibold">{property.conditions.deposit.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Минимальный срок:</span>
            <span className="font-semibold">{property.conditions.minTerm}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Коммунальные услуги:</span>
            <span className="font-semibold">
              {property.conditions.utilitiesIncluded ? 'Включены' : 'Не включены'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Owner */}
      <Card>
        <CardHeader>
          <CardTitle>Контакты владельца</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Имя:</span>
            <span className="font-semibold">{property.owner.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Телефон:</span>
            <span className="font-semibold">{property.owner.phone}</span>
          </div>
          <Button className="w-full mt-4">Связаться с владельцем</Button>
        </CardContent>
      </Card>
    </div>
  );
}
