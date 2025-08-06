import { User, Camera, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    initials: "JD",
    joinDate: "January 2024",
    booksCreated: 12,
    totalViews: 450
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-bookcraft-secondary">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Picture & Stats */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback className="bg-bookcraft-primary text-white text-2xl">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <h2 className="text-xl font-semibold mt-4 text-center">{user.name}</h2>
                  <p className="text-gray-600 text-center">{user.email}</p>
                  
                  <div className="grid grid-cols-2 gap-4 w-full mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-bookcraft-primary">{user.booksCreated}</div>
                      <div className="text-sm text-gray-600">Books Created</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-bookcraft-primary">{user.totalViews}</div>
                      <div className="text-sm text-gray-600">Total Views</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input id="bio" placeholder="Tell us about yourself..." />
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {user.joinDate}</span>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-bookcraft-primary hover:bg-blue-700">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}