import proj4 from 'proj4';

const w = { 7: "가", 8: "나", 9: "다", 10: "라", 11: "마", 12: "바", 13: "사" };
const h = { 13: "가", 14: "나", 15: "다", 16: "라", 17: "마", 18: "바", 19: "사", 20: "아" };
const grs80 = "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs";
const wgs84 = "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees";

function converter(codinate) {
    var wgs84P = proj4(wgs84, grs80, codinate);
    var wP = parseInt(wgs84P[0].toString().split(".")[0]);
    var hP = parseInt(wgs84P[1].toString().split(".")[0]);
    var code = [w[parseInt(parseInt(wP) / 100000)] + h[parseInt(parseInt(hP) / 100000)], parseInt(wP % 100000 / 10), parseInt(hP % 100000 / 10)]
    console.log(wP, hP);
    return code;
}
function pointXY() {
    var p;
    var pArr = [];
    for (var x = 700000; x <= 1300000; x += 100000) {
        var t = [];
        for (var y = 1300000; y <= 2100000; y += 100000) {
            p = proj4(grs80, wgs84, [x, y]);
            t.push(p);
        }
        pArr.push(t);
    }
    return pArr;
}
function lineArray() {
    var pArr = pointXY();
    var reArr = []
    for (var i = 0; i < pArr.length; i++) {
        for (var j = 0; j < pArr[i].length; j++) {
            console.log(pArr[i]);
            if (i < pArr.length - 1 && j < pArr[i].length - 1) {
                var c = pArr[i][j];
                var nx = pArr[i + 1][j];
                var ny = pArr[i][j + 1];
                var nxy = pArr[i + 1][j + 1];
                var cbc = converter([(nxy[0] + c[0]) / 2, (nxy[1] + c[1]) / 2])
                if (cbc != undefined) {
                    cbc = cbc[0]
                } else {
                    cbc = "dd"
                }
                console.log("dddddd", cbc);
                reArr.push({
                    latLongArr: [[c[1], c[0]], [nx[1], nx[0]], [nxy[1], nxy[0]], [ny[1], ny[0]]],
                    id: i.toString() + j.toString() + "x",
                    cbcText: cbc
                });
            }
        }
    }
    return reArr;
}
export default { converter, lineArray };