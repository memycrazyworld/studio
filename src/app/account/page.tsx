
"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, Settings, History, Edit3, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

export default function AccountPage() {
  // Placeholder for discount toggle, actual logic managed by WalletConnectButton
  const handleDiscountToggleStub = (isDiscounted: boolean) => {};
  
  // Simulate user data
  const [user, setUser] = useState({
    name: "Wanderer Guest",
    email: "guest@wanderweb.com",
    avatarUrl: "https://placehold.co/100x100.png",
    memberSince: "N/A",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const walletConnected = localStorage.getItem("walletConnected") === "true";
    setIsLoggedIn(walletConnected);
    if (walletConnected) {
      setUser({
        name: "Valued Wanderer", // Could be fetched or stored
        email: "user@example.com", // Could be fetched or stored
        avatarUrl: "https://placehold.co/100x100.png", // Replace with actual avatar or placeholder
        memberSince: new Date().toLocaleDateString(), // Simulate join date
      });
    }
  }, []);


  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header onDiscountToggle={handleDiscountToggleStub} />
        <main className="flex-grow container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <User className="h-16 w-16 text-primary mb-6" />
          <h1 className="text-3xl font-bold mb-4 text-primary">Access Your Account</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Please connect your wallet to view your account details, manage preferences, and see your booking history.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/">Connect Wallet on Homepage</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onDiscountToggle={handleDiscountToggleStub} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold font-headline text-primary">My Account</h1>
          <p className="text-muted-foreground text-lg">Manage your profile, preferences, and bookings.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Profile Card */}
          <Card className="md:col-span-1 shadow-xl">
            <CardHeader className="items-center text-center">
              <Avatar className="w-24 h-24 mb-4 border-4 border-primary/20">
                <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile avatar" />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <CardDescription className="text-xs">Member Since: {user.memberSince}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
               <Button variant="outline" className="w-full">
                <Edit3 className="mr-2 h-4 w-4" /> Edit Profile (Simulated)
              </Button>
            </CardContent>
          </Card>

          {/* Other Sections Card */}
          <Card className="md:col-span-2 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-headline text-primary">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Saved Preferences Section */}
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center text-foreground">
                  <Settings className="mr-3 h-6 w-6 text-accent" />
                  Saved Preferences
                </h3>
                <p className="text-muted-foreground mb-4">
                  Your travel preferences help us find the best deals for you. You can update them on the homepage.
                </p>
                <Button asChild variant="secondary">
                  <Link href="/#preferences">Update Preferences</Link>
                </Button>
                 <Separator className="my-6" />
              </div>

              {/* Booking History Section */}
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center text-foreground">
                  <History className="mr-3 h-6 w-6 text-accent" />
                  Booking History
                </h3>
                <div className="border rounded-lg p-6 bg-muted/30 text-center">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    You have no bookings yet.
                  </p>
                  <Button asChild variant="link" className="mt-2">
                    <Link href="/">Explore Deals</Link>
                  </Button>
                </div>
              </div>
              
              <Separator className="my-6" />

              <div>
                 <h3 className="text-xl font-semibold mb-3 flex items-center text-foreground">
                    <LogOut className="mr-3 h-6 w-6 text-accent" />
                    Account Actions
                </h3>
                <Button variant="destructive" className="w-full sm:w-auto" onClick={() => alert("Simulated Logout. In a real app, this would clear session/token and redirect.")}>
                    Log Out (Simulated)
                </Button>
                <p className="text-xs text-muted-foreground mt-2">This is a simulated action for demonstration.</p>
              </div>

            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
