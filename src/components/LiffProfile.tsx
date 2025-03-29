import { useLiff } from "@/contexts/LiffContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect } from "react";

const LiffProfile = () => {
  const { isLiffInitialized, isLoggedIn, isInClient, profile, os, error, login, logout } = useLiff();

  useEffect(() => {
    console.log('====== LiffProfile Component ======');
    console.log('LIFF Error:', error);
    console.log('LIFF Initialized:', isLiffInitialized);
    console.log('LIFF Logged In:', isLoggedIn);
    console.log('LIFF Is In Client:', isInClient);
    console.log('LIFF OS:', os);
    console.log('LIFF Profile Data:', profile);
    console.log('================================');
  }, [isLiffInitialized, isLoggedIn, isInClient, profile, os, error]);

  if (error) {
    console.log('LIFF Error State:', error.message);
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-red-500">LIFF Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!isLiffInitialized) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Initializing LINE LIFF...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>LINE Profile</CardTitle>
        <CardDescription>
          {isInClient 
            ? "You are using the LINE app browser" 
            : "You are using an external browser"}
          {os && ` (${os})`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoggedIn && profile ? (
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              {profile.pictureUrl ? (
                <AvatarImage src={profile.pictureUrl} alt={profile.displayName} />
              ) : (
                <AvatarFallback>{profile.displayName.substring(0, 2)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-medium">{profile.displayName}</h3>
              {profile.statusMessage && (
                <p className="text-sm text-gray-500">{profile.statusMessage}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">ID: {profile.userId}</p>
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            <p>Not logged in with LINE</p>
            <Button onClick={login} className="mt-2">
              Login with LINE
            </Button>
          </div>
        )}
      </CardContent>
      {isLoggedIn && (
        <CardFooter>
          <Button variant="outline" onClick={logout} className="w-full">
            Logout from LINE
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default LiffProfile; 