import fs from "node:fs"
import type {DataProvider} from "$lib/interfaces";

export class DataProviderLocal implements DataProvider {

  rootDir: string = "./local_data/";

  constructor() {
    if (!fs.existsSync(this.rootDir)) {
      console.error(`DataProviderLocal.init - rootDir ${this.rootDir} does not exist, creating...`);
      fs.mkdirSync(this.rootDir);
    }
    return;
  }

  createDir(name: string): void {
    if (!fs.existsSync(this.rootDir + name))
      fs.mkdirSync(this.rootDir + name);
    return;
  }

  writeFile(name: string, content: Buffer): void {
    fs.writeFile(this.rootDir + name, content, () => {});
    return;
    
    // return new Promise<void>((resolve, reject) => {
    //   content.arrayBuffer().then((value: ArrayBuffer) => {
    //     fs.writeFileSync(this.rootDir + name, Buffer.from(value));
    //     resolve();
    //   });
    // });
  }
  
  getFile(name: string): Buffer | undefined {
    if (!fs.existsSync(this.rootDir + name)) {
      console.error(`DataProviderLocal.getFile - file ${name} does not exist!`);
      return undefined;
    }
    else {
      let file = fs.readFileSync(this.rootDir + name)
      return file;
    }
  }
  
}