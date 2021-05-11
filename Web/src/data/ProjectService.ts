import { ObjectType, Project } from "../share";
import { Socket } from "./Socket";

const TYPE_PAGE = "page";

export class ProjectService {
  constructor(private project: Project, private socket: Socket) {}

  public getProject() {
    return this.project;
  }

  public getPages(project: Project | undefined) {
    if (!project) {
      return [];
    }

    const pages = project.query({ q: { type: TYPE_PAGE } });
    return pages;
  }

  public getPage(pageId: string) {
    const pages = this.project.query({
      q: { type: TYPE_PAGE },
    });
    return pages.find((p) => p.id === pageId);
  }

  public createPage(project: Project) {
    const pages = this.getPages(project);

    const pageName = `Page ${pages.length + 1}`;
    const page: ObjectType = {
      _parent: "0:0",
      id: project.createNewId(),
      type: TYPE_PAGE,
      name: pageName,
    };
    const [newPage] = this.createObjects([page]);
    return newPage;
  }

  // ------------------------
  // private deleteObjects(deleteObjects: string[]) {
  //   const result = this.project.deleteObjects(deleteObjects);
  //   this.socket.emit("delete-object", result);
  //   // this.setState({});

  //   return result;
  // }

  // if (result.updateObjects) {
  //   const obj = this.project.updateObjects(result.updateObjects);
  //   this.socket.emit("update-object", obj);
  //   this.setState({});
  // }
  private createObjects(createObjects: ObjectType[]) {
    const result = this.project.doCUD([
      { type: "create", data: createObjects },
    ]);
    this.socket.emit("do-cud", result);
    // this.setState({});

    return result[0].data as ObjectType[];
  }
}

//   if (pages.length === 0) {
//     return undefined;
//   }

//   const page = pages.find((p) => p.id === pageId);
//   if (!page) {
//     return undefined;
//   }
//   return page;
// };

//     // page not found - take the first page
//     const firstPage = pages[0];
//     return firstPage._children;
//   }

//   return page._children;
// };
