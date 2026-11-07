import notFoundImg from "@/assets/404.png";
import "./NotFound.scss";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export const NotFound = () => {
  return (
    <div className="div_404">
      <img className="img_404" src={notFoundImg} alt="Page not found"></img>
      <p>Uhoh, The page can't be found!</p>
      <Link to={"/"}>
        <Button className="btn_404">Take me home</Button>
      </Link>
    </div>
  );
};
