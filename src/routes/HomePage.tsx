import { Show, SignInButton, SignOutButton, useAuth } from "@clerk/react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import applicationsImg from "@/assets/applications.png";
import "./HomePage.scss";

export const HomePage = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();

  const goToAbout = () => {
    navigate("/about");
  };

  const goToApplications = () => {
    navigate("/applications");
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/applications");
    }
  }, [isLoaded, isSignedIn, navigate]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => document.documentElement.classList.remove("dark");
  }, []);

  return (
    <main className="home_page">
      <div className="home_panel" aria-hidden="true" />
      <svg
        className="home_divider"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line x1="75" y1="0" x2="48" y2="100" vectorEffect="non-scaling-stroke" />
      </svg>

      <section className="home_intro">
        <h1>JobTracker</h1>
        <p>
          Keep every application, interview and offer in one place, and see how
          your job search is really going.
        </p>

        <div className="home_actions">
          <Show when="signed-in">
            <Button size="lg" className="home_cta home_cta_primary" onClick={goToApplications}>
              Applications
              <ArrowRight />
            </Button>
            <SignOutButton>
              <Button size="lg" variant="ghost" className="home_cta">
                Sign out
              </Button>
            </SignOutButton>
          </Show>
          <Show when="signed-out">
            <SignInButton forceRedirectUrl={"/applications"}>
              <Button size="lg" className="home_cta home_cta_primary">
                Get started
                <ArrowRight />
              </Button>
            </SignInButton>
          </Show>
          <Button
            size="lg"
            variant="outline"
            className="home_cta"
            onClick={goToAbout}
          >
            About
          </Button>
        </div>
      </section>

      <section className="home_showcase">
        <img
          className="home_shot"
          src={applicationsImg}
          alt="JobTracker applications table showing tracked jobs with status, location and tags"
        />
      </section>
    </main>
  );
};
