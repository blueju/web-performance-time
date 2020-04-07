// 白屏时间
// Blank Time / First Time
// 参考地址：https://developer.mozilla.org/zh-CN/docs/Glossary/First_paint
function getBlankTime() {
  let paintTime = performance.getEntriesByType("paint");
  return (paintTime[0].startTime + paintTime[1].startTime) / 2;
}

// 首屏时间
// First Screen Time
function getFirstScreenTime() {
  return performance.getEntries()[0].domContentLoadedEventStart;
}

// 用户可操作时间
// DOMContentLoaded
function getUserCanOperateTime() {
  return performance.getEntries()[0].domContentLoadedEventStart;
}

// 总下载时间
// Onload
function getTotalDownloadTime() {
  return performance.getEntries()[0].loadEventEnd;
}

// 总完成时间
// Finish
function getTotalFinishTime() {
  let all = performance.getEntries();
  let list = [];
  for (const iterator of all) {
    list.push(iterator.responseEnd);
  }
  list.sort((a, b) => {
    return b - a;
  });
  return list[0];
}

// import XLSX from "xlsx";
setTimeout(() => {
  let blankTime, firstScreenTime, userCanOperateTime, totalDownloadTime, totalFinishTime;

  try {
    blankTime = getBlankTime();
    firstScreenTime = getFirstScreenTime();
    userCanOperateTime = getUserCanOperateTime();
    totalDownloadTime = getTotalDownloadTime();
    totalFinishTime = getTotalFinishTime();
  } catch (error) {
    window.location.reload(true);
    return;
  }

  let data = sessionStorage.getItem("performance-time");
  if (data) {
    data = JSON.parse(data);
    if (data.length === 10) {
      let workBook = XLSX.utils.book_new();
      let workSheet = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
      XLSX.writeFile(workBook, "性能.xlsx");
    } else {
      data.push([
        blankTime,
        firstScreenTime,
        userCanOperateTime,
        totalDownloadTime,
        totalFinishTime,
      ]);
      sessionStorage.setItem("performance-time", JSON.stringify(data));
      window.location.reload(true);
    }
  } else {
    data = [];
    data.push([blankTime, firstScreenTime, userCanOperateTime, totalDownloadTime, totalFinishTime]);
    sessionStorage.setItem("performance-time", JSON.stringify(data));
    window.location.reload(true);
  }
}, 6000);
