class ObjectStorageService {
  public create(
    projectId: string,
    id: string,
    obj: { [index: string]: unknown; id: string }
  ) {}
}

const objectStorageService = new ObjectStorageService();

export default objectStorageService;
