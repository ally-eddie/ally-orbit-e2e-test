import dayjs from 'dayjs';

function getDateFromToday(days: number = 0): string {
  return dayjs().add(days, 'day').format('YYYYMMDD');
}

function addSuffix (suffix: string) {
  return (originValue: string): string => {
    return `${originValue}${suffix}`
  }
}

export const config = {
  keepUploadFile: true, // 是否保留修改的檔案
  autoModifyColumns: [
    { name: '預計出貨日期', value: getDateFromToday(5) },
    { name: '指定日期', value: getDateFromToday(10) },
    { name: '出貨單號', value: addSuffix('-Ed') }
  ]
}; 