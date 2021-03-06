import { PageNode } from "../core/Project";
import "./PageList.scss";

type Props = {
  pages: PageNode[];
};
const PageList = ({ pages }: Props) => {
  return (
    <div className="page-list">
      {pages.map((p) => {
        return (
          <div key={p.id} className="page-node">
            {p.id} = {p.parent} = {p.name}
          </div>
        );
      })}
    </div>
  );
};

export default PageList;
