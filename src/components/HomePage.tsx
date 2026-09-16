import { Show, SignInButton, SignOutButton } from "@clerk/react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";

export const HomePage = () => {
  const navigate = useNavigate();

  const goToAbout = () => {
    navigate("/about");
  };

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
        <SignInButton>
          <Button id={"home_signin"} size={"lg"}>
            Sign in
          </Button>
        </SignInButton>
      </Show>
    </>
  );
};
