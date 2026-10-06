import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createServer } from 'vite';

// 게임 정의의 TS 로딩만 기존 개발 의존성 Vite를 사용한다. Excel 작성기는 별도 도구 경로에서 로드한다.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const option = name => { const index = args.indexOf(name); return index < 0 ? undefined : args[index + 1]; };
const modules = option('--artifact-modules') ?? process.env.ZOMBIE_SHOT_ARTIFACT_MODULES;
const require = createRequire(modules ? path.join(path.resolve(modules), '_resolver.cjs') : import.meta.url);
const { Workbook, SpreadsheetFile } = await import(pathToFileURL(require.resolve('@oai/artifact-tool')).href);
const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom' });
let spec;
try { spec = await server.ssrLoadModule('/src/data/ammoSpec.ts'); } finally { await server.close(); }
const rows = spec.ammoSpecRows();
const workbook = Workbook.create();
const master = workbook.worksheets.add('Ammo_Master');
const definitions = workbook.worksheets.add('Definitions');
const balance = workbook.worksheets.add('Balance_Notes');
const validation = workbook.worksheets.add('Validation');
const column = index => { let text = ''; for (let value = index + 1; value; value = Math.floor((value - 1) / 26)) text = String.fromCharCode(65 + (value - 1) % 26) + text; return text; };
const endColumn = column(spec.SPEC_HEADERS.length - 1);
const lastRow = rows.length + 1;
function formatTable(sheet, values, name, widths) {
  const end = column(values[0].length - 1);
  const range = sheet.getRange(`A1:${end}${values.length}`);
  range.values = values;
  range.format.font = { name: 'Arial', size: 11, color: '#27352E' };
  range.format.verticalAlignment = 'top';
  range.format.wrapText = true;
  range.format.rowHeight = 68;
  sheet.showGridLines = false;
  const table = sheet.tables.add(`A1:${end}${values.length}`, true, name);
  table.showFilterButton = true;
  table.style = 'TableStyleMedium4';
  sheet.getRange(`A1:${end}1`).format = { fill: '#283D32', font: { name: 'Arial', size: 11, bold: true, color: '#FFFFFF' },
    horizontalAlignment: 'center', verticalAlignment: 'center', wrapText: true, rowHeight: 46 };
  for (let index = 0; index < values[0].length; index++) sheet.getRange(`${column(index)}1:${column(index)}${values.length}`).format.columnWidth = widths[index] ?? 28;
  sheet.freezePanes.freezeRows(1);
  return table;
}
formatTable(master, [[...spec.SPEC_HEADERS], ...rows], 'AmmoCatalog',
  [19, 18, 27, 14, 18, 16, 20, 13, 13, 10, 10, 10, 10, 10, 48, 46, 27, 31, 36, 38, 34, 30, 22, 30, 34, 62, 62, 49, 58, 65,
    12, 12, 13, 13, 13, 13, 13, 12, 13, 13, 13, 13, 13, 13, 13, 22, 13, 13, 12]);
master.freezePanes.freezeColumns(2);
master.tabColor = '#283D32';
master.getRange(`H2:N${lastRow}`).setNumberFormat('0');
master.getRange(`I2:I${lastRow}`).setNumberFormat('0%');
master.getRange(`AE2:AS${lastRow}`).setNumberFormat('0');
master.getRange(`AU2:AV${lastRow}`).setNumberFormat('0');
master.getRange(`AX2:AX${lastRow}`).setNumberFormat('0');
master.getRange(`H2:N${lastRow}`).format.horizontalAlignment = 'right';
master.getRange(`AE2:AS${lastRow}`).format.horizontalAlignment = 'right';
master.getRange(`AU2:AV${lastRow}`).format.horizontalAlignment = 'right';
// 상세 텍스트 열은 수치 표를 읽는 데 필요한 높이만 확보한다.
master.getRange(`A2:${endColumn}${lastRow}`).format.autofitRows();
master.getRange(`D2:D${lastRow}`).conditionalFormats.add('containsText', { text: '초안', format: { fill: '#FFF0C7', font: { color: '#8A5900', bold: true } } });
formatTable(definitions, [['용어', '정의'], ...spec.SPEC_DEFINITIONS], 'AmmoDefinitions', [24, 105]);
definitions.getUsedRange().format.autofitRows();
formatTable(balance, [['항목', '조정 및 관찰'], ...spec.SPEC_BALANCE_NOTES], 'AmmoBalanceNotes', [24, 105]);
balance.getUsedRange().format.autofitRows();
const summary = [
  ['확정 탄약', `=COUNTIFS(Ammo_Master!D2:D${lastRow},"확정")`, 46],
  ['초안 / 미정', `=COUNTIFS(Ammo_Master!D2:D${lastRow},"초안 / 미정")`, 1],
  ...['체력 피해', '폭발', '화상 / 점화', '상처', '충격'].map((family, index) => [family, `=COUNTIFS(Ammo_Master!E2:E${lastRow},"${family}",Ammo_Master!D2:D${lastRow},"확정")`, [24, 3, 6, 7, 6][index]]),
  ['적 계층', `=COUNTIFS(Ammo_Master!G2:G${lastRow},"적",Ammo_Master!D2:D${lastRow},"확정")+COUNTIFS(Ammo_Master!G2:G${lastRow},"적 + 탄약")+COUNTIFS(Ammo_Master!G2:G${lastRow},"적 + 탄창")+COUNTIFS(Ammo_Master!G2:G${lastRow},"적 + 탄약 + 탄창")`, 46],
  ['탄약 계층', `=COUNTIFS(Ammo_Master!G2:G${lastRow},"적 + 탄약")+COUNTIFS(Ammo_Master!G2:G${lastRow},"적 + 탄약 + 탄창")`, 7],
  ['탄창 계층', `=COUNTIFS(Ammo_Master!G2:G${lastRow},"적 + 탄창")+COUNTIFS(Ammo_Master!G2:G${lastRow},"적 + 탄약 + 탄창")`, 8],
  ['확정 화력 미정 값', `=COUNTBLANK(Ammo_Master!H2:H${lastRow - 1})`, 0],
  ['초안 화력 미정 값', `=COUNTBLANK(Ammo_Master!H${lastRow})`, 1],
];
formatTable(validation, [['검사', '현재 값', '기대 값', '차이'], ...summary.map(([name, , expected]) => [name, null, expected, null])], 'AmmoValidation', [28, 15, 15, 15]);
summary.forEach(([, formula], index) => {
  validation.getRange(`B${index + 2}`).formulas = [[formula]];
  validation.getRange(`D${index + 2}`).formulas = [[`=B${index + 2}-C${index + 2}`]];
});
validation.getRange(`B2:D${summary.length + 1}`).setNumberFormat('0');
validation.getRange(`D2:D${summary.length + 1}`).conditionalFormats.add('cellIs', { operator: 'notEqual', formula: 0, format: { fill: '#FFD9D4', font: { color: '#A82318', bold: true } } });
validation.getUsedRange().format.rowHeight = 28;
workbook.recalculate();
const mismatches = validation.getRange(`D2:D${summary.length + 1}`).values.flat().filter(value => value !== 0);
if (mismatches.length) throw new Error(`탄약 명세 개수 검사가 일치하지 않습니다: ${JSON.stringify(mismatches)}`);
const output = path.resolve(root, option('--output') ?? 'docs/ZombieShot_Ammo_Spec.xlsx');
await fs.mkdir(path.dirname(output), { recursive: true });
const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(output);
// 다시 불러와 모든 셀을 정규 데이터와 대조한다. 미정 숫자는 빈칸으로 유지한다.
const imported = await SpreadsheetFile.importXlsx(await fs.readFile(output));
const exportedRows = imported.worksheets.getItem('Ammo_Master').getRange(`A2:${endColumn}${lastRow}`).values;
for (let row = 0; row < rows.length; row++) for (let col = 0; col < spec.SPEC_HEADERS.length; col++) {
  if ((exportedRows[row][col] ?? '') !== (rows[row][col] ?? '')) throw new Error(`명세 데이터 불일치: ${column(col)}${row + 2}`);
}
await fs.rm(`${output}.inspect.ndjson`, { force: true });
const preview = option('--preview');
if (preview) {
  await fs.mkdir(path.resolve(preview), { recursive: true });
  for (const [name, range] of [['Ammo_Master', 'A1:N9'], ['Definitions', 'A1:B9'], ['Balance_Notes', 'A1:B9'], ['Validation', 'A1:D13']]) {
    const rendered = await workbook.render({ sheetName: name, range, scale: 1.4, format: 'png' });
    await fs.writeFile(path.join(path.resolve(preview), `${name}.png`), new Uint8Array(await rendered.arrayBuffer()));
  }
}
console.log(`탄약 명세 생성: ${rows.length}종 (${rows.length - 1} 확정, 1 초안), ${spec.SPEC_HEADERS.length}열, 모든 셀 재대조 통과`);
