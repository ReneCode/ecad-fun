// data for DynamicDialogs

class ShowDynamicDialogs {
  dialogs = new Map<string, boolean>();

  show(name: string, on: boolean) {
    this.dialogs.set(name, on);
  }

  getNames(): string[] {
    const names: string[] = [];
    this.dialogs.forEach((value, key) => {
      if (value) {
        names.push(key);
      }
    });
    return names;
  }
}

export const showDynamicDialogs = new ShowDynamicDialogs();
