import { Arch, OS } from './types';
import path from 'path';
import fs from 'fs';

const filePath = path.join(__dirname, 'failedCases.json');

function readFileOrCreateIfNotExists(filePath: string): object {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } else {
      const emptyObject = {};
      fs.writeFileSync(filePath, JSON.stringify(emptyObject, null, 2), 'utf8');
      return emptyObject;
    }
  } catch (error) {
    console.error('Error occurred:', error);
    return {};
  }
}

interface UpdateFailedResults {
  ios?: {
    paper?: string[];
    fabric?: string[];
  };
  android?: { paper?: string[]; fabric?: string[] };
}

export function storeFailedResult(
  platform: OS,
  architecture: Arch,
  value: string
): void {
  try {
    const data = readFileOrCreateIfNotExists(filePath) as UpdateFailedResults;

    if (!data[platform]) {
      data[platform] = {};
    }

    if (!data[platform]?.[architecture]) {
      data[platform]![architecture] = [];
    }

    if (!data[platform]?.[architecture]?.includes(value)) {
      data[platform]?.[architecture]?.push(value);
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Data updated successfully:', data);
  } catch (error) {
    console.error('Error occurred while updating the file:', error);
  }
}
