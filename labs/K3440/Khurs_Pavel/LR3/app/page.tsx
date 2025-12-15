'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { useProperties } from '@/hooks/useProperties';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Home, Shield, Clock, User } from 'lucide-react';

export default function HomePage() {
  const { properties, isLoading } = useProperties();
  const { isAuthenticated } = useAuth();
  const featuredProperties = properties.slice(0, 3);

  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Hero Section */}
      <section className="container">
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Найдите идеальную недвижимость для аренды
          </h1>
          <p className="text-xl text-muted-foreground">
            Квартиры, дома и студии в Москве и Санкт-Петербурге
          </p>
          <div className="flex gap-4">
            <Link href="/properties">
              <Button size="lg" className="gap-2">
                <Search className="h-5 w-5" />
                Начать поиск
              </Button>
            </Link>
            {isAuthenticated ? (
              <Link href="/profile">
                <Button size="lg" variant="outline" className="gap-2">
                  <User className="h-5 w-5" />
                  Мой профиль
                </Button>
              </Link>
            ) : (
              <Link href="/register">
                <Button size="lg" variant="outline">
                  Зарегистрироваться
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Home className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Большой выбор</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Тысячи объектов недвижимости на любой вкус и бюджет
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Безопасность</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Проверенные объявления и надежные арендодатели
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Быстро и удобно</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Найдите и забронируйте жилье за несколько минут
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Популярные предложения</h2>
          <Link href="/properties">
            <Button variant="outline">Смотреть все</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
