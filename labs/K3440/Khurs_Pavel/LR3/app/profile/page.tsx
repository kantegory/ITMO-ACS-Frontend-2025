"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { LogOut, User, Heart } from "lucide-react";
import { Property } from "@/types/property";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const { favorites } = useFavorites();
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Получаем избранные объекты
        if (favorites.length > 0) {
          const propertiesRes = await fetch("/api/properties");
          const data = await propertiesRes.json();
          const allProperties = data.properties || [];
          const favProps = allProperties.filter((p: Property) =>
            favorites.includes(p.id)
          );
          setFavoriteProperties(favProps);
        } else {
          setFavoriteProperties([]);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, favorites]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (authLoading || !user) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-muted-foreground">Загрузка...</div>
        </div>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="container py-8 space-y-6">
      {/* User Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <User className="h-6 w-6" />
                  {user.name}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  {user.email}
                  {user.phone && (
                    <>
                      <br />
                      {user.phone}
                    </>
                  )}
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Избранное */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Избранное
          </CardTitle>
          <CardDescription>Объекты, которые вы добавили в избранное</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Загрузка...
            </div>
          ) : favoriteProperties.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                У вас пока нет избранных объектов
              </p>
              <Button onClick={() => router.push("/properties")}>
                Перейти к поиску
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
