/**
 * 年間歳時記・天体カレンダー 定数定義 (Annual Saijiki Calendar Constants)
 */

const cx = 1000;
const cy = 1000;
const CANVAS_SIZE = 2000;
const svgNS = "http://www.w3.org/2000/svg";

const MS_PER_HOUR = 3600000;
const MS_PER_DAY = 86400000;
const DAYS_IN_YEAR = 365;
const DEGREES_PER_DAY = 360.0 / 365.0; // 約0.9863度/日
const RAD_TO_DEG = 180 / Math.PI;
const DEG_TO_RAD = Math.PI / 180;

// 天文学定数 (ユリウス日・J2000.0・地球赤道傾斜角)
const JD_UNIX_EPOCH = 2440587.5;
const J2000_EPOCH_JD = 2451545.0;
const EARTH_OBLIQUITY_DEG = 23.4397;

// 同心円バンド半径定義 (Concentric Ring Bands)
const ANNUAL_RINGS = {
    centerPivot:     25,
    seasonsInner:    180,
    seasonsOuter:    260,
    sekki24Inner:    260,
    sekki24Outer:    400,
    kou72Inner:      400,
    kou72Outer:      550,
    dateGridInner:   550,
    dateGridOuter:   680,
    saijikiInner:    680,
    saijikiOuter:    810,
    mansions27Inner: 810,
    mansions27Outer: 890,
    zodiac12Inner:   890,
    zodiac12Outer:   960
};

const STORAGE_KEY_ANNUAL_SETTINGS = 'annualSaijikiSettingsV1';
const STORAGE_KEY_ANNUAL_EVENTS = 'polarCalendarUserEventsV1';

window.cx = cx;
window.cy = cy;
window.CANVAS_SIZE = CANVAS_SIZE;
window.svgNS = svgNS;
window.MS_PER_HOUR = MS_PER_HOUR;
window.MS_PER_DAY = MS_PER_DAY;
window.DAYS_IN_YEAR = DAYS_IN_YEAR;
window.DEGREES_PER_DAY = DEGREES_PER_DAY;
window.RAD_TO_DEG = RAD_TO_DEG;
window.DEG_TO_RAD = DEG_TO_RAD;
window.JD_UNIX_EPOCH = JD_UNIX_EPOCH;
window.J2000_EPOCH_JD = J2000_EPOCH_JD;
window.EARTH_OBLIQUITY_DEG = EARTH_OBLIQUITY_DEG;
window.ANNUAL_RINGS = ANNUAL_RINGS;
window.STORAGE_KEY_ANNUAL_SETTINGS = STORAGE_KEY_ANNUAL_SETTINGS;
window.STORAGE_KEY_ANNUAL_EVENTS = STORAGE_KEY_ANNUAL_EVENTS;
