import { Show, SignInButton, SignOutButton, useAuth } from "@clerk/react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export const HomePage = () => {
  const goToAbout = () => {
    navigate("/about");
  };

  const goToApplications = () => {
    navigate("/applications");
  };

  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      goToApplications();
    }
  }, [isLoaded, isSignedIn, goToApplications]);

  const navigate = useNavigate();

  return (
    <>
      <Button
        id={"home_about"}
        size={"lg"}
        variant={"outline"}
        onClick={goToAbout}
      >
        About
      </Button>

      <Show when="signed-in">
        <SignOutButton>
          <Button id={"home_signin"} size={"lg"}>
            Sign Out
          </Button>
        </SignOutButton>
      </Show>
      <Show when="signed-out">
        <SignInButton forceRedirectUrl={"/applications"}>
          <Button id={"home_signin"} size={"lg"}>
            Sign in
          </Button>
        </SignInButton>
      </Show>
    </>
  );
};
