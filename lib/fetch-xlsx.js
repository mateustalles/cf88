import fs from 'fs';
import excel from 'exceljs';

const sheetList = [
  ['TESE SEM REPERCUSSÃO GERAL', 'teses-sem-repercussao-geral'],
  ['TESE COM REPERCUSSÃO GERAL', 'teses-com-repercussao-geral'],
  ['SÚMULA VINCULANTE', 'sumula-vinculante'],
  ['SÚMULA STJ', 'sumula-stj'],
  ['SÚMULA STF', 'sumula-stf'],
]

export const fetchXlsx = (data) => {
  let workbook = new excel.Workbook();
  sheetList.forEach(([sheetName, sheetSlug]) => {
    let worksheet = workbook.addWorksheet(sheetName);
    const sheetData = data.filter((row) => Object.keys(row)[0] === sheetSlug)
      .map((item) => item[sheetSlug]['data'])

    worksheet.columns = Object.values(sheetData[0]).map((item, index) => {
      if(index === 0) return { header: 'SÚMULA/CASO', key: 'SÚMULA/CASO', width: 20 };
      return { header: Object.keys(item)[0], key: Object.keys(item)[0], width: 30 } ;
    });

    let columnIndex = 1;
    for (columnIndex; columnIndex <= worksheet.columnCount; columnIndex++) {
        worksheet.getColumn(columnIndex).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    }

    worksheet.addRows(sheetData.map((row) => Object.values(row).map(
        (item) => {
        const [[, value]] = Object.entries(item);
        return value;
      })));

  });
  const date = new Date().toLocaleString('pt-BR')
    .replace(/[/+:+\s+]/g, '-').replace(/[,+]/, '').replace(/[AM]+[PM]+/, '');

  return workbook.xlsx.writeFile(`${date}backup.xlsx`)
}
