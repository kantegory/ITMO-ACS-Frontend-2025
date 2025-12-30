export function Footer() {
  return (
    <footer className="mt-auto border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 РентХаус. Сервис для аренды недвижимости.
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          Лабораторная работа 3 - ИТМО
        </p>
      </div>
    </footer>
  );
}
