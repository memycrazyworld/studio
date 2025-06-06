import { Logo } from "@/components/shared/Logo";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";

interface HeaderProps {
  onDiscountToggle: (isDiscounted: boolean) => void;
}

export function Header({ onDiscountToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <WalletConnectButton onDiscountToggle={onDiscountToggle} />
      </div>
    </header>
  );
}
