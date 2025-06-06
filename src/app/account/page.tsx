
"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, Settings, History, Edit3, LogOut, Plane, Hotel, Ticket, PackageIcon, CheckCircle, Clock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface MockBooking {
  id: string;
  type: 'flight' | 'hotel' | 'activity' | 'package';
  destination: string;
  bookedOn: string;
  travelDates: string;
  status: 'Confirmed' | 'Upcoming' | 'Completed' | 'Cancelled';
  price: number;
  detailsLink: string;
}

const mockBookings: MockBooking[] = [
  {
    id: "booking1",
    type: "package",
    destination: "Bali, Indonesia",
    bookedOn: "2023-11-15",
    travelDates: "Dec 1 - Dec 10, 2023",
    status: "Completed",
    price: 1200,
    detailsLink: "/deals/4", // Assuming deal ID 4 corresponds to Bali
  },
  {
    id: "booking2",
    type: "flight",
    destination: "Paris, France",
    bookedOn: "2024-03-01",
    travelDates: "Oct 10 - Oct 17, 2024",
    status: "Upcoming",
    price: 350,
    detailsLink: "/deals/1", // Assuming deal ID 1 corresponds to Paris flight
  },
  {
    id: "booking3",
    type: "hotel",
    destination: "Tokyo, Japan",
    bookedOn: "2024-05-20",
    travelDates: "Nov 5 - Nov 12, 2024",
    status: "Confirmed",
    price: 840, // 120 * 7 nights
    detailsLink: "/deals/2",
  },
];


const BookingStatusIcon = ({ status }: { status: MockBooking['status']}) => {
  switch (status) {
    case 'Confirmed':
    case 'Upcoming':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'Completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'Cancelled':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <History className="h-4 w-4 text-muted-foreground" />;
  }
};

const DealTypeIcon = ({ type }: { type: MockBooking['type'] }) => {
  switch (type) {
    case 'flight': return <Plane className="h-4 w-4 text-primary" />;
    case 'hotel': return <Hotel className="h-4 w-4 text-primary" />;
    case 'activity': return <Ticket className="h-4 w-4 text-primary" />;
    case 'package': return <PackageIcon className="h-4 w-4 text-primary" />;
    default: return null;
  }
};


export default function AccountPage() {
  const handleDiscountToggleStub = (isDiscounted: boolean) => {};
  
  const [user, setUser] = useState({
    name: "Wanderer Guest",
    email: "guest@wanderweb.com",
    avatarUrl: "https://placehold.co/100x100.png",
    memberSince: "N/A",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userBookings, setUserBookings] = useState<MockBooking[]>([]);

  useEffect(() => {
    const walletConnected = localStorage.getItem("walletConnected") === "true";
    setIsLoggedIn(walletConnected);
    if (walletConnected) {
      setUser({
        name: "Valued Wanderer",
        email: "user@example.com",
        avatarUrl: "https://placehold.co/100x100.png",
        memberSince: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toLocaleDateString(), // Member for 7 days
      });
      setUserBookings(mockBookings); // Load mock bookings if logged in
    } else {
      setUserBookings([]);
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
          <Card className="md:col-span-1 shadow-xl rounded-lg">
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

          <Card className="md:col-span-2 shadow-xl rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline text-primary">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
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

              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center text-foreground">
                  <History className="mr-3 h-6 w-6 text-accent" />
                  Booking History
                </h3>
                {userBookings.length > 0 ? (
                  <div className="space-y-4">
                    {userBookings.map((booking) => (
                      <Card key={booking.id} className="bg-muted/30 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                               <CardTitle className="text-lg flex items-center">
                                <DealTypeIcon type={booking.type} />
                                <span className="ml-2">{booking.destination}</span>
                               </CardTitle>
                              <CardDescription className="text-xs">Booked on: {new Date(booking.bookedOn).toLocaleDateString()}</CardDescription>
                            </div>
                            <Badge variant={
                              booking.status === 'Completed' ? 'default' :
                              booking.status === 'Cancelled' ? 'destructive' : 'secondary'
                            } className="capitalize flex items-center gap-1.5 py-1 px-2.5 text-xs">
                              <BookingStatusIcon status={booking.status} />
                              {booking.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="text-sm space-y-1 pb-4">
                          <p><strong>Travel Dates:</strong> {booking.travelDates}</p>
                          <p><strong>Total Price:</strong> ${booking.price.toFixed(2)}</p>
                        </CardContent>
                        <CardFooter className="pt-0 pb-4">
                           <Button asChild variant="link" size="sm" className="p-0 h-auto text-accent">
                             <Link href={booking.detailsLink}>View Deal Details</Link>
                           </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="border rounded-lg p-6 bg-muted/30 text-center">
                    <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      You have no bookings yet.
                    </p>
                    <Button asChild variant="link" className="mt-2">
                      <Link href="/">Explore Deals</Link>
                    </Button>
                  </div>
                )}
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
