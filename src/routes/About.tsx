import { useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Briefcase,
  ChartColumn,
  ListOrdered,
  Tags,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import "./About.scss";

const features = [
  {
    icon: Briefcase,
    title: "Track applications",
    description:
      "Log every application with its company, role, status and notes in one place.",
  },
  {
    icon: Tags,
    title: "Organize with tags",
    description:
      "Color-coded tags for work location and contacts keep things easy to scan.",
  },
  {
    icon: ChartColumn,
    title: "See your stats",
    description:
      "Find out how many applications you send, your response rates, and how long rejections take.",
  },
];

const stack = [
  "React",
  "TypeScript",
  "Vite",
  "Tailwind CSS",
  "shadcn/ui",
  "Spring Boot",
  "MySQL",
  "Clerk",
];

export const About = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => document.documentElement.classList.remove("dark");
  }, []);

  return (
    <main className="about_page">
      <Button
        variant="ghost"
        size="sm"
        className="about_back"
        onClick={() => navigate("/")}
      >
        <ArrowLeft />
        Back
      </Button>

      <header className="about_hero">
        <h1>About JobTracker</h1>
        <p>
          JobTracker helps you keep track of your job search, from the first
          application to the final offer. This website was built mainly as a
          place to store and track my applications. Additionally, it was made as
          a project to help build my programming experience.
        </p>
      </header>

      <section className="about_section">
        <h2>Features</h2>
        <div className="about_features">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader>
                <Icon className="about_feature_icon" />
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="about_section">
        <h2>Built with</h2>
        <ul className="about_stack">
          {stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </section>

      <section className="about_section">
        <h2>About me</h2>
        <Card>
          <CardContent className="about_me">
            <p>
              Hi, I'm Dallas, an aspiring junior software developer based in
              Canada ON. I'm passionate about programming and always looking for
              opportunities to build my programming knowledge.
            </p>
            <div className="about_links">
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={
                  <a
                    href="https://github.com/Dotuu"
                    target="_blank"
                    rel="noreferrer"
                  />
                }
              >
                GitHub
              </Button>
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={
                  <a
                    href="https://www.linkedin.com/in/dallastucker"
                    target="_blank"
                    rel="noreferrer"
                  />
                }
              >
                LinkedIn
              </Button>
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<a href="mailto:dallasktucker@gmail.com" />}
              >
                Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};
