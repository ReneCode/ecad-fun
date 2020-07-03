import { wait } from "./utils";

class DocumentService {
  async open(documentId: string) {
    await wait(300);
    return {
      id: documentId,
    };
  }
}

const documentService = new DocumentService();

export default documentService;
