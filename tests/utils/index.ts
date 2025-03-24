import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

export const parseParams = (querystring: string) => {
	const params = new URLSearchParams(querystring.replace(/\?/, ''));
	const obj: Record<string, null | string | string[]> = {};
	for (const key of params.keys()) {
		if (params.getAll(key).length > 1) {
			obj[key] = params.getAll(key);
		} else {
			const value = params.get(key);
			if (value === 'null') {
				obj[key] = null;
			} else {
				obj[key] = value;
			}
		}
	}
	return obj;
};

export const stringify = (query: object) => {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(query)) {
		if (Array.isArray(value)) {
			for (const item of value) {
				params.append(key, item);
			}
		} else {
			(value === 0 || value || value === null) && params.append(key, value);
		}
	}
	return params.toString();
};


export const getLatestBatchOrderFileName = (customerOrderType: string) => {
	const directoryPath = path.resolve(__dirname, `../testFiles/batchOrders/createOrders/${customerOrderType}/Modified`);
	const files = fs.readdirSync(directoryPath);
	const xlsxFiles = files.filter(file => file.endsWith('.xlsx'));
	if (xlsxFiles.length === 0) {
		throw new Error('No .xlsx files found in the directory');
	}
	xlsxFiles.sort((a, b) => fs.statSync(path.join(directoryPath, b)).mtime.getTime() - fs.statSync(path.join(directoryPath, a)).mtime.getTime());
	console.log(`useFile: ${xlsxFiles[0]}`);
	return xlsxFiles[0];
}

export const getRowColumnValueFromLatestBatchOrderFile = (customerOrderType: string, columnName: string, rowIndex: number = 1) => {		
	const fileName = getLatestBatchOrderFileName(customerOrderType);
	const filePath = path.resolve(__dirname, `../testFiles/batchOrders/createOrders/${customerOrderType}/Modified/${fileName}`);
	const workbook = XLSX.readFile(filePath);
	const sheetName = workbook.SheetNames[0];
	const sheet = workbook.Sheets[sheetName];
	const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
	const ColumnRow = rows[0];
	if (ColumnRow) {		
		const columnIndex = (ColumnRow as any[])?.findIndex(column => column === columnName);
		if (columnIndex !== -1 && rows[rowIndex][columnIndex]) {
			console.log(`useColumnValue: ${columnName} ${rows[rowIndex][columnIndex]}`);
			return rows[rowIndex][columnIndex];
		} else {
			throw new Error(`No ${columnName} Found in ${filePath}`);
		}
	} else {
		throw new Error(`No Row Found in ${filePath}`);
	}	
}