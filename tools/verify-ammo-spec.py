"""Excel 파일 검증만 수행한다. 작성 라이브러리나 추가 Python 패키지가 필요하지 않다."""
import json
import sys
import zipfile
from xml.etree import ElementTree as ET

NS = {"s": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
expected = json.load(sys.stdin)
with zipfile.ZipFile(sys.argv[1]) as archive:
    shared = ET.fromstring(archive.read("xl/sharedStrings.xml"))
    strings = ["".join(node.itertext()) for node in shared.findall("s:si", NS)]
    sheet = ET.fromstring(archive.read("xl/worksheets/sheet1.xml"))
    actual = {}
    for cell in sheet.findall(".//s:sheetData/s:row/s:c", NS):
        value = cell.find("s:v", NS)
        if value is None:
            actual[cell.attrib["r"]] = "".join(cell.find("s:is", NS).itertext()) if cell.find("s:is", NS) is not None else None
        elif cell.attrib.get("t") == "s":
            actual[cell.attrib["r"]] = strings[int(value.text)]
        elif cell.attrib.get("t") in ("str", "inlineStr"):
            actual[cell.attrib["r"]] = value.text
        else:
            actual[cell.attrib["r"]] = float(value.text)

    def column(index):
        result = ""
        index += 1
        while index:
            index, remainder = divmod(index - 1, 26)
            result = chr(65 + remainder) + result
        return result

    matrix = [expected["headers"], *expected["rows"]]
    for row_index, row in enumerate(matrix, 1):
        for col_index, value in enumerate(row):
            address = f"{column(col_index)}{row_index}"
            found = actual.get(address)
            assert (found if found is not None else "") == (value if value is not None else ""), f"명세/코드 불일치: {address}: {found!r} != {value!r}"
    assert len(sheet.findall(".//s:sheetData/s:row", NS)) == len(matrix), "명세 행 개수 불일치"
    pane = sheet.find("s:sheetViews/s:sheetView/s:pane", NS)
    assert pane is not None and pane.attrib.get("topLeftCell") == "C2", "헤더 및 이름 열 고정 누락"
    table = ET.fromstring(archive.read("xl/tables/table1.xml"))
    assert table.find("s:autoFilter", NS) is not None, "필터 누락"
    assert table.attrib["ref"] == f"A1:{column(len(expected['headers']) - 1)}{len(matrix)}", "필터 범위 불일치"
    book = ET.fromstring(archive.read("xl/workbook.xml"))
    assert [node.attrib["name"] for node in book.findall("s:sheets/s:sheet", NS)] == ["Ammo_Master", "Definitions", "Balance_Notes", "Validation"], "시트 구성 불일치"
print(f"탄약 명세 검증 통과: {len(expected['rows'])}행, {len(expected['headers'])}열, 모든 셀·고정·필터·시트 확인")
