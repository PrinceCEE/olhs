import { config, DotenvConfigOutput } from 'dotenv';
import { resolve } from 'path';

export default () => {
  let configPath: string = process.env.NODE_ENV || "development";
  let result: DotenvConfigOutput;
  switch(configPath) {
    case "development":
      result = config({ path: resolve(process.cwd(), ".development.env") });
      break;
    case "production":
      result = config({ path: resolve(process.cwd(), ".production.env") });
      break;
  }

  if(result.error) {
    throw Error(result.error.message);
  }
};